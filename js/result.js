import { html } from './dom.js';

export async function renderResult(container, { tree, state, i18n }) {
  const tests = await fetch('data/tests.json').then(r => r.json());
  let active = null;

  async function render() {
    const path = state.getPath();
    const node = state.getCurrentNode();
    if (!node?.leaf) {
      container.hidden = true;
      container.replaceChildren();
      cleanupDemo();
      return;
    }
    container.hidden = false;
    const t = tests[node.test_id];
    if (!t) {
      container.replaceChildren(html`<p>Test bulunamadı: ${node.test_id}</p>`);
      return;
    }

    container.replaceChildren(html`
      <h2 class="result-name">${i18n.pick(t.name)}</h2>
      <p class="result-summary">${i18n.pick(t.summary)}</p>
      <div class="result-grid">
        <div>
          <h4>${i18n.t('result.when_to_use')}</h4>
          <p>${i18n.pick(t.when_to_use)}</p>
        </div>
        <div>
          <h4>${i18n.t('result.assumptions')}</h4>
          <ul class="result-assumptions"></ul>
        </div>
      </div>
      <div>
        <h4>${i18n.t('result.example')}</h4>
        <div class="result-example">${i18n.pick(t.example)}</div>
      </div>
      <div class="result-demo">
        <div class="result-demo-header">
          <h4>${i18n.t('result.demo')}</h4>
          <button class="reset-demo">${i18n.t('result.reset_demo')}</button>
        </div>
        <div class="result-demo-canvas" id="demo-canvas"></div>
      </div>
      <div class="result-code-section"></div>
      <div class="result-path">
        <h4>${i18n.t('result.path')}</h4>
        <ol class="path-list"></ol>
      </div>
      <div class="result-references">
        <h4>${i18n.t('result.references')}</h4>
        <ul class="ref-list"></ul>
      </div>
    `);

    const ulA = container.querySelector('.result-assumptions');
    const list = i18n.getLang() === 'tr' ? t.assumptions.tr : t.assumptions.en;
    list.forEach(a => { const li = document.createElement('li'); li.textContent = a; ulA.append(li); });

    const ol = container.querySelector('.path-list');
    path.slice(0, -1).forEach((id, idx) => {
      const n = tree[id];
      const choice = n.options?.find(o => o.next === path[idx + 1]);
      if (!choice) return;
      const li = document.createElement('li');
      li.append(html`${i18n.pick(n.question)} <strong>→ ${i18n.pick(choice.label)}</strong>`);
      ol.append(li);
    });

    const refs = container.querySelector('.ref-list');
    (t.references || []).forEach(r => { const li = document.createElement('li'); li.textContent = r; refs.append(li); });

    if (t.code) {
      const sec = container.querySelector('.result-code-section');
      sec.append(html`<h4>${i18n.t('result.code')}</h4>`);
      const tabs = document.createElement('div'); tabs.className = 'result-code-tabs'; tabs.setAttribute('role', 'tablist');
      const block = document.createElement('pre'); block.className = 'result-code-block';
      const langs = ['r','python','spss'].filter(l => t.code[l]);
      langs.forEach((lang, i) => {
        const btn = document.createElement('button');
        btn.className = 'result-code-tab'; btn.setAttribute('role', 'tab');
        btn.dataset.codeLang = lang; btn.textContent = lang.toUpperCase();
        btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        btn.addEventListener('click', () => {
          tabs.querySelectorAll('.result-code-tab').forEach(x => x.setAttribute('aria-selected', x === btn ? 'true' : 'false'));
          block.textContent = t.code[lang];
        });
        tabs.append(btn);
      });
      sec.append(tabs); sec.append(block);
      if (langs.length) block.textContent = t.code[langs[0]];
    }

    const canvas = container.querySelector('#demo-canvas');
    cleanupDemo();
    let mod;
    try { mod = await import(`./viz/${t.viz_module}.js`); }
    catch (e) { console.warn('Demo yüklenemedi:', e); mod = await import('./viz/_placeholder.js'); }
    active = mod.default(canvas, { lang: i18n.getLang(), testId: node.test_id });
    container.querySelector('.reset-demo')?.addEventListener('click', () => active?.reset?.());
  }

  function cleanupDemo() { active?.cleanup?.(); active = null; }
  state.subscribe(render);
  i18n.subscribe(render);
  render();
}
