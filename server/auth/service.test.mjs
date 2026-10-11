import assert from 'node:assert/strict';
import test from 'node:test';

import { createAuthService } from './service.ts';

const config = {
  nodeEnv: 'test',
  sessionSecret: 's'.repeat(32),
  termsVersion: 'terms-v1',
  privacyVersion: 'privacy-v1',
};

function makeService(overrides = {}) {
  const sent = [];
  const sessions = [];
  const stored = [];
  const service = createAuthService({
    config,
    otpStore: {
      issue: async (email, digest, source) => { stored.push({ email, digest, source }); return true; },
      verify: async (email, digest) => stored.some((item) => item.email === email && item.digest === digest),
      clear: async () => {},
    },
    sendEmail: async (email, code) => { sent.push({ email, code }); },
    createSession: async (input) => {
      sessions.push(input);
      return { id: 'user-1', email: input.email, displayName: input.displayName };
    },
    ...overrides,
  });
  return { service, sent, sessions, stored };
}

test('OTP request uses generic copy and stores only an identity-bound digest', async () => {
  const { service, sent, stored } = makeService();
  const result = await service.requestOtp('Athlete@Example.com');

  assert.equal(result.status, 202);
  assert.equal(result.body.message, 'If the address can receive sign-in codes, one has been sent.');
  assert.equal('code' in result.body, false);
  assert.equal(sent[0].email, 'athlete@example.com');
  assert.match(sent[0].code, /^\d{6}$/);
  assert.notEqual(stored[0].digest, sent[0].code);
});

test('verification refuses missing or stale policy consent before creating a session', async () => {
  const { service, sent, sessions } = makeService();
  await service.requestOtp('athlete@example.com');
  const missingConsent = await service.verifyOtp({ email: sent[0].email, code: sent[0].code });

  assert.equal(missingConsent.status, 400);
  assert.equal(sessions.length, 0);
});

test('verification records current policy versions and returns opaque session tokens', async () => {
  const { service, sent, sessions } = makeService();
  await service.requestOtp('athlete@example.com');
  const result = await service.verifyOtp({
    email: sent[0].email,
    code: sent[0].code,
    acceptedTermsVersion: 'terms-v1',
    acceptedPrivacyVersion: 'privacy-v1',
  });

  assert.equal(result.status, 200);
  assert.equal(sessions.length, 1);
  assert.equal(sessions[0].acceptedTermsVersion, 'terms-v1');
  assert.equal(sessions[0].acceptedPrivacyVersion, 'privacy-v1');
  assert.equal(result.body.user.email, 'athlete@example.com');
  assert.match(result.body.accessToken, /^[A-Za-z0-9_-]{40,}$/);
  assert.match(result.body.refreshToken, /^[A-Za-z0-9_-]{40,}$/);
  assert.notEqual(sessions[0].accessTokenHash, result.body.accessToken);
  assert.notEqual(sessions[0].refreshTokenHash, result.body.refreshToken);
});

test('invalid email and code are rejected without account creation', async () => {
  const { service, sessions, sent } = makeService();
  assert.equal((await service.requestOtp('invalid')).status, 400);
  assert.equal((await service.verifyOtp({ email: 'athlete@example.com', code: '12' })).status, 400);
  assert.equal(sent.length, 0);
  assert.equal(sessions.length, 0);
});

test('resend cooldown is generic and does not send another code', async () => {
  const { service, sent } = makeService({
    otpStore: {
      issue: async () => false,
      verify: async () => false,
      clear: async () => {},
    },
  });
  const result = await service.requestOtp('athlete@example.com');

  assert.equal(result.status, 202);
  assert.equal(result.body.message, 'If the address can receive sign-in codes, one has been sent.');
  assert.equal(sent.length, 0);
});

test('delivery failure clears the stored challenge and does not disclose the code', async () => {
  let clearedEmail;
  const { service } = makeService({
    otpStore: {
      issue: async () => true,
      verify: async () => false,
      clear: async (email) => { clearedEmail = email; },
    },
    sendEmail: async () => { throw new Error('provider secret detail'); },
  });
  const result = await service.requestOtp('athlete@example.com');

  assert.equal(result.status, 503);
  assert.equal(clearedEmail, 'athlete@example.com');
  assert.equal(JSON.stringify(result.body).includes('provider secret detail'), false);
});

test('refresh rotates the presented token and logout revokes the access token', async () => {
  const refreshCalls = [];
  const revokedHashes = [];
  let tokenNumber = 0;
  const { service, sent } = makeService({
    nextToken: () => `token-${String(++tokenNumber).padStart(40, '0')}`,
    refreshSession: async (input) => {
      refreshCalls.push(input);
      return { id: 'user-1', email: 'athlete@example.com', displayName: 'Athlete' };
    },
    revokeSession: async (hash) => { revokedHashes.push(hash); return true; },
  });
  await service.requestOtp('athlete@example.com');
  const login = await service.verifyOtp({
    email: sent[0].email,
    code: sent[0].code,
    acceptedTermsVersion: 'terms-v1',
    acceptedPrivacyVersion: 'privacy-v1',
  });
  const refreshed = await service.refresh(login.body.refreshToken);
  const logout = await service.logout(login.body.accessToken);

  assert.equal(refreshed.status, 200);
  assert.notEqual(refreshed.body.refreshToken, login.body.refreshToken);
  assert.notEqual(refreshCalls[0].refreshTokenHash, login.body.refreshToken);
  assert.equal(logout.status, 204);
  assert.notEqual(revokedHashes[0], login.body.accessToken);
});

test('OTP request passes the observed source address to the rate limiter', async () => {
  let source;
  const { service } = makeService({
    otpStore: {
      issue: async (_email, _digest, observedSource) => { source = observedSource; return false; },
      verify: async () => false,
      clear: async () => {},
    },
  });
  await service.requestOtp('athlete@example.com', '127.0.0.1');

  assert.equal(source, '127.0.0.1');
});