import { COLORS, makeSvg, makeSlider, controlPanel, statBox, setStats } from './_helpers.js';

export default function init(container, { lang }) {
  const W = 460, H = 320;
  const svg = makeSvg(container, { width: W, height: H });
  let pts = Array.from({length: 14}, (_, i) => { const t = i/13; return [2 + t*16, 3 + t*12 + (Math.random()-0.5)*3]; });
  let m = 0.7, b = 3;
  const x = d3.scaleLinear().domain([0,20]).range([40, W-20]);
  const y = d3.scaleLinear().domain([0,20]).range([H-60, 30]);
  const panel = controlPanel(container);
  const stats = statBox(container);

  function update() {
    svg.selectAll('*').remove();
    svg.append('g').attr('transform', `translate(0,${H-60})`).call(d3.axisBottom(x).ticks(5));
    svg.append('g').attr('transform', 'translate(40,0)').call(d3.axisLeft(y).ticks(5));
    svg.append('line').attr('x1', x(0)).attr('y1', y(b)).attr('x2', x(20)).attr('y2', y(m*20+b)).attr('stroke', COLORS.accent).attr('stroke-width', 2);
    pts.forEach(p => {
      const yhat = m*p[0]+b;
      svg.append('line').attr('x1', x(p[0])).attr('x2', x(p[0])).attr('y1', y(p[1])).attr('y2', y(yhat))
        .attr('stroke', COLORS.mute).attr('stroke-dasharray', '2,2');
    });
    pts.forEach(p => svg.append('circle').attr('cx', x(p[0])).attr('cy', y(p[1])).attr('r', 5).attr('fill', COLORS.ink));

    const mx = pts.reduce((a,p)=>a+p[0],0) / pts.length;
    const my = pts.reduce((a,p)=>a+p[1],0) / pts.length;
    let num = 0, den = 0;
    for (const p of pts) { num += (p[0]-mx)*(p[1]-my); den += (p[0]-mx)**2; }
    const mOpt = num/den, bOpt = my - mOpt*mx;
    const ssRes = pts.reduce((a,p) => a + (p[1]-(m*p[0]+b))**2, 0);
    const ssOpt = pts.reduce((a,p) => a + (p[1]-(mOpt*p[0]+bOpt))**2, 0);
    setStats(stats, [
      { html: `y = ${m.toFixed(2)}x + ${b.toFixed(2)}` },
      { html: `SSR = ${ssRes.toFixed(1)} (${lang==='tr'?'opt':'opt'}: ${ssOpt.toFixed(1)})` },
      { html: `OLS: y = ${mOpt.toFixed(2)}x + ${bOpt.toFixed(2)}` },
    ]);
  }

  makeSlider(panel, { label: lang==='tr'?'Eğim (m)':'Slope (m)', min: -1, max: 2, value: m, onChange: v => { m=v; update(); } });
  makeSlider(panel, { label: lang==='tr'?'Kesişim (b)':'Intercept (b)', min: -5, max: 10, value: b, onChange: v => { b=v; update(); } });

  update();
  return { cleanup() { container.replaceChildren(); }, reset() { m=0.7; b=3; container.replaceChildren(); init(container, { lang }); } };
}
