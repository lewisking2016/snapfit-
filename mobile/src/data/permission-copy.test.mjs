import assert from 'node:assert/strict';
import test from 'node:test';

import { getPermissionCopy } from './permission-copy.ts';

test('provides contextual copy for each permission without a cold-launch request', () => {
  for (const kind of ['health', 'notifications', 'contacts', 'camera']) {
    const copy = getPermissionCopy(kind);

    assert.ok(copy.title.trim());
    assert.ok(copy.rationale.trim());
    assert.ok(copy.privacyNote.trim());
    assert.equal(copy.requestOnColdLaunch, false);
  }
});