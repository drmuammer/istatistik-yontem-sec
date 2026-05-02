import { COLORS, statBox, setStats } from './_helpers.js';

export default function init(container, { lang }) {
  let cells = [[40, 12], [3, 25]];
  const headers = lang==='tr'
    ? { row: 'Önce', col: 'Sonra', pos: 'Pozitif', neg: 'Negatif' }
    : { row: 'Before', col: 'After', pos: 'Positive', neg: 'Negative' };

  function build() {
    container.replaceChildren();
    const tbl = document.createElement('table');
    tbl.style.cssText = 'border-collapse:collapse;font-family:var(--mono);margin:auto;';
    const tr0 = document.createElement('tr');
    const td0a = document.createElement('td'); tr0.append(td0a);
    const td0b = document.createElement('td'); td0b.colSpan = 2; td0b.style.cssText = 'text-align:center;font-weight:bold;padding:8px'; td0b.textContent = headers.col; tr0.append(td0b);
    tbl.append(tr0);
    const tr1 = document.createElement('tr');
    const td1a = document.createElement('td'); tr1.append(td1a);
    [headers.pos, headers.neg].forEach(t => { const td = document.createElement('td'); td.style.padding = '6px'; td.textContent = t; tr1.append(td); });
    tbl.append(tr1);

    [[headers.pos, 0], [headers.neg, 1]].forEach(([rowLbl, ri]) => {
      const tr = document.createElement('tr');
      const tdL = document.createElement('td'); tdL.style.cssText = 'padding:6px;font-weight:bold'; tdL.textContent = rowLbl; tr.append(tdL);
      for (let cj = 0; cj < 2; cj++) {
        const td = document.createElement('td');
        const off = (ri === 0 && cj === 1) || (ri === 1 && cj === 0);
        td.style.cssText = `border:1px solid var(--rule);padding:0;width:80px;height:60px;text-align:center;${off ? `background:${COLORS.accentSoft};` : ''}`;
        const inp = document.createElement('input');
        inp.type = 'number'; inp.value = cells[ri][cj]; inp.min = 0;
        inp.style.cssText = 'width:100%;height:100%;border:0;text-align:center;font:inherit;background:transparent;';
        inp.addEventListener('input', () => { cells[ri][cj] = Math.max(0, parseInt(inp.value) || 0); update(); });
        td.append(inp); tr.append(td);
      }
      tbl.append(tr);
    });
    container.append(tbl);

    const stats = statBox(container);
    function update() {
      const b = cells[0][1], c = cells[1][0];
      const chi = (b + c) > 0 ? ((b - c)**2) / (b + c) : 0;
      setStats(stats, [{ html: `b=${b}, c=${c}` }, { html: `χ² (McNemar) = ${chi.toFixed(2)} (df 1)`, color: chi > 3.84 ? COLORS.accent : COLORS.ink }]);
    }
    update();
  }

  build();
  return { cleanup() { container.replaceChildren(); }, reset() { cells = [[40,12],[3,25]]; build(); } };
}
