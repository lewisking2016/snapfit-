export function normalizeUsername(input: string): string | null {
  const username = input.trim().replace(/^@/, '').toLowerCase();
  return /^[a-z0-9_.]{3,30}$/.test(username) ? username : null;
}