import type { ServerConfig } from '../config.ts';

export function createEmailOtpSender(
  config: ServerConfig,
  fetcher: typeof fetch = fetch,
) {
  return async (email: string, code: string): Promise<void> => {
    if (!config.emailDeliveryUrl || !config.emailDeliveryToken || !config.emailFromAddress) {
      throw new Error('Email delivery is not configured.');
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetcher(config.emailDeliveryUrl, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${config.emailDeliveryToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: config.emailFromAddress,
          to: email,
          subject: 'Your Kinn sign-in code',
          text: `Your Kinn sign-in code is ${code}. It expires in 10 minutes. If you did not request this, you can ignore this email.`,
        }),
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('Email delivery failed.');
    } finally {
      clearTimeout(timeout);
    }
  };
}