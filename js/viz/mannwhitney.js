import { COLORS, makeSvg, makeSlider, controlPanel, statBox, setStats } from './_helpers.js';

export default function init(container, { lang }) {
  const W = 460, H = 320;
  const svg = makeSvg(container, { width: W, height: H });
  let nA = 8, nB = 8, shift = 3;
  let A = [], B = [];

  function regen() {
    A = Array.from({length: nA}, () => 8 + (Math.random() - 0.5) * 5);
    B = Array.from({length: nB}, () => 8 + shift + (Math.random() - 0.5) * 5);
  }
  regen();

  const x = d3.scaleLinear().domain([0, 20]).range([30, W - 30]);
  const panel = controlPanel(container);
  const stats = statBox(container);

  function update() {
    svg.selectAll('*').remove();
    const yA = 80, yB = 160, yR = 250;
    svg.append('text').attr('x', 30).attr('y', yA - 20).style('font-size','11px').text(lang==='tr'?'Grup A':'Group A');
    svg.append('text').attr('x', 30).attr('y', yB - 20).style('font-size','11px').text(lang==='tr'?'Grup B':'Group B');
    svg.append('text').attr('x', 30).attr('y', yR - 20).style('font-size','11px').text(lang==='tr'?'Birleşik (rank)':'Pooled (ranks)');

    A.forEach(v => svg.append('circle').attr('cx', x(v)).attr('cy', yA).attr('r', 5).attr('fill', COLORS.groupA));
    B.forEach(v => svg.append('circle').attr('cx', x(v)).attr('cy', yB).attr('r', 5).attr('fill', COLORS.groupB));

    const all = [...A.map(v => ({v, g:'A'})), ...B.map(v => ({v, g:'B'}))]
      .sort((a,b) => a.v - b.v).map((d, i) => ({ ...d, rank: i+1 }));
    all.forEach(d => {
      svg.append('circle').attr('cx', x(d.v)).attr('cy', yR).attr('r', 5).attr('fill', d.g==='A'?COLORS.groupA:COLORS.groupB);
      svg.append('text').attr('x', x(d.v)).attr('y', yR + 18).attr('text-anchor','middle').style('font-size','9px').text(d.rank);
    });

    const RA = all.filter(d => d.g === 'A').reduce((a,d) => a + d.rank, 0);
    const U = RA - nA*(nA+1)/2;
    setStats(stats, [{ html: `Σ rank(A) = ${RA}` }, { html: `U = ${U.toFixed(0)}` }]);
  }

  makeSlider(panel, { label: lang==='tr'?'Kayma':'Shift', min: -5, max: 7, value: shift, onChange: v => { shift=v; regen(); update(); } });
  makeSlider(panel, { label: 'nA', min: 4, max: 15, step: 1, value: nA, onChange: v => { nA=v; regen(); update(); } });
  makeSlider(panel, { label: 'nB', min: 4, max: 15, step: 1, value: nB, onChange: v => { nB=v; regen(); update(); } });

  update();
  return { cleanup() { container.replaceChildren(); }, reset() { nA=8; nB=8; shift=3; regen(); container.replaceChildren(); init(container,{lang}); } };
}
