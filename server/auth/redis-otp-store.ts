import { createHmac } from 'node:crypto';
import type { RedisClientType } from 'redis';

const ISSUE_SCRIPT = `
  local requests = redis.call('INCR', KEYS[3])
  if requests == 1 then redis.call('EXPIRE', KEYS[3], 3600) end
  if requests > 10 then return 0 end
  if redis.call('EXISTS', KEYS[2]) == 1 then return 0 end
  redis.call('SET', KEYS[1], ARGV[1], 'EX', 600)
  redis.call('SET', KEYS[2], '1', 'EX', 60)
  return 1
`;

const VERIFY_SCRIPT = `
  local saved = redis.call('GET', KEYS[1])
  if not saved then return 0 end
  if saved == ARGV[1] then
    redis.call('DEL', KEYS[1], KEYS[2])
    return 1
  end
  local attempts = redis.call('INCR', KEYS[2])
  if attempts == 1 then redis.call('EXPIRE', KEYS[2], 600) end
  if attempts >= 5 then redis.call('DEL', KEYS[1]) end
  return 0
`;

export function createRedisOtpStore(redis: RedisClientType, secret: string) {
  function keys(email: string, source = '') {
    const identity = createHmac('sha256', secret).update(email).digest('hex');
    const sourceHash = createHmac('sha256', secret).update(source).digest('hex');
    return [
      `kinn:otp:${identity}`,
      `kinn:otp-attempts:${identity}`,
      `kinn:otp-cooldown:${identity}`,
      `kinn:otp-ip-hour:${sourceHash}`,
    ];
  }

  async function ensureConnected() {
    if (!redis.isOpen) await redis.connect();
  }

  return {
    async issue(email: string, digest: string, source: string): Promise<boolean> {
      await ensureConnected();
      const [otpKey, , cooldownKey, ipLimitKey] = keys(email, source);
      const result = await redis.eval(ISSUE_SCRIPT, {
        keys: [otpKey, cooldownKey, ipLimitKey],
        arguments: [digest],
      });
      return Number(result) === 1;
    },

    async verify(email: string, digest: string): Promise<boolean> {
      await ensureConnected();
      const [otpKey, attemptsKey, cooldownKey] = keys(email);
      const result = await redis.eval(VERIFY_SCRIPT, {
        keys: [otpKey, attemptsKey, cooldownKey],
        arguments: [digest],
      });
      return Number(result) === 1;
    },

    async clear(email: string): Promise<void> {
      await ensureConnected();
      const [otpKey, , cooldownKey] = keys(email);
      await redis.del([otpKey, cooldownKey]);
    },
  };
}