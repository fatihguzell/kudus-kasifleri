# Kudüs Kaşifleri 🕌

Mescid-i Aksa hakkında eğlenceli ve öğretici bir bilgi yarışması oyunu.

## 🎮 Özellikler

- ✅ 10 farklı rütbe sistemi
- ✅ Rozet kazanma sistemi
- ✅ Seviye bazlı sorular
- ✅ İlerleme takibi
- ✅ Admin paneli
- ✅ Mobil uyumlu (9:16 format)
- ✅ PWA desteği (Ana ekrana eklenebilir)
- ✅ Offline çalışma
- ✅ Ses efektleri

## 🚀 Canlı Demo

[Oyunu Oyna](https://KULLANICI_ADINIZ.github.io/kudus-kasifleri/)

## 📱 Kurulum

### Web Tarayıcıda
Yukarıdaki linke tıklayın ve oyunu tarayıcınızda oynayın.

### Mobil Cihazlarda (PWA)
1. Yukarıdaki linki mobil tarayıcınızda açın
2. Menü → "Ana ekrana ekle"
3. Uygulama gibi kullanın!

## 🛠️ Yerel Geliştirme

```bash
# Projeyi klonlayın
git clone https://github.com/KULLANICI_ADINIZ/kudus-kasifleri.git
cd kudus-kasifleri

# Yerel sunucu başlatın
python3 -m http.server 8000

# Tarayıcıda açın
# http://localhost:8000
```

## 📂 Proje Yapısı

```
kudus-kasifleri/
├── index.html              # Ana sayfa
├── manifest.json           # PWA manifest
├── service-worker.js       # Offline destek
├── css/
│   └── style.css          # Tüm stiller
├── js/
│   ├── app.js             # Ana uygulama
│   ├── auth.js            # Kimlik doğrulama
│   ├── game.js            # Oyun mantığı
│   ├── data.js            # Veri yönetimi
│   ├── admin.js           # Admin paneli
│   └── audio.js           # Ses efektleri
└── assets/
    ├── logo.png
    ├── karakter-ifadeleri/  # Maskot görselleri
    └── rozetler/            # Rozet görselleri
```

## 🎯 Nasıl Oynanır?

1. **Kayıt Ol / Giriş Yap**: İlk kullanımda kayıt olun
2. **Oyuna Başla**: Ana ekrandan "Oyuna Başla" butonuna tıklayın
3. **Soruları Cevapla**: Her doğru cevap 10 puan kazandırır
4. **Rütbe Kazan**: Puanınız arttıkça rütbeniz yükselir
5. **Rozet Topla**: Başarılarınızı rozetlerle ödüllendirin

## 🏆 Rütbe Sistemi

1. Acemi Kaşif (0-100 puan)
2. Mescid Kuşu (100-200 puan)
3. Gazze Savunucusu (200-300 puan)
4. Kudüs Sevdalısı (300-400 puan)
5. Acemi Muhafız (400-500 puan)
6. Miraç Yolcusu (500-600 puan)
7. Aksa Bilgini (600-700 puan)
8. Aksa Muhafızı (700-800 puan)
9. Kudüs Mihmandarı (800-900 puan)
10. Küçük Selahaddin (900+ puan)

## 👨‍💼 Admin Paneli

Admin kullanıcısı (username: `admin`, password: `admin123`) ile giriş yaparak:
- Soru ekle/düzenle/sil
- Kullanıcıları yönet
- Rozetleri düzenle
- Rütbeleri yönet
- Mesaj gönder
- Oyun süresini ayarla

## 🔧 Teknolojiler

- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Veri Depolama**: LocalStorage
- **Ses**: Web Audio API
- **PWA**: Service Worker, Manifest
- **Responsive**: Mobile-first tasarım

## 📄 Lisans

Bu proje [Hucurat Hareketi Derneği](https://hucurathareketi.com/) tarafından hazırlanmıştır.

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add some amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📞 İletişim

Hucurat Hareketi Derneği - [https://hucurathareketi.com/](https://hucurathareketi.com/)

---

**Not**: Bu oyun eğitim amaçlıdır ve Mescid-i Aksa hakkında farkındalık oluşturmayı hedefler.
