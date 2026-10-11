import assert from 'node:assert/strict';
import test from 'node:test';

import { loadConfig } from './config.ts';

test('production requires a strong session secret and secure service URLs', () => {
  assert.throws(
    () => loadConfig({ NODE_ENV: 'production' }),
    /SESSION_SECRET/,
  );

  assert.throws(
    () => loadConfig({
      NODE_ENV: 'production',
      SESSION_SECRET: 'x'.repeat(32),
      DATABASE_URL: 'postgres://app:secret@db.internal/kinn',
      REDIS_URL: 'rediss://cache.internal:6379',
      OBJECT_STORAGE_URL: 'https://objects.example.test',
      OBJECT_STORAGE_BUCKET: 'kinn-private',
      OBJECT_STORAGE_ACCESS_KEY_ID: 'access',
      OBJECT_STORAGE_SECRET_ACCESS_KEY: 'secret',
      EMAIL_DELIVERY_URL: 'https://mail.example.test/send',
      EMAIL_DELIVERY_TOKEN: 'delivery-secret',
      EMAIL_FROM_ADDRESS: 'Kinn <login@example.test>',
    }),
    /DATABASE_URL.*TLS|TLS.*DATABASE_URL/,
  );
});

test('production object storage requires a private bucket and credentials', () => {
  assert.throws(
    () => loadConfig({
      NODE_ENV: 'production',
      SESSION_SECRET: 's'.repeat(32),
      DATABASE_URL: 'postgresql://app:secret@db.internal/kinn?sslmode=verify-full',
      REDIS_URL: 'rediss://cache.internal:6379',
      OBJECT_STORAGE_URL: 'https://objects.example.test',
      EMAIL_DELIVERY_URL: 'https://mail.example.test/send',
      EMAIL_DELIVERY_TOKEN: 'delivery-secret',
      EMAIL_FROM_ADDRESS: 'Kinn <login@example.test>',
    }),
    /OBJECT_STORAGE_BUCKET/,
  );
});

test('development permits an isolated health-only service without production secrets', () => {
  const config = loadConfig({ NODE_ENV: 'development' });

  assert.equal(config.nodeEnv, 'development');
  assert.equal(config.sessionSecret, null);
  assert.equal(config.databaseUrl, null);
});