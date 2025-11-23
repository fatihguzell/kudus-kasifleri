# GitHub'a Yükleme Rehberi

## ✅ Hazırlık Tamamlandı!

Git repository başarıyla oluşturuldu ve ilk commit yapıldı.

## 📤 GitHub'a Yükleme Adımları

### 1. GitHub'da Yeni Repository Oluşturun

1. [GitHub.com](https://github.com) adresine gidin
2. Sağ üstteki **+** → **New repository** tıklayın
3. Repository bilgilerini doldurun:
   - **Repository name**: `kudus-kasifleri`
   - **Description**: "Mescid-i Aksa Bilgi Yarışması - Eğitici Oyun"
   - **Public** seçin (herkes erişebilsin)
   - ❌ "Add a README file" işaretlemeyin (zaten var)
   - ❌ "Add .gitignore" işaretlemeyin (zaten var)
4. **Create repository** tıklayın

### 2. Terminalden GitHub'a Yükleyin

GitHub'da oluşturduğunuz repository sayfasında gösterilen komutları kullanın:

```bash
cd "/Users/macbookair/Desktop/Kudüs Kaşifleri/Sayfalar"

# GitHub repository'nizi ekleyin (KULLANICI_ADINIZ'ı değiştirin!)
git remote add origin https://github.com/KULLANICI_ADINIZ/kudus-kasifleri.git

# Ana branch'i main olarak ayarlayın
git branch -M main

# GitHub'a yükleyin
git push -u origin main
```

**Not**: İlk push'ta GitHub kullanıcı adı ve şifreniz (veya personal access token) istenecek.

### 3. GitHub Pages'i Aktif Edin

1. GitHub repository sayfanızda **Settings** sekmesine gidin
2. Sol menüden **Pages** seçin
3. **Source** bölümünde:
   - Branch: **main** seçin
   - Folder: **/ (root)** seçin
4. **Save** tıklayın
5. Birkaç dakika bekleyin

✅ Siteniz hazır: `https://KULLANICI_ADINIZ.github.io/kudus-kasifleri/`

## 📱 PWA Olarak Kullanım

Kullanıcılar artık:
1. Yukarıdaki linki mobil tarayıcıda açabilir
2. Menü → "Ana ekrana ekle" diyebilir
3. Uygulamayı telefonda uygulama gibi kullanabilir!

## 🔄 Güncelleme Yapmak İçin

Projeyi değiştirdikten sonra:

```bash
cd "/Users/macbookair/Desktop/Kudüs Kaşifleri/Sayfalar"

# Değişiklikleri ekle
git add .

# Commit yap
git commit -m "Açıklama buraya"

# GitHub'a gönder
git push
```

GitHub Pages otomatik olarak güncellenecek!

## 🎯 Sonraki Adımlar

1. ✅ Git repository oluşturuldu
2. ⏳ GitHub'da repository oluşturun
3. ⏳ `git remote add` komutunu çalıştırın
4. ⏳ `git push` ile yükleyin
5. ⏳ GitHub Pages'i aktif edin
6. ✅ Oyununuz yayında!

## 🆘 Sorun mu Yaşıyorsunuz?

### "Permission denied" hatası
GitHub Personal Access Token oluşturun:
1. GitHub → Settings → Developer settings → Personal access tokens
2. "Generate new token" → "repo" yetkisi verin
3. Token'ı şifre yerine kullanın

### "Repository not found" hatası
- Repository adını doğru yazdığınızdan emin olun
- `git remote -v` ile remote URL'i kontrol edin

---

**Hazır!** Artık projeniz GitHub'da ve dünya çapında erişilebilir! 🌍
