import assert from 'node:assert/strict';
import test from 'node:test';

import { createApp } from './app.ts';
import { loadConfig } from './config.ts';

test('live health is public, non-cacheable, and does not reveal configuration', async () => {
  const app = createApp(loadConfig({ NODE_ENV: 'test', SESSION_SECRET: 'test-only-secret' }));
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const address = server.address();
  const response = await fetch(`http://127.0.0.1:${address.port}/health/live`);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.deepEqual(body, { status: 'live' });
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(response.headers.get('x-powered-by'), null);
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test('readiness does not report ready while required production services are unconfigured', async () => {
  const app = createApp(loadConfig({ NODE_ENV: 'development' }));
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const address = server.address();
  const response = await fetch(`http://127.0.0.1:${address.port}/health/ready`);
  const body = await response.json();

  assert.equal(response.status, 503);
  assert.equal(body.status, 'not_ready');
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test('OTP route forwards only the email input to the auth service', async () => {
  let requestedEmail;
  const auth = {
    requestOtp: async (email) => {
      requestedEmail = email;
      return { status: 202, body: { message: 'If eligible, a code has been sent.' } };
    },
    verifyOtp: async () => ({ status: 400, body: { error: 'Invalid.' } }),
    refresh: async () => ({ status: 401, body: { error: 'Invalid.' } }),
    logout: async () => ({ status: 204, body: null }),
  };
  const app = createApp(loadConfig({ NODE_ENV: 'test' }), undefined, auth);
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve) => server.once('listening', resolve));
  const address = server.address();
  const response = await fetch(`http://127.0.0.1:${address.port}/auth/otp/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'athlete@example.com', extra: 'ignored' }),
  });

  assert.equal(response.status, 202);
  assert.equal(requestedEmail, 'athlete@example.com');
  assert.deepEqual(await response.json(), { message: 'If eligible, a code has been sent.' });
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});