# 🔥 Firebase (Online Veritabanı) Kurulum Rehberi

Oyununuzun tüm cihazlarda senkronize çalışması (Online olması) için Google Firebase kullanacağız. Bu işlem tamamen **ÜCRETSİZDİR**.

Lütfen aşağıdaki adımları sırasıyla uygulayın:

## Adım 1: Firebase Projesi Oluşturun

1. [console.firebase.google.com](https://console.firebase.google.com/) adresine gidin ve Google hesabınızla giriş yapın.
2. **"Proje Ekle"** (Add Project) butonuna tıklayın.
3. Proje adı olarak `kudus-kasifleri` yazın ve Devam'a tıklayın.
4. Google Analytics'i kapatabilirsiniz (isteğe bağlı), ardından **"Proje Oluştur"** deyin.
5. Projeniz hazır olduğunda **"Devam"** butonuna tıklayın.

## Adım 2: Web Uygulaması Ekleyin

1. Proje ana sayfasında, üstteki yuvarlak ikonlardan **Web** (</> simgesi) olanına tıklayın.
2. Uygulama takma adı olarak `Kudüs Kaşifleri` yazın.
3. "Firebase Hosting" kutucuğunu **İŞARETLEMEYİN**.
4. **"Uygulamayı Kaydet"** (Register app) butonuna tıklayın.
5. Ekrana gelen kodlar içinde `firebaseConfig` kısmını göreceksiniz. Bu sayfayı açık tutun, birazdan lazım olacak.

## Adım 3: Veritabanını (Realtime Database) Oluşturun

1. Sol menüden **"Build"** -> **"Realtime Database"** seçeneğine tıklayın.
2. **"Veritabanı Oluştur"** (Create Database) butonuna tıklayın.
3. Konum olarak "Belgium (europe-west1)" veya "United States" seçebilirsiniz. İleri deyin.
4. **Güvenlik Kuralları** adımında **"Test modunda başlat"** (Start in test mode) seçeneğini seçin.
   - *Not: Bu mod herkesin okuma/yazma yapmasına izin verir. Geliştirme için uygundur.*
5. **"Etkinleştir"** (Enable) butonuna tıklayın.

## Adım 4: Projenize Bağlayın

1. Bilgisayarınızda `js/firebase-config.js` dosyasını açın (birazdan oluşturulacak).
2. Firebase konsolunda (Adım 2'de açık bıraktığınız sayfa) `const firebaseConfig = { ... }` kısmını kopyalayın.
3. `js/firebase-config.js` dosyasındaki ilgili yere yapıştırın.

Örnek `js/firebase-config.js` içeriği şöyle olmalı:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyD...",
  authDomain: "kudus-kasifleri.firebaseapp.com",
  databaseURL: "https://kudus-kasifleri-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "kudus-kasifleri",
  storageBucket: "kudus-kasifleri.appspot.com",
  messagingSenderId: "123456...",
  appId: "1:123456..."
};
```

## Adım 5: Değişiklikleri Yayınlayın

Tüm ayarları yaptıktan sonra terminalden şu komutları çalıştırarak sitenizi güncelleyin:

```bash
git add .
git commit -m "Firebase entegrasyonu eklendi"
git push
```

Artık oyununuz **ONLINE**! 🎉
- Telefondan girdiğiniz veriler bilgisayarda görünür.
- Admin panelinden soru eklerseniz herkes anında görür.
