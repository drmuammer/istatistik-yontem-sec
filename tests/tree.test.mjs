import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const tree = JSON.parse(await readFile('data/tree.json', 'utf-8'));

test('root mevcut ve seçenekleri var', () => {
  assert.ok(tree.root);
  assert.ok(tree.root.options.length > 0);
});

test('her option.next ağaçta var olan bir id', () => {
  for (const [nodeId, node] of Object.entries(tree)) {
    if (node.leaf) continue;
    for (const opt of node.options) {
      assert.ok(tree[opt.next], `${nodeId} → ${opt.next} eksik`);
    }
  }
});

test('her leaf bir test_id taşır', () => {
  for (const [nodeId, node] of Object.entries(tree)) {
    if (node.leaf) assert.ok(node.test_id, `${nodeId} leaf ama test_id yok`);
  }
});

test('her ara node TR + EN soru içerir', () => {
  for (const [nodeId, node] of Object.entries(tree)) {
    if (node.leaf || nodeId === 'root') continue;
    assert.ok(node.question?.tr, `${nodeId} TR soru eksik`);
    assert.ok(node.question?.en, `${nodeId} EN soru eksik`);
    assert.ok(node.options.length >= 2);
  }
});

test('beklenen leaf sayısı 16', () => {
  const leaves = Object.values(tree).filter(n => n.leaf);
  assert.equal(leaves.length, 16);
});
