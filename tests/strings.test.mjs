import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const strings = JSON.parse(await readFile('data/strings.json', 'utf-8'));

test('her string TR + EN içerir', () => {
  for (const [key, val] of Object.entries(strings)) {
    assert.ok(val.tr, `${key}.tr eksik`);
    assert.ok(val.en, `${key}.en eksik`);
  }
});
