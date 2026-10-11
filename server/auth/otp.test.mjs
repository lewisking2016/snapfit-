import assert from 'node:assert/strict';
import test from 'node:test';

import { createOtpCode, hashOtp, normalizeEmail } from './otp.ts';

test('normalizes valid email identifiers and rejects malformed addresses', () => {
  assert.equal(normalizeEmail('  Athlete+Kinn@Example.COM '), 'athlete+kinn@example.com');
  assert.equal(normalizeEmail('not-an-email'), null);
  assert.equal(normalizeEmail('athlete@example'), null);
});

test('creates a six-digit code and binds its digest to the identity', () => {
  assert.match(createOtpCode(() => 7), /^\d{6}$/);
  assert.notEqual(hashOtp('a@example.com', '000007', 's'.repeat(32)), hashOtp('b@example.com', '000007', 's'.repeat(32)));
  assert.notEqual(hashOtp('a@example.com', '000007', 's'.repeat(32)), hashOtp('a@example.com', '000008', 's'.repeat(32)));
});