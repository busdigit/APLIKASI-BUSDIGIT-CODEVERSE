# 🚀 BUSDIGIT CODEVERSE — Private Coding Academy & Vibe Coding Studio

Platform akademi pembelajaran coding privat, LMS interaktif, Vibe Coding AI Studio, dan Project Lab portofolio berstandar industri dengan integrasi backend Google Apps Script dan database Cloud Firestore Spark Plan (100% Gratis).

---

## 🌟 Fitur Utama

- 📱 **Progressive Web App (PWA):** Dapat di-install langsung di HP Android, iPhone/iPad, dan Desktop PC/Mac tanpa toko aplikasi.
- ⚡ **Cloud Firestore Hybrid Engine:** Metode fetching REST API instan untuk banner promosi 16:9, playlist musik, katalog LMS, dan dokumentasi.
- 🤖 **Vibe Coding AI Studio:** Studio coding cerdas bertenaga Google Gemini AI dengan mode simulasi instan.
- 🎓 **LMS & Showcase Interaktif:** Kurikulum bertahap, status sertifikasi resmi, dan showcase proyek member.
- 🛡️ **Panel Keamanan Super Admin:** Pengaturan konfigurasi, proteksi PIN admin, dan migrasi 1-klik dari Google Sheets ke Firestore.
- 🎨 **Santriverse Dynamic Floating Dock:** Navigasi 5 tombol modern dengan indikator status *live* dan jam waktu nyata.

---

## 📂 Struktur File

```text
├── Index.html           # Single Page Application utama + UI PWA + CSS + Client Logic
├── Code.gs              # Backend Google Apps Script (V8 Runtime) + Firestore UrlFetchApp REST
├── appsscript.json      # Manifest proyek Apps Script dengan OAuth Scopes resmi
├── manifest.json        # Web App Manifest PWA (Nama, Ikon, Warna Tema, Shortcuts)
├── sw.js                # Service Worker PWA (Offline Caching & App Shell)
├── icons/               # Ikon aplikasi resolusi tinggi PWA (SVG, 192x192, 512x512)
├── auto-push.bat        # Script 1-klik untuk validasi & push otomatis ke GitHub
└── .gitignore           # File filter Git untuk menjaga repositori tetap bersih
```

---

## 🚀 Cara Menjalankan & Mengembangkan

### 1. Menjalankan di Browser / Hosting Lokal
Cukup buka file `Index.html` di browser modern (Chrome, Edge, Safari, Firefox).

### 2. Auto-Push ke GitHub (Tanpa Copas)
Cukup **klik 2x file `auto-push.bat`**. Script akan:
1. Menjalankan pengujian sintaksis otomatis.
2. Melakukan `git add` dan `git commit`.
3. Melakukan `git push` langsung ke repositori GitHub.

### 3. Deploy ke GitHub Pages (Hosting Gratis)
1. Buka Repositori GitHub Anda > **Settings** > **Pages**.
2. Pada bagian **Build and deployment > Branch**, pilih **`main`** > folder **`/(root)`**.
3. Klik **Save**. Dalam hitungan detik website akan aktif di `https://<username>.github.io/busdigit-codeverse/`!

---

## 📄 Lisensi & Hak Cipta
Hak Cipta © 2026 BUSDIGIT CODEVERSE. Seluruh hak dilindungi.
