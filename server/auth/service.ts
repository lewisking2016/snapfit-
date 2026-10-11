import { createHash, randomBytes } from 'node:crypto';

import { createOtpCode, hashOtp, normalizeEmail } from './otp.ts';

type AuthConfig = {
  sessionSecret: string | null;
  termsVersion: string;
  privacyVersion: string;
};

type OtpStore = {
  issue: (email: string, digest: string, source: string) => Promise<boolean>;
  verify: (email: string, digest: string) => Promise<boolean>;
  clear: (email: string) => Promise<void>;
};

type SessionInput = {
  email: string;
  displayName: string;
  accessTokenHash: string;
  refreshTokenHash: string;
  accessExpiresAt: Date;
  refreshExpiresAt: Date;
  acceptedTermsVersion: string;
  acceptedPrivacyVersion: string;
};

type UserRecord = { id: string; email: string; displayName: string };
type CreateSession = (input: SessionInput) => Promise<UserRecord | null>;
type RefreshSession = (input: {
  refreshTokenHash: string;
  accessTokenHash: string;
  nextRefreshTokenHash: string;
  accessExpiresAt: Date;
  refreshExpiresAt: Date;
}) => Promise<UserRecord | null>;
type SendEmail = (email: string, code: string) => Promise<void>;

const GENERIC_OTP_MESSAGE = 'If the address can receive sign-in codes, one has been sent.';
const OTP_TTL_MS = 10 * 60 * 1000;
const ACCESS_TTL_MS = 15 * 60 * 1000;
const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function tokenHash(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

function displayNameFromEmail(email: string): string {
  return email
    .split('@')[0]
    .replace(/[._+-]+/g, ' ')
    .trim()
    .slice(0, 48) || 'Athlete';
}

export function createAuthService({
  config,
  otpStore,
  sendEmail,
  createSession,
  refreshSession = async () => null,
  revokeSession = async () => false,
  now = () => Date.now(),
  nextOtp = createOtpCode,
  nextToken = () => randomBytes(32).toString('base64url'),
}: {
  config: AuthConfig;
  otpStore: OtpStore;
  sendEmail: SendEmail;
  createSession: CreateSession;
  refreshSession?: RefreshSession;
  revokeSession?: (accessTokenHash: string) => Promise<boolean>;
  now?: () => number;
  nextOtp?: () => string;
  nextToken?: () => string;
}) {
  async function requestOtp(value: unknown, source = 'unknown') {
    if (typeof value !== 'string') return { status: 400, body: { error: 'Enter a valid email address.' } };
    const email = normalizeEmail(value);
    if (!email) return { status: 400, body: { error: 'Enter a valid email address.' } };
    if (!config.sessionSecret) return { status: 503, body: { error: 'Sign-in is not configured on this server.' } };

    const code = nextOtp();
    let issued = false;
    try {
      issued = await otpStore.issue(email, hashOtp(email, code, config.sessionSecret), source);
      if (issued) await sendEmail(email, code);
    } catch {
      if (issued) await otpStore.clear(email).catch(() => {});
      return { status: 503, body: { error: 'Sign-in codes are temporarily unavailable.' } };
    }

    return { status: 202, body: { message: GENERIC_OTP_MESSAGE } };
  }

  async function verifyOtp(input: {
    email?: unknown;
    code?: unknown;
    acceptedTermsVersion?: unknown;
    acceptedPrivacyVersion?: unknown;
  }) {
    const email = typeof input.email === 'string' ? normalizeEmail(input.email) : null;
    if (!email || typeof input.code !== 'string' || !/^\d{6}$/.test(input.code)) {
      return { status: 400, body: { error: 'Enter a valid email address and six-digit code.' } };
    }
    if (
      input.acceptedTermsVersion !== config.termsVersion ||
      input.acceptedPrivacyVersion !== config.privacyVersion
    ) {
      return {
        status: 400,
        body: {
          error: 'Accept the current Terms and Privacy Policy before creating or signing into an account.',
          termsVersion: config.termsVersion,
          privacyVersion: config.privacyVersion,
        },
      };
    }
    if (!config.sessionSecret) return { status: 503, body: { error: 'Sign-in is not configured on this server.' } };

    try {
      const valid = await otpStore.verify(email, hashOtp(email, input.code, config.sessionSecret));
      if (!valid) return { status: 401, body: { error: 'The code is invalid or expired. Request a new code.' } };

      const accessToken = nextToken();
      const refreshToken = nextToken();
      const issuedAt = now();
      const user = await createSession({
        email,
        displayName: displayNameFromEmail(email),
        accessTokenHash: tokenHash(accessToken),
        refreshTokenHash: tokenHash(refreshToken),
        accessExpiresAt: new Date(issuedAt + ACCESS_TTL_MS),
        refreshExpiresAt: new Date(issuedAt + REFRESH_TTL_MS),
        acceptedTermsVersion: config.termsVersion,
        acceptedPrivacyVersion: config.privacyVersion,
      });
      if (!user) return { status: 401, body: { error: 'The code is invalid or expired. Request a new code.' } };

      return {
        status: 200,
        body: {
          user,
          accessToken,
          accessExpiresInSeconds: ACCESS_TTL_MS / 1000,
          refreshToken,
        },
      };
    } catch {
      return { status: 503, body: { error: 'Sign-in is temporarily unavailable.' } };
    }
  }

  async function refresh(value: unknown) {
    if (typeof value !== 'string' || !/^[A-Za-z0-9_-]{40,}$/.test(value)) {
      return { status: 401, body: { error: 'The session is invalid or expired. Sign in again.' } };
    }
    const accessToken = nextToken();
    const refreshToken = nextToken();
    const issuedAt = now();
    try {
      const user = await refreshSession({
        refreshTokenHash: tokenHash(value),
        accessTokenHash: tokenHash(accessToken),
        nextRefreshTokenHash: tokenHash(refreshToken),
        accessExpiresAt: new Date(issuedAt + ACCESS_TTL_MS),
        refreshExpiresAt: new Date(issuedAt + REFRESH_TTL_MS),
      });
      if (!user) return { status: 401, body: { error: 'The session is invalid or expired. Sign in again.' } };
      return { status: 200, body: { user, accessToken, accessExpiresInSeconds: ACCESS_TTL_MS / 1000, refreshToken } };
    } catch {
      return { status: 503, body: { error: 'Session refresh is temporarily unavailable.' } };
    }
  }

  async function logout(value: unknown) {
    if (typeof value !== 'string' || !/^[A-Za-z0-9_-]{40,}$/.test(value)) {
      return { status: 204, body: null };
    }
    try {
      await revokeSession(tokenHash(value));
    } catch {
      return { status: 503, body: { error: 'Sign-out is temporarily unavailable.' } };
    }
    return { status: 204, body: null };
  }

  return { requestOtp, verifyOtp, refresh, logout };
}