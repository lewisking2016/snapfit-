# Kinn API Foundation

## Selected Stack

- Node.js 24 + TypeScript + Express for the API.
- PostgreSQL for accounts, consent, workout/social relations, deletion jobs, and audit records.
- Redis for OTP throttling, short-lived verification challenges, and queued background work.
- S3-compatible private object storage for user-submitted media, with signed uploads and lifecycle deletion.

This follows the P0/P1 roadmap recommendation. PostgreSQL is the durable source of truth; Redis is not used for durable consent, account, or health records.

## Configuration

`server/config.ts` validates configuration before the API binds. Production requires a 32-character session secret, PostgreSQL with `sslmode=require` or stronger, `rediss://`, HTTPS object storage, private bucket credentials, and an HTTPS email delivery endpoint/token. Never use `EXPO_PUBLIC_*` variables for server secrets. `.env.example` documents names only and contains no production credentials.

## Authentication Foundation

The initial account path is email one-time-code sign-in. OTPs are six digits, stored only as identity-bound HMAC digests in Redis, expire after ten minutes, have a 60-second resend cooldown and five verification attempts, and are deleted after success. Request responses do not reveal whether an account exists. Email delivery is an HTTPS server-side adapter configured by `EMAIL_DELIVERY_URL`, `EMAIL_DELIVERY_TOKEN`, and `EMAIL_FROM_ADDRESS`.

Creating or signing into an account requires acceptance of the currently configured Terms and Privacy versions. Access and refresh tokens are random opaque values; only SHA-256 hashes are persisted. Access tokens expire after 15 minutes; refresh tokens expire after 30 days and rotate on use. Apple sign-in, account deletion execution, and live DB/Redis/email delivery remain separate work.

## Health Data

Only normalized daily metrics should be accepted. The initial table stores a ciphertext blob and key version, not plaintext health fields. Production encryption must use envelope encryption backed by the deployment provider's KMS; the application must not commit keys or store a static encryption key beside the database. TLS is required for every service connection. Health data is never sent to advertising or analytics providers.

Before accepting health sync, implement KMS-backed encrypt/decrypt, key rotation, consent checks, and tests proving unauthorized users cannot access another user's records.

## Account Deletion

Deletion is an idempotent job: mark the account `deletion_pending`, revoke sessions, stop new writes, enqueue the job, purge/anonymize database rows and object storage, then mark complete. Retries use the same job and must not resurrect or re-expose the account. The migration includes job state, but the worker and public API remain unimplemented.

## Audit and Transport

Administrative actions record actor, action, target, reason code, request ID, and timestamp. Do not put health values, OTPs, tokens, or request bodies in logs. Terminate TLS at a trusted edge or configure TLS to the Node service; production startup rejects insecure service URLs.

## Local Limitations

This environment has no PostgreSQL, Redis, Docker, KMS, or object-store service. The P0 service endpoints and config checks can be locally tested; database migrations and live readiness must remain unverified until those services are provisioned.