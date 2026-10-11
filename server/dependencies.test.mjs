import assert from 'node:assert/strict';
import test from 'node:test';

import { createDependencyProbe } from './dependencies.ts';

test('dependency failures are reported as not ready without leaking probe errors', async () => {
  const probe = createDependencyProbe({
    database: async () => true,
    redis: async () => { throw new Error('private connection details'); },
    objectStorage: async () => false,
  });

  assert.deepEqual(await probe(), {
    database: true,
    redis: false,
    objectStorage: false,
  });
});