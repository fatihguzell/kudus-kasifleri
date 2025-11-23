# Android'de Kudüs Kaşifleri Uygulamasını Çalıştırma Rehberi

## Yöntem 1: Yerel Sunucu ile Test (Bilgisayar + Telefon Aynı WiFi'de)

### Adım 1: Yerel Sunucu Başlatın
Terminalden proje klasöründe:
```bash
cd "/Users/macbookair/Desktop/Kudüs Kaşifleri/Sayfalar"
python3 -m http.server 8000
```

### Adım 2: Bilgisayarınızın IP Adresini Bulun
```bash
ifconfig | grep "inet " | grep -v 127.0.0.1
```
Örnek çıktı: `inet 192.168.1.100`

### Adım 3: Android Telefondan Erişin
- Telefon ve bilgisayar aynı WiFi'de olmalı
- Telefon tarayıcısında: `http://192.168.1.100:8000`

---

## Yöntem 2: GitHub Pages (Ücretsiz Hosting)

### Adım 1: GitHub'a Yükleyin
```bash
cd "/Users/macbookair/Desktop/Kudüs Kaşifleri/Sayfalar"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/kudus-kasifleri.git
git push -u origin main
```

### Adım 2: GitHub Pages Aktif Edin
1. GitHub repository → Settings → Pages
2. Source: "main" branch seçin
3. Save
4. URL: `https://KULLANICI_ADINIZ.github.io/kudus-kasifleri`

---

## Yöntem 3: Android APK Oluşturma (Cordova/Capacitor)

### Cordova ile:
```bash
# Cordova kurulumu
npm install -g cordova

# Yeni Cordova projesi
cordova create KudusKasifleri com.hucurat.kuduskasifleri "Kudüs Kaşifleri"
cd KudusKasifleri

# Web dosyalarını kopyala
cp -r "/Users/macbookair/Desktop/Kudüs Kaşifleri/Sayfalar/"* www/

# Android platformu ekle
cordova platform add android

# APK oluştur
cordova build android

# APK yolu: platforms/android/app/build/outputs/apk/debug/app-debug.apk
```

---

## Yöntem 4: PWA (Progressive Web App) - Önerilen!

Projenize PWA desteği ekleyerek kullanıcılar uygulamayı "Ana Ekrana Ekle" ile yükleyebilir.

### manifest.json oluşturun:
```json
{
  "name": "Kudüs Kaşifleri",
  "short_name": "Kudüs",
  "description": "Mescid-i Aksa Bilgi Yarışması",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#29abe2",
  "theme_color": "#29abe2",
  "orientation": "portrait",
  "icons": [
    {
      "src": "assets/logo.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "assets/logo.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

### service-worker.js oluşturun:
```javascript
const CACHE_NAME = 'kudus-kasifleri-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/js/game.js',
  '/js/data.js',
  '/js/auth.js',
  '/js/admin.js',
  '/js/audio.js',
  '/assets/logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

### index.html'e ekleyin:
```html
<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#29abe2">
<meta name="mobile-web-app-capable" content="yes">
<script>
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }
</script>
```

---

## Önerilen Çözüm

**En pratik:** GitHub Pages + PWA
1. Projeyi GitHub'a yükleyin
2. GitHub Pages aktif edin
3. PWA dosyalarını ekleyin
4. Kullanıcılar tarayıcıdan açıp "Ana Ekrana Ekle" ile yükler

**Avantajları:**
- ✅ Ücretsiz
- ✅ Otomatik güncelleme
- ✅ Kurulum gerektirmez
- ✅ iOS ve Android'de çalışır
- ✅ Uygulama gibi görünür

---

## Mevcut Durum

Projeniz **zaten mobil uyumlu**:
- ✅ 9:16 aspect ratio
- ✅ Touch events destekli
- ✅ Responsive tasarım
- ✅ localStorage kullanıyor
- ✅ Offline çalışabilir (PWA ile)

Sadece bir hosting çözümü seçip yayınlamanız yeterli!
