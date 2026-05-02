import { createState } from './state.js';
import { createI18n } from './i18n.js';
import { renderWizard } from './wizard.js';
import { renderTree } from './tree.js';
import { renderResult } from './result.js';
import { initHeroAnim } from './heroAnim.js';

(async function init() {
  try {
    const [tree, strings] = await Promise.all([
      fetch('data/tree.json').then(r => r.json()),
      fetch('data/strings.json').then(r => r.json()),
    ]);
    const initialLang = (navigator.language || 'tr').toLowerCase().startsWith('tr') ? 'tr' : 'en';
    const i18n = createI18n(strings, initialLang);
    const state = createState(tree);

    function applyI18n() {
      document.documentElement.lang = i18n.getLang();
      document.documentElement.setAttribute('data-lang', i18n.getLang());
      document.title = i18n.t('site.title');
      document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = i18n.t(el.dataset.i18n); });
      const lt = document.getElementById('lang-toggle');
      if (lt) lt.textContent = i18n.getLang() === 'tr' ? 'EN' : 'TR';

      const list = document.getElementById('footer-sources');
      if (list) {
        list.replaceChildren();
        ['sources.0','sources.1','sources.2'].forEach(k => {
          const li = document.createElement('li'); li.textContent = i18n.t(k); list.append(li);
        });
      }
    }
    i18n.subscribe(applyI18n); applyI18n();

    document.getElementById('lang-toggle')?.addEventListener('click', () => i18n.setLang(i18n.getLang() === 'tr' ? 'en' : 'tr'));
    document.querySelector('[data-action="start"]')?.addEventListener('click', () => {
      document.getElementById('explorer')?.scrollIntoView({ behavior: 'smooth' });
    });

    initHeroAnim(document.getElementById('hero-bg'));

    renderWizard(document.getElementById('wizard'), { tree, state, i18n });
    renderTree(document.getElementById('tree'), { tree, state, i18n });
    renderResult(document.getElementById('result'), { tree, state, i18n });

    state.subscribe(p => {
      const last = tree[p[p.length - 1]];
      if (last?.leaf) setTimeout(() => document.getElementById('result')?.scrollIntoView({ behavior: 'smooth' }), 200);
    });

    const showMap = document.getElementById('show-map');
    const closeMap = document.getElementById('close-map');
    function openMap() { document.body.classList.add('map-open'); }
    function closeMapFn() { document.body.classList.remove('map-open'); }
    showMap?.addEventListener('click', openMap);
    closeMap?.addEventListener('click', closeMapFn);
    state.subscribe(() => {
      if (document.body.classList.contains('map-open')) closeMapFn();
    });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        if (document.body.classList.contains('map-open')) { closeMapFn(); e.preventDefault(); return; }
        if (state.isLeaf()) state.back();
      }
    });
  } catch (e) {
    console.error(e);
    const p = document.createElement('p');
    p.style.cssText = 'padding:2em;font-family:Georgia,serif';
    p.textContent = 'Veri yüklenemedi. Sayfayı yenileyin.';
    document.body.replaceChildren(p);
  }
})();
