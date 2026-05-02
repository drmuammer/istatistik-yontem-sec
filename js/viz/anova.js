import { COLORS, bellPoints, makeSvg, makeSlider, controlPanel, statBox, setStats } from './_helpers.js';

export default function init(container, { lang }) {
  const W = 460, H = 320;
  const svg = makeSvg(container, { width: W, height: H });
  const x = d3.scaleLinear().domain([0, 20]).range([30, W - 30]);
  const y = d3.scaleLinear().domain([0, 0.3]).range([H - 60, 30]);
  const line = d3.line().x(d => x(d[0])).y(d => y(d[1]));

  let mus = [7, 10, 13], sigma = 2, n = 30;
  const colors = [COLORS.groupA, COLORS.groupB, COLORS.groupC];
  const paths = mus.map((_, i) => svg.append('path').attr('fill', 'none').attr('stroke', colors[i]).attr('stroke-width', 2));
  svg.append('g').attr('transform', `translate(0,${H - 60})`).call(d3.axisBottom(x).ticks(8));

  const panel = controlPanel(container);
  const stats = statBox(container);

  function update() {
    paths.forEach((p, i) => p.attr('d', line(bellPoints(mus[i], sigma, [0, 20]))));
    const grand = mus.reduce((a,b)=>a+b,0)/mus.length;
    const ssB = mus.reduce((a,m) => a + n*(m-grand)**2, 0);
    const ssW = mus.length * (n-1) * sigma**2;
    const dfB = mus.length - 1, dfW = mus.length * (n-1);
    const F = (ssB/dfB) / (ssW/dfW);
    setStats(stats, [
      { html: `μ: ${mus.map(m=>m.toFixed(1)).join(', ')}` },
      { html: `F = ${F.toFixed(2)} (df ${dfB}, ${dfW})`, color: F > 3 ? COLORS.accent : COLORS.ink },
    ]);
  }

  ['1','2','3'].forEach((s, i) => makeSlider(panel, { label: `${lang==='tr'?'Ort.':'Mean'} ${s}`, min: 4, max: 16, value: mus[i], onChange: v => { mus[i]=v; update(); } }));
  makeSlider(panel, { label: lang==='tr'?'Std sapma':'Std dev', min: 0.5, max: 4, value: sigma, onChange: v => { sigma=v; update(); } });

  update();
  return { cleanup() { container.replaceChildren(); }, reset() { mus=[7,10,13]; sigma=2; container.replaceChildren(); init(container,{lang}); } };
}
