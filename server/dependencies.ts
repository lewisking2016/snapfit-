import { HeadBucketCommand, S3Client } from '@aws-sdk/client-s3';
import { Pool } from 'pg';
import { createClient } from 'redis';

import type { ServerConfig } from './config.ts';
import type { DependencyStatus } from './app.ts';
import { createRedisOtpStore } from './auth/redis-otp-store.ts';
import { createPostgresAuthRepository } from './auth/postgres-repository.ts';

type Probe = () => Promise<boolean>;

export function createDependencyProbe(checks: Record<keyof DependencyStatus, Probe>) {
  return async (): Promise<DependencyStatus> => {
    const results = await Promise.all(
      Object.entries(checks).map(async ([name, check]) => {
        try {
          return [name, await check()] as const;
        } catch {
          return [name, false] as const;
        }
      }),
    );
    return Object.fromEntries(results) as DependencyStatus;
  };
}

export function createServiceDependencies(config: ServerConfig) {
  const database = config.databaseUrl
    ? new Pool({
        connectionString: config.databaseUrl,
        ssl: config.nodeEnv === 'production' ? { rejectUnauthorized: true } : undefined,
        connectionTimeoutMillis: 2000,
        query_timeout: 2000,
        max: 5,
      })
    : null;

  const redis = config.redisUrl
    ? createClient({
        url: config.redisUrl,
        socket: {
          connectTimeout: 2000,
          reconnectStrategy: (retries) => retries > 2 ? new Error('Redis unavailable') : Math.min(retries * 200, 1000),
        },
      })
    : null;

  const objectStorage =
    config.objectStorageUrl &&
    config.objectStorageBucket &&
    config.objectStorageAccessKeyId &&
    config.objectStorageSecretAccessKey
      ? new S3Client({
          endpoint: config.objectStorageUrl,
          region: 'us-east-1',
          forcePathStyle: true,
          maxAttempts: 1,
          credentials: {
            accessKeyId: config.objectStorageAccessKeyId,
            secretAccessKey: config.objectStorageSecretAccessKey,
          },
        })
      : null;

  const authRepository = database ? createPostgresAuthRepository(database) : null;
  const otpStore = redis && config.sessionSecret
    ? createRedisOtpStore(redis, config.sessionSecret)
    : null;

  const probe = createDependencyProbe({
    database: async () => {
      if (!database) return false;
      await database.query('SELECT 1');
      return true;
    },
    redis: async () => {
      if (!redis) return false;
      if (!redis.isOpen) await redis.connect();
      return (await redis.ping()) === 'PONG';
    },
    objectStorage: async () => {
      if (!objectStorage || !config.objectStorageBucket) return false;
      const abortController = new AbortController();
      const timeout = setTimeout(() => abortController.abort(), 2000);
      try {
        await objectStorage.send(
          new HeadBucketCommand({ Bucket: config.objectStorageBucket }),
          { abortSignal: abortController.signal },
        );
        return true;
      } finally {
        clearTimeout(timeout);
      }
    },
  });

  return {
    probe,
    authRepository,
    otpStore,
    close: async () => {
      await Promise.all([
        database?.end(),
        redis?.isOpen ? redis.quit() : Promise.resolve(),
        objectStorage?.destroy(),
      ]);
    },
  };
}