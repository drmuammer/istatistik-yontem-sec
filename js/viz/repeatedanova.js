import { COLORS, makeSvg, makeSlider, controlPanel, statBox, setStats } from './_helpers.js';

export default function init(container, { lang }) {
  const W = 460, H = 320;
  const svg = makeSvg(container, { width: W, height: H });
  const T = 4;
  let n = 8, drift = 1.5, noise = 1;
  let series = [];

  function regen() {
    series = Array.from({length: n}, (_, i) => {
      const baseline = 10 + Math.sin(i * 1.3) * 1.5;
      return Array.from({length: T}, (_, t) => baseline + drift * t + (Math.random() - 0.5) * 2 * noise);
    });
  }
  regen();

  const x = d3.scaleLinear().domain([0, T-1]).range([60, W-30]);
  const y = d3.scaleLinear().domain([4, 22]).range([H-60, 30]);
  const line = d3.line().x((d, i) => x(i)).y(d => y(d));

  const panel = controlPanel(container);
  const stats = statBox(container);

  function update() {
    svg.selectAll('*').remove();
    svg.append('g').attr('transform', `translate(0,${H-60})`).call(d3.axisBottom(x).ticks(T).tickFormat(t => `T${t+1}`));
    svg.append('g').attr('transform', 'translate(60,0)').call(d3.axisLeft(y).ticks(5));
    series.forEach(s => svg.append('path').attr('d', line(s)).attr('fill','none').attr('stroke', COLORS.ink).attr('stroke-width', 1).attr('opacity', 0.5));
    const mean = Array.from({length: T}, (_, t) => series.reduce((a,s)=>a+s[t],0) / series.length);
    svg.append('path').attr('d', line(mean)).attr('fill','none').attr('stroke', COLORS.accent).attr('stroke-width', 3);

    const grand = mean.reduce((a,b)=>a+b,0) / T;
    const ssB = mean.reduce((a, m) => a + n*(m-grand)**2, 0);
    const ssW = series.flatMap((s) => s.map((v, t) => (v - mean[t])**2)).reduce((a,b)=>a+b,0);
    const F = (ssB/(T-1)) / (ssW/((n-1)*T));
    setStats(stats, [{ html: `F ≈ ${F.toFixed(2)}` }, { html: lang==='tr'?'Ortalama profili (turuncu)':'Mean profile (orange)' }]);
  }

  makeSlider(panel, { label: 'Drift', min: -2, max: 4, value: drift, onChange: v => { drift=v; regen(); update(); } });
  makeSlider(panel, { label: lang==='tr'?'Gürültü':'Noise', min: 0, max: 3, value: noise, onChange: v => { noise=v; regen(); update(); } });
  makeSlider(panel, { label: 'n', min: 3, max: 20, step: 1, value: n, onChange: v => { n=v; regen(); update(); } });

  update();
  return { cleanup() { container.replaceChildren(); }, reset() { drift=1.5; noise=1; n=8; regen(); container.replaceChildren(); init(container,{lang}); } };
}
