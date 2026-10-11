import type { Pool } from 'pg';

import type { ServerConfig } from '../config.ts';

type UserRecord = { id: string; email: string; displayName: string };

function toUser(record: { id: string; email_normalized: string; display_name: string }): UserRecord {
  return { id: record.id, email: record.email_normalized, displayName: record.display_name };
}

export function createPostgresAuthRepository(pool: Pool) {
  return {
    async createSession(input: {
      email: string;
      displayName: string;
      accessTokenHash: string;
      refreshTokenHash: string;
      accessExpiresAt: Date;
      refreshExpiresAt: Date;
      acceptedTermsVersion: string;
      acceptedPrivacyVersion: string;
    }): Promise<UserRecord | null> {
      const client = await pool.connect();
      try {
        await client.query('BEGIN');
        const inserted = await client.query(
          `INSERT INTO users (email_normalized, display_name)
           VALUES ($1, $2)
           ON CONFLICT (email_normalized) DO UPDATE SET updated_at = now()
             WHERE users.status = 'active'
           RETURNING id, email_normalized, display_name`,
          [input.email, input.displayName],
        );
        if (!inserted.rowCount) {
          await client.query('ROLLBACK');
          return null;
        }
        const user = toUser(inserted.rows[0]);

        await client.query(
          `INSERT INTO user_sessions
            (user_id, access_token_hash, refresh_token_hash, access_expires_at, refresh_expires_at)
           VALUES ($1, decode($2, 'hex'), decode($3, 'hex'), $4, $5)`,
          [user.id, input.accessTokenHash, input.refreshTokenHash, input.accessExpiresAt, input.refreshExpiresAt],
        );

        for (const [consentType, version] of [
          ['terms', input.acceptedTermsVersion],
          ['privacy', input.acceptedPrivacyVersion],
        ]) {
          await client.query(
            `INSERT INTO consent_records (user_id, consent_type, document_version, granted_at, source)
             SELECT $1, $2, $3, now(), 'email_otp_signup'
             WHERE NOT EXISTS (
               SELECT 1 FROM consent_records
               WHERE user_id = $1 AND consent_type = $2
                 AND document_version = $3 AND revoked_at IS NULL
             )`,
            [user.id, consentType, version],
          );
        }
        await client.query('COMMIT');
        return user;
      } catch (error) {
        await client.query('ROLLBACK').catch(() => {});
        throw error;
      } finally {
        client.release();
      }
    },

    async refreshSession(input: {
      refreshTokenHash: string;
      accessTokenHash: string;
      nextRefreshTokenHash: string;
      accessExpiresAt: Date;
      refreshExpiresAt: Date;
    }): Promise<UserRecord | null> {
      const result = await pool.query(
        `UPDATE user_sessions AS sessions
         SET access_token_hash = decode($2, 'hex'),
             refresh_token_hash = decode($3, 'hex'),
             access_expires_at = $4,
             refresh_expires_at = $5,
             last_used_at = now()
         FROM users
         WHERE sessions.user_id = users.id
           AND sessions.refresh_token_hash = decode($1, 'hex')
           AND sessions.refresh_expires_at > now()
           AND sessions.revoked_at IS NULL
           AND users.status = 'active'
         RETURNING users.id, users.email_normalized, users.display_name`,
        [input.refreshTokenHash, input.accessTokenHash, input.nextRefreshTokenHash, input.accessExpiresAt, input.refreshExpiresAt],
      );
      return result.rows[0] ? toUser(result.rows[0]) : null;
    },

    async revokeSession(accessTokenHash: string): Promise<boolean> {
      const result = await pool.query(
        `UPDATE user_sessions SET revoked_at = now()
         WHERE access_token_hash = decode($1, 'hex') AND revoked_at IS NULL`,
        [accessTokenHash],
      );
      return result.rowCount === 1;
    },
  };
}

export function databaseTlsOptions(config: ServerConfig) {
  return config.nodeEnv === 'production' ? { rejectUnauthorized: true } : undefined;
}