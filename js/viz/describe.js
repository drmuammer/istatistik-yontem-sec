import { COLORS, makeSvg } from './_helpers.js';

export default function init(container, { lang, testId }) {
  container.replaceChildren();
  return testId === 'describe_discrete' ? discrete(container, lang) : continuous(container, lang);
}

function makeSection(container, title) {
  const wrap = document.createElement('div');
  wrap.style.cssText = 'display:grid;grid-template-columns:1fr 1fr;gap:24px;';
  container.append(wrap);
  return wrap;
}

function sectionTitle(parent, t) {
  const h = document.createElement('h5');
  h.style.cssText = 'font-family:var(--sans);font-size:11px;letter-spacing:1px;text-transform:uppercase;color:var(--ink-mute);margin-bottom:8px';
  h.textContent = t; parent.append(h);
}

function discrete(container, lang) {
  const wrap = makeSection(container);
  const left = document.createElement('div'); wrap.append(left);
  sectionTitle(left, lang==='tr'?'Çubuk grafik':'Bar chart');
  const svg1 = makeSvg(left, { width: 220, height: 180 });
  const data = [{k:'A',v:32},{k:'B',v:18},{k:'C',v:45},{k:'D',v:25}];
  const x = d3.scaleBand().domain(data.map(d=>d.k)).range([20,200]).padding(0.2);
  const y = d3.scaleLinear().domain([0,50]).range([160,20]);
  data.forEach(d => svg1.append('rect').attr('x', x(d.k)).attr('y', 160).attr('width', x.bandwidth()).attr('height', 0).attr('fill', COLORS.ink)
    .transition().duration(700).attr('y', y(d.v)).attr('height', 160 - y(d.v)));
  svg1.append('g').attr('transform', 'translate(0,160)').call(d3.axisBottom(x));

  const right = document.createElement('div'); wrap.append(right);
  sectionTitle(right, lang==='tr'?'Pasta grafik':'Pie chart');
  const svg2 = makeSvg(right, { width: 220, height: 180 });
  const arcs = d3.pie().value(d => d.v)(data);
  const arc = d3.arc().innerRadius(0).outerRadius(70);
  arcs.forEach((a, i) => svg2.append('path').attr('d', arc(a)).attr('transform', 'translate(110,90)').attr('fill', d3.interpolate(COLORS.accent, COLORS.ink)(i / arcs.length)).attr('stroke', '#fff'));

  return { cleanup() { container.replaceChildren(); }, reset() { container.replaceChildren(); init(container, { lang, testId: 'describe_discrete' }); } };
}

function continuous(container, lang) {
  const wrap = makeSection(container);
  const left = document.createElement('div'); wrap.append(left);
  sectionTitle(left, lang==='tr'?'Histogram':'Histogram');
  const svg1 = makeSvg(left, { width: 220, height: 180 });
  const sample = Array.from({length: 200}, () => d3.randomNormal(50, 12)());
  const bins = d3.bin().domain([10, 90]).thresholds(12)(sample);
  const x = d3.scaleLinear().domain([10, 90]).range([20, 200]);
  const y = d3.scaleLinear().domain([0, d3.max(bins, b => b.length)]).range([160, 20]);
  bins.forEach(b => svg1.append('rect').attr('x', x(b.x0)+1).attr('y', 160).attr('width', x(b.x1)-x(b.x0)-1).attr('height', 0).attr('fill', COLORS.ink)
    .transition().duration(700).attr('y', y(b.length)).attr('height', 160 - y(b.length)));
  svg1.append('g').attr('transform', 'translate(0,160)').call(d3.axisBottom(x).ticks(5));

  const right = document.createElement('div'); wrap.append(right);
  sectionTitle(right, lang==='tr'?'Boksör grafiği':'Boxplot');
  const svg2 = makeSvg(right, { width: 220, height: 180 });
  const sorted = sample.slice().sort((a,b)=>a-b);
  const q1 = d3.quantile(sorted, .25), med = d3.quantile(sorted, .5), q3 = d3.quantile(sorted, .75);
  const iqr = q3 - q1, lo = q1 - 1.5*iqr, hi = q3 + 1.5*iqr;
  const xb = d3.scaleLinear().domain([10, 90]).range([20, 200]);
  const yc = 90;
  svg2.append('line').attr('x1', xb(lo)).attr('x2', xb(hi)).attr('y1', yc).attr('y2', yc).attr('stroke', COLORS.ink);
  svg2.append('rect').attr('x', xb(q1)).attr('y', yc-30).attr('width', xb(q3)-xb(q1)).attr('height', 60).attr('fill', '#fff').attr('stroke', COLORS.ink);
  svg2.append('line').attr('x1', xb(med)).attr('x2', xb(med)).attr('y1', yc-30).attr('y2', yc+30).attr('stroke', COLORS.accent).attr('stroke-width', 2);
  svg2.append('g').attr('transform', 'translate(0,160)').call(d3.axisBottom(xb).ticks(5));

  return { cleanup() { container.replaceChildren(); }, reset() { container.replaceChildren(); init(container, { lang, testId: 'describe_continuous' }); } };
}
