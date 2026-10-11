export type RuntimeEnvironment = 'development' | 'test' | 'production';

export type ServerConfig = {
  nodeEnv: RuntimeEnvironment;
  host: string;
  port: number;
  sessionSecret: string | null;
  databaseUrl: string | null;
  redisUrl: string | null;
  objectStorageUrl: string | null;
  objectStorageBucket: string | null;
  objectStorageAccessKeyId: string | null;
  objectStorageSecretAccessKey: string | null;
  emailDeliveryUrl: string | null;
  emailDeliveryToken: string | null;
  emailFromAddress: string | null;
  termsVersion: string;
  privacyVersion: string;
  webOrigin: string | null;
};

type Environment = Record<string, string | undefined>;

function parseUrl(name: string, raw: string, allowedProtocols: string[]): URL {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error(`${name} must be a valid URL.`);
  }
  if (!allowedProtocols.includes(url.protocol)) {
    throw new Error(`${name} must use ${allowedProtocols.join(' or ')}.`);
  }
  return url;
}

export function loadConfig(environment: Environment = process.env): ServerConfig {
  const rawNodeEnv = environment.NODE_ENV ?? 'development';
  if (!['development', 'test', 'production'].includes(rawNodeEnv)) {
    throw new Error('NODE_ENV must be development, test, or production.');
  }
  const nodeEnv = rawNodeEnv as RuntimeEnvironment;
  const production = nodeEnv === 'production';
  const sessionSecret = environment.SESSION_SECRET?.trim() || null;
  const databaseUrl = environment.DATABASE_URL?.trim() || null;
  const redisUrl = environment.REDIS_URL?.trim() || null;
  const objectStorageUrl = environment.OBJECT_STORAGE_URL?.trim() || null;
  const objectStorageBucket = environment.OBJECT_STORAGE_BUCKET?.trim() || null;
  const objectStorageAccessKeyId = environment.OBJECT_STORAGE_ACCESS_KEY_ID?.trim() || null;
  const objectStorageSecretAccessKey = environment.OBJECT_STORAGE_SECRET_ACCESS_KEY?.trim() || null;
  const emailDeliveryUrl = environment.EMAIL_DELIVERY_URL?.trim() || null;
  const emailDeliveryToken = environment.EMAIL_DELIVERY_TOKEN?.trim() || null;
  const emailFromAddress = environment.EMAIL_FROM_ADDRESS?.trim() || null;
  const termsVersion = environment.TERMS_VERSION?.trim() || 'draft-2026-10';
  const privacyVersion = environment.PRIVACY_VERSION?.trim() || 'draft-2026-10';
  const webOrigin = environment.WEB_ORIGIN?.trim() || null;

  if (production && (!sessionSecret || sessionSecret.length < 32)) {
    throw new Error('SESSION_SECRET must contain at least 32 characters in production.');
  }
  if (production && !databaseUrl) {
    throw new Error('DATABASE_URL is required in production.');
  }
  if (production && !redisUrl) {
    throw new Error('REDIS_URL is required in production.');
  }
  if (production && !objectStorageBucket) {
    throw new Error('OBJECT_STORAGE_BUCKET is required in production.');
  }
  if (production && !objectStorageAccessKeyId) {
    throw new Error('OBJECT_STORAGE_ACCESS_KEY_ID is required in production.');
  }
  if (production && !objectStorageSecretAccessKey) {
    throw new Error('OBJECT_STORAGE_SECRET_ACCESS_KEY is required in production.');
  }
  if (production && !emailDeliveryUrl) {
    throw new Error('EMAIL_DELIVERY_URL is required in production.');
  }
  if (production && !emailDeliveryToken) {
    throw new Error('EMAIL_DELIVERY_TOKEN is required in production.');
  }
  if (production && !emailFromAddress) {
    throw new Error('EMAIL_FROM_ADDRESS is required in production.');
  }
  if (production && !objectStorageUrl) {
    throw new Error('OBJECT_STORAGE_URL is required in production.');
  }

  if (databaseUrl) {
    const url = parseUrl('DATABASE_URL', databaseUrl, ['postgres:', 'postgresql:']);
    if (production && !['require', 'verify-ca', 'verify-full'].includes(url.searchParams.get('sslmode') ?? '')) {
      throw new Error('DATABASE_URL must enable TLS with sslmode=require or stronger in production.');
    }
  }
  if (redisUrl) {
    const url = parseUrl('REDIS_URL', redisUrl, ['redis:', 'rediss:']);
    if (production && url.protocol !== 'rediss:') {
      throw new Error('REDIS_URL must use rediss:// in production.');
    }
  }
  if (objectStorageUrl) {
    parseUrl('OBJECT_STORAGE_URL', objectStorageUrl, production ? ['https:'] : ['http:', 'https:']);
  }
  if (emailDeliveryUrl) {
    parseUrl('EMAIL_DELIVERY_URL', emailDeliveryUrl, production ? ['https:'] : ['http:', 'https:']);
  }
  if (webOrigin) {
    parseUrl('WEB_ORIGIN', webOrigin, production ? ['https:'] : ['http:', 'https:']);
  }

  const parsedPort = Number(environment.PORT ?? '4000');
  if (!Number.isInteger(parsedPort) || parsedPort < 1 || parsedPort > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535.');
  }

  return {
    nodeEnv,
    host: environment.HOST?.trim() || '127.0.0.1',
    port: parsedPort,
    sessionSecret,
    databaseUrl,
    redisUrl,
    objectStorageUrl,
    objectStorageBucket,
    objectStorageAccessKeyId,
    objectStorageSecretAccessKey,
    emailDeliveryUrl,
    emailDeliveryToken,
    emailFromAddress,
    termsVersion,
    privacyVersion,
    webOrigin,
  };
}