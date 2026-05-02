import { COLORS, makeSvg, makeSlider, controlPanel, statBox, setStats } from './_helpers.js';

export default function init(container, { lang }) {
  const W = 460, H = 320;
  const svg = makeSvg(container, { width: W, height: H });
  let shifts = [0, 2, 4], n = 8;
  const colors = [COLORS.groupA, COLORS.groupB, COLORS.groupC];
  let groups = [];

  function regen() {
    groups = shifts.map(s => Array.from({length: n}, () => 8 + s + (Math.random() - 0.5) * 4));
  }
  regen();

  const x = d3.scaleLinear().domain([0, 22]).range([30, W - 30]);
  const panel = controlPanel(container);
  const stats = statBox(container);

  function update() {
    svg.selectAll('*').remove();
    const ys = [70, 140, 210];
    groups.forEach((g, gi) => {
      svg.append('text').attr('x', 30).attr('y', ys[gi] - 18).style('font-size', '11px').text(`${lang==='tr'?'Grup':'Group'} ${gi+1}`);
      g.forEach(v => svg.append('circle').attr('cx', x(v)).attr('cy', ys[gi]).attr('r', 5).attr('fill', colors[gi]));
    });
    const all = groups.flatMap((g, gi) => g.map(v => ({ v, gi }))).sort((a,b) => a.v - b.v).map((d, i) => ({ ...d, rank: i+1 }));
    const N = all.length;
    const sumR = [0,0,0];
    all.forEach(d => sumR[d.gi] += d.rank);
    const H_ = (12 / (N*(N+1))) * sumR.reduce((a, r) => a + r*r/n, 0) - 3*(N+1);

    svg.append('text').attr('x', 30).attr('y', 268).style('font-size','11px').text(lang==='tr'?'Birleşik rank':'Pooled rank');
    all.forEach(d => svg.append('circle').attr('cx', x(d.v)).attr('cy', 280).attr('r', 5).attr('fill', colors[d.gi]));

    setStats(stats, [{ html: `H = ${H_.toFixed(2)} (df 2)`, color: H_ > 5.99 ? COLORS.accent : COLORS.ink }]);
  }

  shifts.forEach((s, i) => makeSlider(panel, { label: `${lang==='tr'?'Kayma':'Shift'} ${i+1}`, min: -3, max: 6, value: s, onChange: v => { shifts[i]=v; regen(); update(); } }));

  update();
  return { cleanup() { container.replaceChildren(); }, reset() { shifts=[0,2,4]; n=8; regen(); container.replaceChildren(); init(container,{lang}); } };
}
