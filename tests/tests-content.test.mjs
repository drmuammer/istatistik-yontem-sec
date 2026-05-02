import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const tree = JSON.parse(await readFile('data/tree.json', 'utf-8'));
const tests = JSON.parse(await readFile('data/tests.json', 'utf-8'));

test('her leaf.test_id, tests.json içinde var', () => {
  for (const node of Object.values(tree)) {
    if (node.leaf) assert.ok(tests[node.test_id], `${node.test_id} eksik`);
  }
});

test('her test TR+EN ad, summary, when_to_use, example içerir', () => {
  for (const [id, t] of Object.entries(tests)) {
    for (const f of ['name','summary','when_to_use','example']) {
      assert.ok(t[f]?.tr, `${id}.${f}.tr eksik`);
      assert.ok(t[f]?.en, `${id}.${f}.en eksik`);
    }
    assert.ok(Array.isArray(t.assumptions?.tr) && t.assumptions.tr.length, `${id}.assumptions.tr boş`);
    assert.ok(Array.isArray(t.assumptions?.en) && t.assumptions.en.length, `${id}.assumptions.en boş`);
  }
});

test('describe_* hariç R/Python/SPSS kodu var', () => {
  for (const [id, t] of Object.entries(tests)) {
    if (id.startsWith('describe_')) continue;
    assert.ok(t.code?.r, `${id}.code.r eksik`);
    assert.ok(t.code?.python, `${id}.code.python eksik`);
    assert.ok(t.code?.spss, `${id}.code.spss eksik`);
  }
});

test('her test viz_module belirtmiş', () => {
  for (const [id, t] of Object.entries(tests)) {
    assert.ok(t.viz_module, `${id}.viz_module eksik`);
  }
});
