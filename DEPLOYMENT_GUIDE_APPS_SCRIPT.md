# Panduan Deployment: BUSDIGIT CODEVERSE di Google Apps Script (GAS)

Dokumen ini berisi panduan lengkap untuk men-deploy aplikasi web **BUSDIGIT CODEVERSE** ke **Google Apps Script** sebagai Web App modern berkinerja tinggi, gratis, dan dapat diakses oleh semua kalangan (*Desktop & Mobile Friendly*).

---

## 🎨 Fitur Utama Antarmuka Terbaru (v2.8 — Member Area Launchpad Grid & Clean Google Login)

1. **📱 Member Area Launchpad Grid (14 Shortcut Squircle Cards Sesuai Gambar 2)**:
   - Header minimalis: `MENU UTAMA & SHORTCUT`.
   - Tata letak **4 kolom di mobile** persis seperti tampilan aplikasi native.
   - 14 kartu squircle dengan ikon SVG presisi dan wadah aksen warna:
     - *📦 Produk Saya (POS & Katalog)*
     - *📖 LMS Kelas (Kurikulum)*
     - *📚 Library Docs (Dokumentasi)*
     - *🎁 Aset Eksklusif (React Bits UI)*
     - *⚙️ Tools Area (Vibe AI Studio)*
     - *🗳️ Polling Ide Proyek (Capstone Ideas)*
     - *📁 Koleksi Saya (Saved Codes)*
     - *🖼️ Karya Saya (Showcase Portofolio)*
     - *🏆 Papan Peringkat (Leaderboard)*
     - *⏱️ Status Review (Private Mentoring)*
     - *🎖️ Sertifikat (Sertifikasi Digital)*
     - *👤 Profil Kreator (Data Profil & Role)*
     - *⚙️ Pengaturan Akun (Google Auth Settings)*
     - *🛟 Bantuan CS (Support & WhatsApp)*
   - Responsif, efek hover lift-up, dan active tap feedback.
2. **🔐 Autentikasi Google Bersih & Profesional (Tanpa Akun Dummy)**:
   - Menghapus 3 akun preset statis dari form login.
   - **Deteksi otomatis akun Google browser** (`Session.getActiveUser().getEmail()`) dengan tombol satu-klik **"Masuk dengan Akun Browser Ini ⚡"**.
   - Opsi input akun Google sendiri (Email, Nama, Role) serta akses langsung ke Mode Tamu.
3. **👥 Dashboard Spesifik & Terpisah untuk Setiap Role**:
   - **👨‍🎓 Siswa**: Akses belajar LMS, Capstone POS, Vibe Coding Studio, Portofolio & Sertifikat.
   - **🧑‍🏫 Mentor**: Dashboard mentor dengan KPI evaluasi, antrean penilaian tugas siswa dengan input skor langsung ke Google Sheets.
   - **🛡️ Super Admin**: Master Control Center dengan audit transaksi POS ritel real-time dan analitik platform.
   - **🌐 Mode Tamu**: Landing page publik interaktif.
4. **🛡️ 100% Bebas SyntaxError di Google Apps Script**:
   - Seluruh kode aman dari galat parsing V8 dan kompatibel dengan Google Apps Script Web App.

---

## 📁 Struktur File Proyek

| Nama File | Peran | Keterangan |
| :--- | :--- | :--- |
| `Code.gs` | **Backend (Server Script)** | Terhubung ke Spreadsheet ID `1NHtCvYOMGe4wla0aSAwoEMygaSOkQc3KrgU0Luo7C3c`, membaca & menulis sheet `config` untuk logo, promo, dan musik (CRUD API). |
| `Index.html` | **Frontend (Client Web App)** | Memuat antarmuka responsif lengkap (HTML5, CSS Dual Mode, Carousel Slider Dinamis, Audio Player, Modal CRUD Media & Config, dan Live Code Sandbox). Bebas SyntaxError untuk GAS. |
| `appsscript.json` | **Manifest Konfigurasi** | Runtime V8, zona waktu Jakarta (`Asia/Jakarta`), dan hak akses publik (*Anyone*). |

---

## 🚀 Langkah Memperbarui Kode di Google Apps Script (WAJIB KEDUANYA)

> [!IMPORTANT]
> **PENTING: Salin ulang `Index.html` DAN `Code.gs` ke editor Google Apps Script!**
> Perbaikan v2.4 mengatasi galat `SyntaxError: Invalid or unexpected token` agar semua fitur navigasi dan tombol tidak macet lagi.

1. **Buka Proyek Anda:**
   - Kunjungi **[https://script.google.com](https://script.google.com)** dan buka proyek Web App Anda.
2. **LANGKAH 1 — Perbarui `Code.gs`:**
   - Buka file **`Code.gs`** di komputer Anda, salin seluruh isinya (`Ctrl + A` lalu `Ctrl + C`).
   - Di editor Google Apps Script, buka file `Code.gs`, hapus semua isinya, lalu tempelkan (`Ctrl + V`).
   - Tekan **`Ctrl + S`** untuk menyimpan.
3. **LANGKAH 2 — Perbarui `Index.html`:**
   - Buka file **`Index.html`** di komputer Anda, salin seluruh isinya (`Ctrl + A` lalu `Ctrl + C`).
   - Di editor Google Apps Script, buka file `Index` (atau `Index.html`), hapus semua isinya, lalu tempelkan (`Ctrl + V`).
   - Tekan **`Ctrl + S`** untuk menyimpan.
4. **LANGKAH 3 — Deploy Versi Baru / Uji di `/dev`:**
   - **Jika menggunakan link `/dev`**: Pastikan tidak ada titik oranye pada file (artinya sudah tersimpan via `Ctrl + S`). Kemudian pada tab Web App, lakukan **Hard Refresh**: tekan **`Ctrl + Shift + R`** (atau `Ctrl + F5`) agar Chrome memuat ulang skrip baru dan tidak menggunakan cache lama!
   - **Jika menggunakan link `/exec` (Production)**:
     - Klik tombol biru **Deploy** di kanan atas > pilih **Manage deployments**.
     - Klik ikon **pensil (Edit)** pada deployment aktif Anda.
     - Pada pilihan dropdown *Version*, pilih **New version** (Versi baru).
     - Klik tombol **Deploy**.
5. Buka kembali Web App di browser ponsel Anda atau tekan **Hard Refresh (`Ctrl + Shift + R`)**!

---

## 💡 2 Cara Menyesuaikan Logo, Banner Promosi, atau Lagu

### Cara 1: Langsung dari Web App (Fitur CRUD — Direkomendasikan ⭐)
1. Buka Web App Anda.
2. Klik tombol **⚙️** di pemutar musik pojok atas, atau tombol **✏️ Kelola Media (CRUD)** di atas banner promosi.
3. Tambah, ubah, hapus, atau tes dengar musik Anda.
4. Klik tombol hijau **"💾 Simpan ke Google Sheet"**. Seluruh data akan langsung tersimpan di sheet `config` spreadsheet Anda dan langsung tampil di Web App!

### Cara 2: Mengisi Langsung di Google Spreadsheet Sheet `config`
Anda juga bisa membuka Google Spreadsheet pada sheet bernama **`config`** atau **`Table1`**:
- **Baris Logo**: Masukkan link Google Drive logo baru Anda di Kolom B atau C.
- **Baris Promosi**: Masukkan link gambar Google Drive (bisa dipisah koma atau dibuat beberapa baris promosi).
- **Baris Musik**: Masukkan judul lagu dan link Dropbox (bisa dipisah koma atau dibuat beberapa baris musik).
- **Baris AI Agent**: Kolom A berisi `AI Agent`, Kolom B nama agent, Kolom C URL link agent, Kolom D metadata: `Icon | Kategori | Deskripsi | LinkCoverGambar`.
Web App secara otomatis akan membaca sheet `config` setiap kali dimuat!

### Cara 3: Mengelola AI Agents & Custom Tools (CRUD AI Agents 🤖)
1. Buka Web App Anda.
2. Di section direktori AI Agents, klik tombol **"🤖 Kelola AI Agents"** (atau pintasan di Member Area Launchpad).
3. Anda dapat:
   - Menambahkan agent baru (Nama, Kategori, Icon, URL, Cover Gambar, Deskripsi).
   - Mengubah (Edit) data agent yang sudah ada dengan tombol **✏️ Edit**.
   - Menghapus agent dengan tombol **🗑️ Hapus**.
   - Mengatur urutan tampilan atas/bawah dengan tombol **⬆️** dan **⬇️**.
4. Klik tombol hijau **"💾 Simpan Perubahan ke Google Sheet"** di bagian bawah modal. Seluruh daftar akan tersimpan permanen di sheet `config` Google Spreadsheet Anda dan tidak akan hilang atau ter-reset lagi saat halaman dimuat ulang!
