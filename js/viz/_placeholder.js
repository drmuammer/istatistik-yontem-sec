export default function init(container, { lang }) {
  container.replaceChildren();
  const p = document.createElement('p');
  p.style.cssText = 'text-align:center;color:var(--ink-mute);padding:3em';
  p.textContent = lang === 'tr' ? 'Demo yakında' : 'Demo coming soon';
  container.append(p);
  return { cleanup() {}, reset() {} };
}
