export function initHeroAnim(container) {
  if (!container) return;
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const w = container.clientWidth || 800, h = 240;
  container.replaceChildren();
  const svg = d3.select(container).append('svg').attr('viewBox', `0 0 ${w} ${h}`).attr('width', '100%').attr('height', h);
  const path = svg.append('path').attr('fill', 'none').attr('stroke', 'var(--ink)').attr('stroke-width', 1.2).attr('opacity', 0.25);

  function bell(mu, sigma) {
    const xs = d3.range(0, w, 4);
    return xs.map(x => {
      const z = (x - mu) / sigma;
      const y = Math.exp(-0.5 * z * z) * 80;
      return [x, h - 30 - y];
    });
  }

  let t = 0, raf = 0;
  function tick() {
    t += 0.005;
    const mu = w / 2 + Math.sin(t) * w * 0.18;
    const sigma = 70 + Math.sin(t * 0.6) * 30;
    path.attr('d', d3.line()(bell(mu, sigma)));
    raf = requestAnimationFrame(tick);
  }
  raf = requestAnimationFrame(tick);
  return () => cancelAnimationFrame(raf);
}
