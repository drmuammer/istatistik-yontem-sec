import { COLORS, makeSvg, makeSlider, controlPanel, statBox, setStats } from './_helpers.js';

export default function init(container, { lang }) {
  const W = 460, H = 320;
  const svg = makeSvg(container, { width: W, height: H });
  const k = 4;
  let n = 8, drift = 1.5, noise = 0.8;
  let data = [];

  function regen() {
    data = Array.from({length: n}, (_, i) => {
      const base = 10 + Math.sin(i * 1.3);
      return Array.from({length: k}, (_, t) => base + drift * t + (Math.random() - 0.5) * 2 * noise);
    });
  }
  regen();

  const cellW = (W - 80) / k;
  const cellH = (H - 100) / n;
  const panel = controlPanel(container);
  const stats = statBox(container);

  function update() {
    svg.selectAll('*').remove();
    for (let t = 0; t < k; t++) {
      svg.append('text').attr('x', 60 + cellW * (t + 0.5)).attr('y', 30).attr('text-anchor', 'middle').style('font-size', '11px').text(`T${t+1}`);
    }
    const R = Array(k).fill(0);
    data.forEach((row, ri) => {
      const ranks = row.map((v, ti) => ({ v, ti })).sort((a,b) => a.v - b.v).map((d, r) => ({ ...d, rank: r+1 }));
      ranks.forEach(d => {
        R[d.ti] += d.rank;
        svg.append('rect').attr('x', 60 + cellW * d.ti).attr('y', 50 + cellH * ri).attr('width', cellW - 2).attr('height', cellH - 2)
          .attr('fill', d3.interpolate(COLORS.accentSoft, COLORS.accent)(d.rank/k));
        svg.append('text').attr('x', 60 + cellW * (d.ti + 0.5)).attr('y', 50 + cellH * (ri + 0.6))
          .attr('text-anchor', 'middle').style('font-size', '11px').style('fill', d.rank === k ? '#fff' : COLORS.ink).text(d.rank);
      });
      svg.append('text').attr('x', 50).attr('y', 50 + cellH * (ri + 0.6)).attr('text-anchor', 'end').style('font-size', '10px').text(`s${ri+1}`);
    });
    const sumRsq = R.reduce((a, r) => a + r*r, 0);
    const chi = (12 / (n * k * (k+1))) * sumRsq - 3 * n * (k+1);
    setStats(stats, [{ html: `Σ R: ${R.map(r => r.toFixed(0)).join(', ')}` }, { html: `χ² (Friedman) = ${chi.toFixed(2)}` }]);
  }

  makeSlider(panel, { label: 'Drift', min: -2, max: 4, value: drift, onChange: v => { drift=v; regen(); update(); } });
  makeSlider(panel, { label: lang==='tr'?'Gürültü':'Noise', min: 0, max: 3, value: noise, onChange: v => { noise=v; regen(); update(); } });
  makeSlider(panel, { label: 'n', min: 3, max: 14, step: 1, value: n, onChange: v => { n=v; regen(); update(); } });

  update();
  return { cleanup() { container.replaceChildren(); }, reset() { drift=1.5; noise=0.8; n=8; regen(); container.replaceChildren(); init(container,{lang}); } };
}
