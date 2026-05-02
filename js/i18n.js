export function createI18n(strings, initialLang = 'tr') {
  let lang = initialLang;
  const subs = new Set();

  function fill(s, vars) {
    if (!vars) return s;
    return s.replace(/\{(\w+)\}/g, (_, k) => vars[k] !== undefined ? String(vars[k]) : `{${k}}`);
  }

  return {
    getLang: () => lang,
    setLang(n) { if (n !== 'tr' && n !== 'en') return; lang = n; for (const cb of subs) cb(lang); },
    t(key, vars) {
      const e = strings[key];
      if (!e) { console.warn(`[i18n] eksik: ${key}`); return key; }
      let s = e[lang];
      if (s === undefined) {
        const f = lang === 'tr' ? 'en' : 'tr';
        s = e[f];
        if (s === undefined) return key;
      }
      return fill(s, vars);
    },
    pick(loc, vars) {
      if (!loc) return '';
      const s = loc[lang] ?? loc[lang === 'tr' ? 'en' : 'tr'] ?? '';
      return fill(s, vars);
    },
    subscribe(cb) { subs.add(cb); return () => subs.delete(cb); },
  };
}
