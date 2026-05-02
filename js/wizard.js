import { html } from './dom.js';

export function renderWizard(container, { tree, state, i18n }) {
  function maxDepth(id, seen = new Set()) {
    if (seen.has(id)) return 0;
    const next = new Set(seen); next.add(id);
    const node = tree[id];
    if (!node || node.leaf) return 1;
    return 1 + Math.max(...node.options.map(o => maxDepth(o.next, next)));
  }
  const totalDepth = maxDepth('root');

  function render() {
    const path = state.getPath();
    const node = tree[path[path.length - 1]];
    if (node.leaf) { container.replaceChildren(); return; }

    const stepLabel = i18n.t('wizard.step', { current: path.length, total: totalDepth });
    const progress = Math.min(100, ((path.length - 1) / (totalDepth - 1)) * 100);
    const hint = node.hint ? i18n.pick(node.hint) : '';

    const frag = html`
      <span class="label wizard-step-label">${stepLabel}</span>
      <div class="wizard-progress" style="--progress: ${progress}%"></div>
      <h3 class="wizard-question">${i18n.pick(node.question)}</h3>
      ${hint ? `<div class="wizard-hint">${escapeForRaw(hint)}</div>` : ''}
      <div class="wizard-options" role="group"></div>
      <div class="wizard-controls">
        <button class="wizard-back">${i18n.t('wizard.back')}</button>
        <button class="wizard-reset">${i18n.t('wizard.reset')}</button>
      </div>
    `;
    container.replaceChildren(frag);

    const optsHost = container.querySelector('.wizard-options');
    node.options.forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'wizard-option';
      btn.dataset.next = opt.next;
      btn.append(html`<span class="opt-label">${i18n.pick(opt.label)}</span>`);
      if (opt.hint) btn.append(html`<span class="opt-hint">${i18n.pick(opt.hint)}</span>`);
      btn.addEventListener('click', () => state.select(opt.next));
      optsHost.append(btn);
    });

    const back = container.querySelector('.wizard-back');
    const reset = container.querySelector('.wizard-reset');
    back.disabled = path.length === 1;
    reset.disabled = path.length === 1;
    back.addEventListener('click', () => state.back());
    reset.addEventListener('click', () => state.reset());
  }

  function escapeForRaw(s) {
    return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  }

  state.subscribe(render);
  i18n.subscribe(render);
  render();
}
