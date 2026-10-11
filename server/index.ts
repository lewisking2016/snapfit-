import 'dotenv/config';

import { createApp } from './app.ts';
import { loadConfig } from './config.ts';
import { createServiceDependencies } from './dependencies.ts';
import { createAuthService } from './auth/service.ts';
import { createEmailOtpSender } from './auth/email-sender.ts';

const config = loadConfig();
const dependencies = createServiceDependencies(config);
const auth = dependencies.authRepository && dependencies.otpStore && config.sessionSecret
  ? createAuthService({
      config,
      otpStore: dependencies.otpStore,
      sendEmail: createEmailOtpSender(config),
      createSession: dependencies.authRepository.createSession,
      refreshSession: dependencies.authRepository.refreshSession,
      revokeSession: dependencies.authRepository.revokeSession,
    })
  : null;
const app = createApp(config, dependencies.probe, auth);
const server = app.listen(config.port, config.host, () => {
  process.stdout.write(`Kinn API listening on http://${config.host}:${config.port}\n`);
});

function shutdown() {
  server.close(() => {
    void dependencies.close().finally(() => process.exit(0));
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);