import express, { type Express, type Request, type Response } from 'express';

import type { ServerConfig } from './config.ts';

export type DependencyStatus = {
  database: boolean;
  redis: boolean;
  objectStorage: boolean;
};

type AuthApi = {
  requestOtp: (email: unknown, source?: string) => Promise<{ status: number; body: unknown }>;
  verifyOtp: (input: {
    email?: unknown;
    code?: unknown;
    acceptedTermsVersion?: unknown;
    acceptedPrivacyVersion?: unknown;
  }) => Promise<{ status: number; body: unknown }>;
  refresh: (token: unknown) => Promise<{ status: number; body: unknown }>;
  logout: (token: unknown) => Promise<{ status: number; body: unknown }>;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function createApp(
  config: ServerConfig,
  checkDependencies: () => Promise<DependencyStatus> = async () => ({
    database: false,
    redis: false,
    objectStorage: false,
  }),
  auth: AuthApi | null = null,
): Express {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({ limit: '64kb', strict: true }));
  app.use((_request: Request, response: Response, next) => {
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.setHeader('X-Frame-Options', 'DENY');
    response.setHeader('Referrer-Policy', 'no-referrer');
    response.setHeader('Cache-Control', 'no-store');

    const origin = _request.header('origin');
    const developmentOrigin = config.nodeEnv !== 'production' && origin && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);
    if (origin && (origin === config.webOrigin || developmentOrigin)) {
      response.setHeader('Access-Control-Allow-Origin', origin);
      response.setHeader('Vary', 'Origin');
      response.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
      response.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    }

    if (_request.method === 'OPTIONS') {
      response.status(204).end();
      return;
    }
    next();
  });

  app.get('/health/live', (_request, response) => {
    response.status(200).json({ status: 'live' });
  });

  app.get('/health/ready', async (_request, response) => {
    const dependencies = await checkDependencies();
    const configured = Boolean(
      config.databaseUrl &&
      config.redisUrl &&
      config.objectStorageUrl &&
      config.objectStorageBucket &&
      config.objectStorageAccessKeyId &&
      config.objectStorageSecretAccessKey,
    );
    const ready = configured && Object.values(dependencies).every(Boolean);
    response.status(ready ? 200 : 503).json({
      status: ready ? 'ready' : 'not_ready',
      dependencies,
    });
  });

  app.post('/auth/otp/request', async (request, response) => {
    if (!auth) return response.status(503).json({ error: 'Sign-in is not configured on this server.' });
    const email = isRecord(request.body) ? request.body.email : undefined;
    const result = await auth.requestOtp(email, request.ip);
    return response.status(result.status).json(result.body);
  });

  app.post('/auth/otp/verify', async (request, response) => {
    if (!auth) return response.status(503).json({ error: 'Sign-in is not configured on this server.' });
    const body = isRecord(request.body) ? request.body : {};
    const result = await auth.verifyOtp({
      email: body.email,
      code: body.code,
      acceptedTermsVersion: body.acceptedTermsVersion,
      acceptedPrivacyVersion: body.acceptedPrivacyVersion,
    });
    return response.status(result.status).json(result.body);
  });

  app.post('/auth/refresh', async (request, response) => {
    if (!auth) return response.status(503).json({ error: 'Sign-in is not configured on this server.' });
    const refreshToken = isRecord(request.body) ? request.body.refreshToken : undefined;
    const result = await auth.refresh(refreshToken);
    return response.status(result.status).json(result.body);
  });

  app.post('/auth/logout', async (request, response) => {
    if (!auth) return response.status(503).json({ error: 'Sign-in is not configured on this server.' });
    const authorization = request.header('authorization') ?? '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : null;
    const result = await auth.logout(token);
    if (result.status === 204) return response.status(204).end();
    return response.status(result.status).json(result.body);
  });

  app.use((_request, response) => {
    response.status(404).json({ error: 'Not found.' });
  });

  return app;
}