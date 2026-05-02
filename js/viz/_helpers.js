export const COLORS = {
  ink: '#1c1917', mute: '#a8a29e', accent: '#b45309', accentSoft: '#fef3c7',
  groupA: '#1c1917', groupB: '#b45309', groupC: '#0c4a6e',
};

export function bellPoints(mu, sigma, [xMin, xMax], steps = 80) {
  const out = [];
  for (let i = 0; i <= steps; i++) {
    const x = xMin + (xMax - xMin) * (i / steps);
    const z = (x - mu) / sigma;
    out.push([x, (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * z * z)]);
  }
  return out;
}

export function makeSvg(container, { width = 460, height = 320 } = {}) {
  container.replaceChildren();
  return d3.select(container).append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('width', '100%').attr('height', 'auto')
    .style('background', '#fff');
}

export function makeSlider(host, { label, min, max, step = 0.1, value, onChange }) {
  const wrap = document.createElement('label');
  wrap.style.cssText = 'display:flex;align-items:center;gap:8px;font-size:13px;font-family:var(--sans);margin:6px 0;';
  const lbl = document.createElement('span'); lbl.style.minWidth = '90px'; lbl.textContent = label; wrap.append(lbl);
  const input = document.createElement('input');
  input.type = 'range'; input.min = min; input.max = max; input.step = step; input.value = value; input.style.flex = '1';
  const display = document.createElement('span'); display.style.minWidth = '40px'; display.textContent = Number(value).toFixed(1);
  input.addEventListener('input', () => { display.textContent = Number(input.value).toFixed(1); onChange(Number(input.value)); });
  wrap.append(input, display); host.append(wrap);
  return { setValue(v) { input.value = v; display.textContent = Number(v).toFixed(1); } };
}

export function controlPanel(container) {
  const div = document.createElement('div');
  div.style.cssText = 'background:#fafaf9;padding:12px;border-radius:2px;margin-top:12px;';
  container.append(div); return div;
}

export function statBox(container) {
  const div = document.createElement('div');
  div.style.cssText = 'font-family:var(--mono);font-size:13px;display:flex;flex-wrap:wrap;gap:24px;margin-top:8px;';
  container.append(div); return div;
}

export function setStats(box, items) {
  box.replaceChildren();
  items.forEach(({ html: text, color }) => {
    const div = document.createElement('div');
    if (color) div.style.color = color;
    div.textContent = text;
    box.append(div);
  });
}
