import { COLORS, bellPoints, makeSvg, makeSlider, controlPanel, statBox, setStats } from './_helpers.js';

export default function init(container, { lang }) {
  const W = 460, H = 320;
  const svg = makeSvg(container, { width: W, height: H });
  const x = d3.scaleLinear().domain([0, 20]).range([30, W - 30]);
  const y = d3.scaleLinear().domain([0, 0.3]).range([H - 60, 30]);
  const line = d3.line().x(d => x(d[0])).y(d => y(d[1]));

  let mu1 = 8, mu2 = 12, sigma = 2, n = 30;
  const pathA = svg.append('path').attr('fill', 'none').attr('stroke', COLORS.groupA).attr('stroke-width', 2);
  const pathB = svg.append('path').attr('fill', 'none').attr('stroke', COLORS.groupB).attr('stroke-width', 2);
  svg.append('g').attr('transform', `translate(0,${H - 60})`).call(d3.axisBottom(x).ticks(8));

  const panel = controlPanel(container);
  const stats = statBox(container);

  function normCdf(z) {
    const a1=0.254829592,a2=-0.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=0.3275911;
    const sign = z < 0 ? -1 : 1; z = Math.abs(z) / Math.sqrt(2);
    const tt = 1.0 / (1.0 + p * z);
    const yv = 1.0 - ((((a5*tt + a4)*tt + a3)*tt + a2)*tt + a1)*tt * Math.exp(-z*z);
    return 0.5 * (1.0 + sign * yv);
  }

  function update() {
    pathA.attr('d', line(bellPoints(mu1, sigma, [0, 20])));
    pathB.attr('d', line(bellPoints(mu2, sigma, [0, 20])));
    const se = sigma * Math.sqrt(2 / n);
    const t = (mu2 - mu1) / se;
    const p = 2 * (1 - normCdf(Math.abs(t)));
    setStats(stats, [
      { html: `μ₁ = ${mu1.toFixed(1)}, μ₂ = ${mu2.toFixed(1)}` },
      { html: `t = ${t.toFixed(2)}` },
      { html: `p ≈ ${p.toFixed(3)}`, color: p < 0.05 ? COLORS.accent : COLORS.ink },
    ]);
  }

  makeSlider(panel, { label: lang==='tr'?'Ortalama 1':'Mean 1', min: 4, max: 16, value: mu1, onChange: v => { mu1=v; update(); } });
  makeSlider(panel, { label: lang==='tr'?'Ortalama 2':'Mean 2', min: 4, max: 16, value: mu2, onChange: v => { mu2=v; update(); } });
  makeSlider(panel, { label: lang==='tr'?'Std sapma':'Std dev', min: 0.5, max: 4, value: sigma, onChange: v => { sigma=v; update(); } });
  makeSlider(panel, { label: 'n', min: 5, max: 100, step: 1, value: n, onChange: v => { n=v; update(); } });

  update();
  return {
    cleanup() { container.replaceChildren(); },
    reset() { mu1=8; mu2=12; sigma=2; n=30; container.replaceChildren(); init(container, { lang }); },
  };
}
