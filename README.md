# 📊 İstatistiksel Yöntem Seçimi

### *Tıbbi araştırmalarda doğru istatistik testini bulmak için interaktif rehber*

[![Site](https://img.shields.io/badge/Site-drmuammer.github.io%2Fistatistik--yontem--sec-B45309?style=for-the-badge)](https://drmuammer.github.io/istatistik-yontem-sec/)
[![License](https://img.shields.io/badge/License-CC_BY_4.0-lightgrey.svg?style=flat-square)](https://creativecommons.org/licenses/by/4.0/)
[![Status](https://img.shields.io/badge/Status-Aktif-success?style=flat-square)](https://drmuammer.github.io/istatistik-yontem-sec/)
[![Lang](https://img.shields.io/badge/Dil-TR%20%2F%20EN-orange?style=flat-square)](https://drmuammer.github.io/istatistik-yontem-sec/)
[![Built with Quarto](https://img.shields.io/badge/Built_with-Quarto-blue?style=flat-square)](https://quarto.org/)

---

## Bu Site Ne İşe Yarar?

Bir araştırmacının önündeki en sık kararlardan biri şudur: *"Verim için hangi istatistik testi uygun?"* Doğru cevap, **veri tipine, grup sayısına, dağılım varsayımlarına ve karşılaştırma türüne** bağlıdır. Bu site bu kararı **birkaç sade soruyla** yanıtlamanı sağlar — ardından önerilen testi sadece adıyla bırakmaz, **nasıl çalıştığını canlı bir demoyla** göstererek sezgi kazandırır.

Hedef kitle: tıp, sağlık bilimleri, biyoistatistik öğrencileri ve araştırmacılar. Lisanslı bir biyoistatistikçinin yerini tutmaz, ancak **hangi yönde düşünmeleri gerektiği** konusunda hızlı bir kılavuz sunar.

## 🧭 Nasıl Çalışır?

Site üç bileşenden oluşur, hepsi tek sayfada:

**1. Sihirbaz** — Veri tipinden başlar (sürekli mi kategorik mi?), grup yapısını sorar (bağımlı mı bağımsız?), normal dağılım varsayımını kontrol eder. Her adımda kısa bir ipucu ile birlikte 2–3 seçenek sunulur.

**2. Karar Haritası** — Tüm karar ağacı tek bakışta görünür. Sihirbazda ilerledikçe ilgili dal canlı olarak vurgulanır, kullanıcı haritadan istediği yere doğrudan tıklayabilir. Karar zincirinin tamamı açıkta — kara kutu yok.

**3. İnteraktif Demolar** — Önerilen test sayfasında D3.js tabanlı bir mini simülasyon vardır. Veri noktalarını sürükleyebilir, parametreleri değiştirebilir, test istatistiğinin nasıl tepki verdiğini canlı izleyebilirsiniz. Her test için R, Python ve SPSS kod örnekleri de sayfada hazır.

Tüm içerik **Türkçe ve İngilizce** olarak iki dilde mevcuttur — sağ üstteki TR/EN düğmesinden anlık geçilir.

## 📚 Kapsanan Testler

**İki grup karşılaştırma**
- Student t testi (parametrik, bağımsız)
- Bağımlı (eşli) t testi (parametrik, bağımlı)
- Mann-Whitney U testi (non-parametrik, bağımsız)
- Wilcoxon işaretli sıra testi / İşaret testi (non-parametrik, bağımlı)

**Üç ve daha fazla grup karşılaştırma**
- Tek yönlü ANOVA (parametrik, bağımsız)
- Tekrarlı ölçümlerde ANOVA (parametrik, bağımlı)
- Kruskal-Wallis testi (non-parametrik, bağımsız)
- Friedman testi (non-parametrik, bağımlı)

**Kategorik veri**
- Ki-kare testi (2×2) ve Fisher'ın kesin testi
- Ki-kare testi (n×m)
- McNemar testi (eşli kategorik)

**İlişki ve korelasyon**
- Pearson korelasyon analizi (parametrik)
- Kendall tau-b ve Spearman korelasyonu (non-parametrik)
- Regresyon analizi

**Tanımlayıcı**
- Tablolar ve çubuk/pasta grafikler (kesikli veri)
- Tanımlayıcı istatistikler ve histogramlar (sürekli veri)

## 🌐 Online Olarak

Doğrudan tarayıcıda açın, hiçbir kurulum gerekmez:

**<https://drmuammer.github.io/istatistik-yontem-sec/>**

Mobil uyumlu — telefon ve tabletten de çalışır. Karar haritası mobilde açılır pencere olarak görüntülenir.

## 🎓 Atıf

İçerik, Dr. Cengizhan Açıkel ve Dr. Selim Kılıç tarafından hazırlanan *"Tıbbi Araştırmalarda İstatistiksel Yöntem Seçimi"* akış şemasından uyarlanmıştır.

## 📖 Kaynaklar

1. Sümbüloğlu K., Sümbüloğlu V. — *Biyoistatistik*, 4. Baskı, Özdemir Yayıncılık, Ankara, 1993.
2. Akgül A. — *Tıbbi Araştırmalarda İstatistiksel Analiz Teknikleri*, 2. Baskı, Emek Ofset, Ankara, 2003.
3. Dawson B., Trapp R. — *Basic and Clinical Biostatistics*, 3rd ed., Singapore, 2001.

## 🤝 Katkı

Hata, yanlış öneri, eksik test ya da geliştirme öneriniz varsa [Issue](https://github.com/drmuammer/istatistik-yontem-sec/issues) açın veya [Pull Request](https://github.com/drmuammer/istatistik-yontem-sec/pulls) gönderin. Yeni testlerin eklenmesi `data/tree.json` ve `data/tests.json` dosyalarını düzenlemekle mümkündür.

## 📜 Lisans

Tüm içerik [**CC BY 4.0**](https://creativecommons.org/licenses/by/4.0/) altında paylaşılmaktadır — atıf vererek serbestçe kullanabilir, paylaşabilir ve uyarlayabilirsiniz.

**Önerilen atıf:**

> Beslen, M. (2026). *İstatistiksel Yöntem Seçimi: Tıbbi araştırmalarda interaktif test seçim rehberi*. <https://drmuammer.github.io/istatistik-yontem-sec/>

## 📫 İletişim

🌐 [muammerbeslen.com](https://muammerbeslen.com)  
🔐 [Veri Güvenliği Rehberi](https://drmuammer.github.io/veri-seti-guvenligi/)  
📚 [Diğer notlar](https://github.com/drmuammer/notes)

---

*"Yanlış soruya doğru cevap aramaktan kötüsü, doğru soruya yanlış testle cevap vermektir."*
