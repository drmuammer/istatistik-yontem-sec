import { html } from './dom.js';

export function renderTree(container, { tree, state, i18n }) {
  let testsCache = null;
  fetch('data/tests.json').then(r => r.json()).then(t => { testsCache = t; render(); });

  function buildHierarchy(id) {
    const n = tree[id];
    const item = { id, raw: n };
    if (!n.leaf) item.children = n.options.map(o => buildHierarchy(o.next));
    return item;
  }

  function fullLabel(id) {
    const n = tree[id];
    if (id === 'root') return i18n.pick({ tr: 'Başla', en: 'Start' });
    if (n.leaf) {
      const t = testsCache?.[n.test_id];
      return t ? i18n.pick(t.name) : n.test_id;
    }
    return i18n.pick(n.question);
  }

  function shortLabel(id) {
    const raw = fullLabel(id);
    return raw.length > 24 ? raw.slice(0, 24) + '…' : raw;
  }

  function render() {
    const path = state.getPath();
    const active = new Set(path);

    const root = d3.hierarchy(buildHierarchy('root'));
    d3.tree().nodeSize([195, 115])(root);

    let minX = Infinity, maxX = -Infinity, maxY = 0;
    root.each(n => { minX = Math.min(minX, n.x); maxX = Math.max(maxX, n.x); maxY = Math.max(maxY, n.y); });
    const width = (maxX - minX) + 220;
    const height = maxY + 100;
    const offsetX = -minX + 110;

    const recenterLabel = i18n.pick({ tr: 'Başa dön', en: 'Recenter' });

    container.replaceChildren(html`
      <div class="tree-toolbar">
        <span class="label">${i18n.t('tree.title')} — ${i18n.t('tree.click_hint')}</span>
        <button class="tree-recenter" type="button" title="${recenterLabel}" aria-label="${recenterLabel}">
          <span aria-hidden="true">↺</span> ${recenterLabel}
        </button>
      </div>
      <div class="tree-scroll">
        <svg class="tree-svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"></svg>
      </div>
    `);

    const scroll = container.querySelector('.tree-scroll');

    function recenter(smooth = true) {
      const rootScreenX = offsetX; // root.x === 0, screen X = 0 + offsetX
      const target = Math.max(0, rootScreenX - scroll.clientWidth / 2);
      scroll.scrollTo({ left: target, behavior: smooth ? 'smooth' : 'auto' });
    }

    container.querySelector('.tree-recenter').addEventListener('click', () => recenter(true));
    // İlk render'da animasyonsuz merkezle (kullanıcı sayfayı açar açmaz root görünsün).
    requestAnimationFrame(() => recenter(false));

    const svg = d3.select(container).select('svg');

    svg.selectAll('path.tree-link')
      .data(root.links()).enter().append('path')
      .attr('class', d => 'tree-link' + (active.has(d.source.data.id) && active.has(d.target.data.id) ? ' active' : (path.length > 1 ? ' dim' : '')))
      .attr('d', d => {
        const sx = d.source.x + offsetX, sy = d.source.y + 40 + 18;
        const tx = d.target.x + offsetX, ty = d.target.y + 40 - 18;
        const my = sy + (ty - sy) / 2;
        return `M${sx},${sy} V${my} H${tx} V${ty}`;
      });

    const nodes = svg.selectAll('g.tree-node')
      .data(root.descendants()).enter().append('g')
      .attr('class', d => {
        const cls = ['tree-node', 'clickable'];
        if (d.data.raw.leaf) cls.push('leaf');
        if (active.has(d.data.id)) cls.push('active');
        else if (path.length > 1) cls.push('dim');
        return cls.join(' ');
      })
      .attr('transform', d => `translate(${d.x + offsetX}, ${d.y + 40})`)
      .attr('role', 'button')
      .attr('tabindex', 0)
      .attr('aria-label', d => shortLabel(d.data.id))
      .on('click', (e, d) => {
        if (d.data.id === 'root') state.reset(); else state.jumpTo(d.data.id);
      })
      .on('keydown', (e, d) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (d.data.id === 'root') state.reset(); else state.jumpTo(d.data.id);
        }
      });

    nodes.append('rect').attr('x', -85).attr('y', -18).attr('width', 170).attr('height', 36).attr('rx', 3);
    nodes.append('text').attr('text-anchor', 'middle').attr('dominant-baseline', 'middle').text(d => shortLabel(d.data.id));
    nodes.append('title').text(d => fullLabel(d.data.id));
  }

  state.subscribe(render);
  i18n.subscribe(render);
  render();
}
