import { COLORS, statBox, setStats } from './_helpers.js';

export default function init(container, { lang, testId }) {
  const rows = testId === 'chisquare_nxm' ? 3 : 2;
  const cols = rows;
  let cells = Array.from({length: rows}, () => Array.from({length: cols}, () => Math.floor(20 + Math.random() * 30)));

  function build() {
    container.replaceChildren();
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:24px;';
    container.append(wrap);

    const titleStyle = 'font-family:var(--sans);font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--ink-mute);margin-bottom:8px';
    const left = document.createElement('div'); const lh = document.createElement('h5'); lh.style.cssText = titleStyle; lh.textContent = lang==='tr'?'Gözlenen':'Observed'; left.append(lh); wrap.append(left);
    const right = document.createElement('div'); const rh = document.createElement('h5'); rh.style.cssText = titleStyle; rh.textContent = lang==='tr'?'Beklenen':'Expected'; right.append(rh); wrap.append(right);

    const stats = statBox(container);

    function makeTable(target, values, isInput) {
      const old = target.querySelector('table'); if (old) old.remove();
      const tbl = document.createElement('table');
      tbl.style.cssText = 'border-collapse:collapse;font-family:var(--mono);';
      for (let i = 0; i < rows; i++) {
        const tr = document.createElement('tr');
        for (let j = 0; j < cols; j++) {
          const td = document.createElement('td');
          td.style.cssText = 'border:1px solid var(--rule);padding:0;width:60px;height:50px;text-align:center;';
          if (isInput) {
            const inp = document.createElement('input');
            inp.type = 'number'; inp.value = values[i][j]; inp.min = 0;
            inp.style.cssText = 'width:100%;height:100%;border:0;text-align:center;font:inherit;background:transparent;';
            inp.addEventListener('input', () => { cells[i][j] = Math.max(0, parseInt(inp.value) || 0); update(); });
            td.append(inp);
          } else {
            td.textContent = values[i][j].toFixed(1);
            if (testId === 'chisquare_2x2' && values[i][j] < 5) {
              td.style.background = COLORS.accentSoft; td.style.color = COLORS.accent; td.style.fontWeight = 'bold';
            }
          }
          tr.append(td);
        }
        tbl.append(tr);
      }
      target.append(tbl);
    }

    function update() {
      const rowSums = cells.map(r => r.reduce((a,b)=>a+b,0));
      const colSums = Array.from({length: cols}, (_, j) => cells.reduce((a, r) => a + r[j], 0));
      const N = rowSums.reduce((a,b) => a+b, 0);
      const expected = Array.from({length: rows}, (_, i) => Array.from({length: cols}, (_, j) => (rowSums[i] * colSums[j]) / N));
      let chi = 0; let lowExp = false;
      for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
        if (expected[i][j] < 5) lowExp = true;
        if (expected[i][j] > 0) chi += ((cells[i][j] - expected[i][j])**2) / expected[i][j];
      }
      const df = (rows-1) * (cols-1);
      makeTable(left, cells, true);
      makeTable(right, expected, false);
      const items = [{ html: `χ² = ${chi.toFixed(2)} (df ${df})` }, { html: `N = ${N}` }];
      if (lowExp && rows === 2) items.push({ html: lang==='tr'?'Beklenen <5 → Fisher kesin testi':'Expected <5 → Fisher\'s exact', color: COLORS.accent });
      setStats(stats, items);
    }
    update();
  }

  build();
  return { cleanup() { container.replaceChildren(); }, reset() { cells = Array.from({length: rows}, () => Array.from({length: cols}, () => Math.floor(20 + Math.random()*30))); build(); } };
}
