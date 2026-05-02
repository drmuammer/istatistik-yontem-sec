# İstatistiksel Yöntem Seçimi

Tıbbi araştırmalarda istatistiksel yöntem seçimi için interaktif, çift dilli (TR/EN) bir rehber. Sihirbaz adımlarıyla soruları yanıtlayın, karar haritasını canlı vurgularla izleyin, her testin nasıl çalıştığını sürüklenebilir D3 demolarıyla keşfedin.

Bu sürüm [Quarto](https://quarto.org) ile derlenir; iskelet Quarto'dur, içerik (D3 demoları, sihirbaz, ağaç, i18n) tamamen mevcut JavaScript modülleriyle çalışır.

## Yerelde çalıştırma

Quarto'yu kurun: <https://quarto.org/docs/get-started/>

```bash
# Canlı önizleme (dosyalar değişince otomatik yenilenir)
quarto preview

# Sadece statik build üret
quarto render
# çıktı: _site/
```

Quarto kurmadan, mevcut yapıyı statik dosya olarak da test edebilirsiniz — `js/`, `styles/`, `data/` klasörleri orijinal halinde duruyor:

```bash
quarto render
cd _site && python3 -m http.server 8000
```

## Geliştirme testleri

```bash
node tests/state.test.mjs
node tests/i18n.test.mjs
node tests/tree.test.mjs
node tests/tests-content.test.mjs
node tests/strings.test.mjs
```

İçerik bütünlük kontrolü: tarayıcıda `tools/check.html`.
UI smoke: tarayıcıda `tools/uitests.html`.

## Yayın (GitHub Pages)

İki seçenek var, **birini** seçin:

### Seçenek 1 — Otomatik (GitHub Actions, önerilen)

Repo'da `.github/workflows/publish.yml` dosyası mevcut. `main` branch'e her push'ta sayfa yeniden derlenir ve `gh-pages` branch'ine deploy edilir.

İlk kurulum:

1. Repo → **Settings → Pages**
2. **Source**: `Deploy from a branch`
3. **Branch**: `gh-pages` / `(root)`
4. Save

Sonra `main`'e push edin, ~1 dk sonra canlı.

### Seçenek 2 — Manuel publish

Yerelde Quarto kurulu ise:

```bash
quarto publish gh-pages
```

Komut `gh-pages` branch'ine push eder. Pages ayarı yine `gh-pages` / root olmalı.

## Mimari

- **Kabuk**: Quarto (`_quarto.yml`, `index.qmd`)
- **Body**: `index.qmd` içinde ham HTML bloğu — orijinal SPA yapısı (header, hero, explorer, result, footer) korunmuş
- **JS**: `js/app.js` ES modül entry; `js/i18n.js`, `js/state.js`, `js/wizard.js`, `js/tree.js`, `js/result.js`, `js/heroAnim.js`, `js/viz/*.js`'i import eder
- **D3**: `lib/d3.v7.min.js` global olarak yüklü (orijinal yapı korundu)
- **Stiller**: `styles/main.css`, `wizard.css`, `tree.css`, `result.css` + Quarto wrapper'larını nötralize eden `quarto-overrides.css`
- **Veri**: `data/tree.json`, `data/strings.json`, `data/tests.json` — `app.js` runtime'da fetch eder
- **i18n**: `[data-i18n]` attribute'leri + `js/i18n.js`; header'daki `#lang-toggle` butonu dili değiştirir

## Atıf

İçerik, Dr. Cengizhan Açıkel ve Dr. Selim Kılıç tarafından hazırlanan
"Tıbbi Araştırmalarda İstatistiksel Yöntem Seçimi" akış şemasından uyarlanmıştır.

## Kaynaklar

1. Sümbüloğlu K., Sümbüloğlu V.; Biyoistatistik 4. Baskı, Özdemir Yayıncılık, Ankara, 1993.
2. Akgül A.; Tıbbi Araştırmalarda İstatistiksel Analiz Teknikleri 2. Baskı, Emek Ofset, Ankara, 2003.
3. Dawson B., Trapp R.; Basic and Clinical Biostatistics, 3rd edition, Singapore, 2001.

## Lisans

[CC BY 4.0](LICENSE)
