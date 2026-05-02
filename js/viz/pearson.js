import { COLORS, makeSvg, statBox, setStats } from './_helpers.js';

export default function init(container, { lang }) {
  const W = 460, H = 360;
  const svg = makeSvg(container, { width: W, height: H });
  let pts = Array.from({length: 14}, (_, i) => { const t = i / 13; return [2 + t * 16, 4 + t * 12 + (Math.random() - 0.5) * 3]; });
  const x = d3.scaleLinear().domain([0, 20]).range([40, W - 20]);
  const y = d3.scaleLinear().domain([0, 22]).range([H - 60, 30]);
  const stats = statBox(container);

  function pearson(arr) {
    const n = arr.length;
    const mx = arr.reduce((a, p) => a + p[0], 0) / n;
    const my = arr.reduce((a, p) => a + p[1], 0) / n;
    let num = 0, dx2 = 0, dy2 = 0;
    for (const [a, b] of arr) { num += (a-mx) * (b-my); dx2 += (a-mx)**2; dy2 += (b-my)**2; }
    return num / Math.sqrt(dx2 * dy2);
  }
  function spearman(arr) {
    const xs = arr.map(p => p[0]).slice().sort((a,b) => a-b);
    const ys = arr.map(p => p[1]).slice().sort((a,b) => a-b);
    return pearson(arr.map(p => [xs.indexOf(p[0])+1, ys.indexOf(p[1])+1]));
  }

  function update() {
    svg.selectAll('*').remove();
    svg.append('g').attr('transform', `translate(0,${H - 60})`).call(d3.axisBottom(x).ticks(5));
    svg.append('g').attr('transform', 'translate(40,0)').call(d3.axisLeft(y).ticks(5));
    pts.forEach((p, i) => {
      svg.append('circle').attr('cx', x(p[0])).attr('cy', y(p[1])).attr('r', 6).attr('fill', COLORS.ink)
        .style('cursor', 'grab')
        .call(d3.drag()
          .on('drag', function(e) {
            pts[i] = [Math.max(0, Math.min(20, x.invert(e.x))), Math.max(0, Math.min(22, y.invert(e.y)))];
            d3.select(this).attr('cx', x(pts[i][0])).attr('cy', y(pts[i][1]));
            recompute();
          })
          .on('end', () => update())
        );
    });
    recompute();
  }
  function recompute() {
    const r = pearson(pts), rho = spearman(pts);
    setStats(stats, [
      { html: `Pearson r = ${r.toFixed(3)}`, color: Math.abs(r) > 0.7 ? COLORS.accent : COLORS.ink },
      { html: `Spearman ρ = ${rho.toFixed(3)}` },
      { html: lang==='tr'?'Noktaları sürükleyin':'Drag points' },
    ]);
  }

  update();
  return { cleanup() { container.replaceChildren(); }, reset() {
    pts = Array.from({length: 14}, (_, i) => { const t = i/13; return [2 + t*16, 4 + t*12 + (Math.random()-0.5)*3]; });
    container.replaceChildren(); init(container, { lang });
  } };
}
