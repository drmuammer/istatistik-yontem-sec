// XSS-güvenli template literal. Tüm interpolasyonları otomatik escape eder.
export function html(strings, ...values) {
  const escaped = strings.reduce((acc, s, i) =>
    acc + s + (values[i] === undefined ? '' : escapeHtml(values[i])), '');
  return document.createRange().createContextualFragment(escaped);
}
function escapeHtml(v) {
  return String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
