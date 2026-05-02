import { COLORS, makeSvg, statBox, setStats } from './_helpers.js';

export default function init(container, { lang }) {
  const W = 460, H = 320;
  const svg = makeSvg(container, { width: W, height: H });
  let pts = Array.from({length: 8}, (_, i) => [i+1, Math.floor(1 + i*0.8 + (Math.random()-0.5)*3)]);
  const x = d3.scaleLinear().domain([0, 9]).range([50, W-30]);
  const y = d3.scaleLinear().domain([0, 10]).range([H-50, 30]);
  const stats = statBox(container);

  function spearmanRanks(arr) {
    const xs = arr.map(p => p[0]).slice().sort((a,b)=>a-b);
    const ys = arr.map(p => p[1]).slice().sort((a,b)=>a-b);
    const ranked = arr.map(p => [xs.indexOf(p[0])+1, ys.indexOf(p[1])+1]);
    const n = ranked.length;
    const mx = ranked.reduce((a,p)=>a+p[0],0)/n, my = ranked.reduce((a,p)=>a+p[1],0)/n;
    let num=0, dx2=0, dy2=0;
    for (const [a,b] of ranked) { num += (a-mx)*(b-my); dx2+=(a-mx)**2; dy2+=(b-my)**2; }
    return num / Math.sqrt(dx2*dy2);
  }

  function update() {
    svg.selectAll('*').remove();
    svg.append('g').attr('transform', `translate(0,${H-50})`).call(d3.axisBottom(x).ticks(8));
    svg.append('g').attr('transform', 'translate(50,0)').call(d3.axisLeft(y).ticks(5));
    let conc = 0, disc = 0;
    for (let i = 0; i < pts.length; i++) for (let j = i+1; j < pts.length; j++) {
      const dx = pts[j][0] - pts[i][0], dy = pts[j][1] - pts[i][1];
      const sign = Math.sign(dx) * Math.sign(dy);
      if (sign > 0) conc++; else if (sign < 0) disc++;
      svg.append('line')
        .attr('x1', x(pts[i][0])).attr('y1', y(pts[i][1])).attr('x2', x(pts[j][0])).attr('y2', y(pts[j][1]))
        .attr('stroke', sign > 0 ? COLORS.accent : (sign < 0 ? COLORS.groupA : COLORS.mute))
        .attr('stroke-width', 0.5).attr('opacity', 0.5);
    }
    pts.forEach((p, i) => {
      svg.append('circle').attr('cx', x(p[0])).attr('cy', y(p[1])).attr('r', 6).attr('fill', COLORS.ink).style('cursor', 'grab')
        .call(d3.drag()
          .on('drag', function(e) {
            pts[i] = [Math.max(0, Math.min(9, x.invert(e.x))), Math.max(0, Math.min(10, y.invert(e.y)))];
            update();
          }));
    });
    const total = pts.length * (pts.length - 1) / 2;
    const tau = (conc - disc) / total;
    setStats(stats, [
      { html: `${lang==='tr'?'Uyumlu':'Concordant'}: ${conc}` },
      { html: `${lang==='tr'?'Uyumsuz':'Discordant'}: ${disc}` },
      { html: `τ = ${tau.toFixed(3)}` },
      { html: `ρ = ${spearmanRanks(pts).toFixed(3)}` },
    ]);
  }

  update();
  return { cleanup() { container.replaceChildren(); }, reset() {
    pts = Array.from({length: 8}, (_, i) => [i+1, Math.floor(1 + i*0.8 + (Math.random()-0.5)*3)]);
    container.replaceChildren(); init(container, { lang });
  } };
}
