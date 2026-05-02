import { COLORS, makeSvg, makeSlider, controlPanel, statBox, setStats } from './_helpers.js';

export default function init(container, { lang }) {
  const W = 460, H = 320;
  const svg = makeSvg(container, { width: W, height: H });
  let n = 12, effect = 3, noise = 1.5;
  let pairs = [];

  function regen() {
    pairs = Array.from({length: n}, (_, i) => {
      const before = 10 + Math.sin(i * 1.7) * 2;
      const after = before + effect + (Math.random() - 0.5) * 2 * noise;
      return { before, after };
    });
  }
  regen();

  const x = d3.scalePoint().domain(['before','after']).range([60, W-30]).padding(0.3);
  const y = d3.scaleLinear().domain([4, 22]).range([H-60, 30]);

  const panel = controlPanel(container);
  const stats = statBox(container);

  function update() {
    svg.selectAll('*').remove();
    svg.append('g').attr('transform', `translate(0,${H-60})`).call(d3.axisBottom(x)
      .tickFormat(d => lang === 'tr' ? (d === 'before' ? 'Öncesi' : 'Sonrası') : d));
    svg.append('g').attr('transform', 'translate(60,0)').call(d3.axisLeft(y).ticks(5));

    pairs.forEach(p => {
      const c = p.after > p.before ? COLORS.accent : COLORS.mute;
      svg.append('line').attr('x1', x('before')).attr('y1', y(p.before)).attr('x2', x('after')).attr('y2', y(p.after))
        .attr('stroke', c).attr('stroke-width', 1.5).attr('opacity', 0.7);
      svg.append('circle').attr('cx', x('before')).attr('cy', y(p.before)).attr('r', 3).attr('fill', COLORS.ink);
      svg.append('circle').attr('cx', x('after')).attr('cy', y(p.after)).attr('r', 3).attr('fill', c);
    });

    const diffs = pairs.map(p => p.after - p.before);
    const mean = diffs.reduce((a,b)=>a+b,0) / diffs.length;
    const sd = Math.sqrt(diffs.map(d => (d-mean)**2).reduce((a,b)=>a+b,0) / (diffs.length-1));
    const t = mean / (sd / Math.sqrt(diffs.length));
    setStats(stats, [
      { html: `${lang==='tr'?'Ort. fark':'Mean diff'} = ${mean.toFixed(2)}` },
      { html: `SD = ${sd.toFixed(2)}` },
      { html: `t = ${t.toFixed(2)}`, color: Math.abs(t) > 2 ? COLORS.accent : COLORS.ink },
    ]);
  }

  makeSlider(panel, { label: lang==='tr'?'Etki':'Effect', min: -5, max: 5, value: effect, onChange: v => { effect=v; regen(); update(); } });
  makeSlider(panel, { label: lang==='tr'?'Gürültü':'Noise', min: 0, max: 4, value: noise, onChange: v => { noise=v; regen(); update(); } });
  makeSlider(panel, { label: 'n', min: 4, max: 30, step: 1, value: n, onChange: v => { n=v; regen(); update(); } });

  update();
  return { cleanup() { container.replaceChildren(); }, reset() { effect=3; noise=1.5; n=12; regen(); container.replaceChildren(); init(container,{lang}); } };
}
