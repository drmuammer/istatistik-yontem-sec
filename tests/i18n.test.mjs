import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createI18n } from '../js/i18n.js';

const strings = {
  'foo': { tr: 'türkçe', en: 'english' },
  'bar': { tr: 'iki' },
  'with.placeholder': { tr: 'Adım {current}/{total}', en: 'Step {current}/{total}' },
};

test('varsayılan dil tr', () => {
  assert.equal(createI18n(strings).getLang(), 'tr');
});
test('t() çevirir', () => {
  const i = createI18n(strings);
  assert.equal(i.t('foo'), 'türkçe');
  i.setLang('en'); assert.equal(i.t('foo'), 'english');
});
test('eksik dil için fallback', () => {
  const i = createI18n(strings); i.setLang('en');
  assert.equal(i.t('bar'), 'iki');
});
test('placeholder', () => {
  assert.equal(createI18n(strings).t('with.placeholder', { current: 2, total: 5 }), 'Adım 2/5');
});
test('subscribe', () => {
  const i = createI18n(strings);
  let l = null; i.subscribe(x => { l = x; });
  i.setLang('en'); assert.equal(l, 'en');
});
test('eksik anahtar key adını döner', () => {
  assert.equal(createI18n(strings).t('missing'), 'missing');
});
