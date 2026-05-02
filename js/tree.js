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

  function shortLabel(id) {
    const n = tree[id];
    if (id === 'root') return i18n.pick({ tr: 'Başla', en: 'Start' });
    let raw;
    if (n.leaf) {
      const t = testsCache?.[n.test_id];
      raw = t ? i18n.pick(t.name) : n.test_id;
    } else {
      raw = i18n.pick(n.question);
    }
    return raw.length > 16 ? raw.slice(0, 16) + '…' : raw;
  }

  function render() {
    const path = state.getPath();
    const active = new Set(path);

    const root = d3.hierarchy(buildHierarchy('root'));
    d3.tree().nodeSize([105, 115])(root);

    let minX = Infinity, maxX = -Infinity, maxY = 0;
    root.each(n => { minX = Math.min(minX, n.x); maxX = Math.max(maxX, n.x); maxY = Math.max(maxY, n.y); });
    const width = (maxX - minX) + 180;
    const height = maxY + 100;
    const offsetX = -minX + 90;

    container.replaceChildren(html`
      <span class="label">${i18n.t('tree.title')} — ${i18n.t('tree.click_hint')}</span>
      <svg class="tree-svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"></svg>
    `);

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

    nodes.append('rect').attr('x', -50).attr('y', -18).attr('width', 100).attr('height', 36).attr('rx', 3);
    nodes.append('text').attr('text-anchor', 'middle').attr('dominant-baseline', 'middle').text(d => shortLabel(d.data.id));
    nodes.append('title').text(d => shortLabel(d.data.id));
  }

  state.subscribe(render);
  i18n.subscribe(render);
  render();
}
