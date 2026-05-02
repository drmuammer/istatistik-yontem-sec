import { COLORS, makeSvg, makeSlider, controlPanel, statBox, setStats } from './_helpers.js';

export default function init(container, { lang }) {
  const W = 460, H = 360;
  const svg = makeSvg(container, { width: W, height: H });
  let n = 10, effect = 2, noise = 1.5;
  let pairs = [];

  function regen() {
    pairs = Array.from({length: n}, (_, i) => {
      const before = 10 + Math.sin(i * 1.7) * 1.5;
      const after = before + effect + (Math.random() - 0.5) * 2 * noise;
      return { before, after, diff: after - before };
    });
  }
  regen();

  const x = d3.scaleLinear().domain([-6, 6]).range([30, W - 30]);
  const panel = controlPanel(container);
  const stats = statBox(container);

  function update() {
    svg.selectAll('*').remove();
    svg.append('text').attr('x', 30).attr('y', 30).style('font-size', '11px').text(lang==='tr'?'Fark (sonrası − öncesi)':'Difference (after − before)');
    svg.append('line').attr('x1', x(0)).attr('x2', x(0)).attr('y1', 60).attr('y2', H - 100).attr('stroke', COLORS.mute).attr('stroke-dasharray', '3,3');
    svg.append('g').attr('transform', `translate(0,${H - 100})`).call(d3.axisBottom(x).ticks(7));

    const sorted = pairs.map((p, i) => ({ ...p, idx: i })).sort((a,b) => Math.abs(a.diff) - Math.abs(b.diff));
    sorted.forEach((p, rank) => {
      const yPos = 70 + rank * 18;
      const c = p.diff >= 0 ? COLORS.accent : COLORS.groupA;
      svg.append('circle').attr('cx', x(p.diff)).attr('cy', yPos).attr('r', 5).attr('fill', c);
      svg.append('text').attr('x', x(p.diff) + (p.diff >= 0 ? 10 : -10)).attr('y', yPos + 3)
        .attr('text-anchor', p.diff >= 0 ? 'start' : 'end').style('font-size', '9px')
        .text(`r${rank+1} ${p.diff >= 0 ? '+' : '−'}`);
    });

    const Wpos = sorted.reduce((a, p, r) => p.diff >= 0 ? a + (r+1) : a, 0);
    const positives = pairs.filter(p => p.diff > 0).length;
    setStats(stats, [
      { html: `W⁺ (Wilcoxon) = ${Wpos}` },
      { html: `${lang==='tr'?'+ işaretli':'positives'}: ${positives}/${n} (Sign test)` },
    ]);
  }

  makeSlider(panel, { label: lang==='tr'?'Etki':'Effect', min: -3, max: 4, value: effect, onChange: v => { effect=v; regen(); update(); } });
  makeSlider(panel, { label: lang==='tr'?'Gürültü':'Noise', min: 0.2, max: 3, value: noise, onChange: v => { noise=v; regen(); update(); } });
  makeSlider(panel, { label: 'n', min: 5, max: 16, step: 1, value: n, onChange: v => { n=v; regen(); update(); } });

  update();
  return { cleanup() { container.replaceChildren(); }, reset() { effect=2; noise=1.5; n=10; regen(); container.replaceChildren(); init(container,{lang}); } };
}
