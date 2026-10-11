import assert from 'node:assert/strict';
import test from 'node:test';

import { createPostgresAuthRepository } from './postgres-repository.ts';

function makePool({ userRow = { id: 'user-1', email_normalized: 'athlete@example.com', display_name: 'Athlete' } } = {}) {
  const clientCalls = [];
  const poolCalls = [];
  const client = {
    query: async (sql, values = []) => {
      clientCalls.push({ sql, values });
      if (sql.includes('INSERT INTO users')) return { rowCount: userRow ? 1 : 0, rows: userRow ? [userRow] : [] };
      return { rowCount: 1, rows: [] };
    },
    release: () => { clientCalls.push({ sql: 'RELEASE', values: [] }); },
  };
  return {
    pool: {
      connect: async () => client,
      query: async (sql, values = []) => {
        poolCalls.push({ sql, values });
        if (sql.includes('UPDATE user_sessions AS sessions')) return { rows: [userRow] };
        return { rowCount: 1, rows: [] };
      },
    },
    clientCalls,
    poolCalls,
  };
}

test('creates a user, hashed session, and both consent records in one transaction', async () => {
  const fake = makePool();
  const repository = createPostgresAuthRepository(fake.pool);
  const user = await repository.createSession({
    email: 'athlete@example.com',
    displayName: 'Athlete',
    accessTokenHash: 'a'.repeat(64),
    refreshTokenHash: 'b'.repeat(64),
    accessExpiresAt: new Date('2026-10-11T10:15:00Z'),
    refreshExpiresAt: new Date('2026-11-10T10:00:00Z'),
    acceptedTermsVersion: 'terms-v1',
    acceptedPrivacyVersion: 'privacy-v1',
  });

  assert.equal(user.id, 'user-1');
  assert.equal(fake.clientCalls[0].sql, 'BEGIN');
  assert.ok(fake.clientCalls.some((call) => call.sql.includes('INSERT INTO user_sessions')));
  assert.equal(fake.clientCalls.filter((call) => call.sql.includes('INSERT INTO consent_records')).length, 2);
  assert.equal(fake.clientCalls.at(-2).sql, 'COMMIT');
  assert.ok(fake.clientCalls.every((call) => !call.sql.includes('athlete@example.com')));
});

test('does not issue a session when an existing account is not active', async () => {
  const fake = makePool({ userRow: null });
  const repository = createPostgresAuthRepository(fake.pool);
  const user = await repository.createSession({
    email: 'athlete@example.com',
    displayName: 'Athlete',
    accessTokenHash: 'a'.repeat(64),
    refreshTokenHash: 'b'.repeat(64),
    accessExpiresAt: new Date(),
    refreshExpiresAt: new Date(),
    acceptedTermsVersion: 'terms-v1',
    acceptedPrivacyVersion: 'privacy-v1',
  });

  assert.equal(user, null);
  assert.ok(fake.clientCalls.some((call) => call.sql === 'ROLLBACK'));
  assert.equal(fake.clientCalls.some((call) => call.sql.includes('INSERT INTO user_sessions')), false);
});

test('refresh rotation is parameterized and requires an active account and unexpired session', async () => {
  const fake = makePool();
  const repository = createPostgresAuthRepository(fake.pool);
  await repository.refreshSession({
    refreshTokenHash: 'a'.repeat(64),
    accessTokenHash: 'b'.repeat(64),
    nextRefreshTokenHash: 'c'.repeat(64),
    accessExpiresAt: new Date(),
    refreshExpiresAt: new Date(),
  });
  const [query] = fake.poolCalls;

  assert.ok(query.sql.includes('sessions.refresh_expires_at > now()'));
  assert.ok(query.sql.includes("users.status = 'active'"));
  assert.ok(query.sql.includes('revoked_at IS NULL'));
  assert.equal(query.values[0], 'a'.repeat(64));
  assert.equal(query.sql.includes('a'.repeat(64)), false);
});