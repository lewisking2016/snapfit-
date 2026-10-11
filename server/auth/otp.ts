import { createHmac, randomInt } from 'node:crypto';

export function normalizeEmail(value: string): string | null {
  const email = value.trim().toLowerCase();
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return null;
  return email;
}

export function createOtpCode(nextInteger: (max: number) => number = randomInt): string {
  return String(nextInteger(1_000_000)).padStart(6, '0');
}

export function hashOtp(email: string, code: string, secret: string): string {
  if (secret.length < 32) throw new Error('OTP signing secret must contain at least 32 characters.');
  return createHmac('sha256', secret).update(`${email}\0${code}`).digest('hex');
}