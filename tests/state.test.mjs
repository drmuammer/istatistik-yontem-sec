import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createState } from '../js/state.js';
import { readFile } from 'node:fs/promises';

const tree = JSON.parse(await readFile('data/tree.json', 'utf-8'));

test('başlangıçta path = ["root"]', () => {
  const s = createState(tree);
  assert.deepEqual(s.getPath(), ['root']);
});

test('select() ilerletir', () => {
  const s = createState(tree);
  s.select('compare');
  assert.deepEqual(s.getPath(), ['root', 'compare']);
});

test('select geçersiz id verirse hata', () => {
  const s = createState(tree);
  assert.throws(() => s.select('nonexistent'));
});

test('back() son düğümü atar', () => {
  const s = createState(tree);
  s.select('compare');
  s.select('compare_continuous');
  s.back();
  assert.deepEqual(s.getPath(), ['root', 'compare']);
});

test('back, root\'tan geri gitmez', () => {
  const s = createState(tree);
  s.back();
  assert.deepEqual(s.getPath(), ['root']);
});

test('reset()', () => {
  const s = createState(tree);
  s.select('compare');
  s.reset();
  assert.deepEqual(s.getPath(), ['root']);
});

test('jumpTo() ataları otomatik doldurur', () => {
  const s = createState(tree);
  s.jumpTo('indep_two_yes');
  assert.deepEqual(s.getPath(), [
    'root','compare','compare_continuous','continuous_independent','indep_two_normal','indep_two_yes'
  ]);
});

test('subscribe + publish', () => {
  const s = createState(tree);
  let calls = 0, last = null;
  s.subscribe(p => { calls++; last = p; });
  s.select('compare');
  assert.equal(calls, 1);
  assert.deepEqual(last, ['root','compare']);
});

test('isLeaf()', () => {
  const s = createState(tree);
  assert.equal(s.isLeaf(), false);
  s.jumpTo('indep_two_yes');
  assert.equal(s.isLeaf(), true);
});
