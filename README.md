# 5025251111_Todo-App

# Identitas

Nama : Ahmad Rafli Syarif Attallah
NRP : 5025251111
Kelas : Pemrograman Web (A)

# Todo App - PWA (E05)

Aplikasi **ToDo App** berbasis PHP dan MySQL ini telah diperbarui agar mendukung standar Progressive Web App (PWA). Dengan memanfaatkan Service Worker API dan Web App Manifest, aplikasi dapat diinstal langsung ke layar utama perangkat serta tetap dapat dibuka meskipun perangkat dalam keadaan offline

## Fitur 
- **Web App Manifest**: Aplikasi dapat diinstal ke layar utama desktop/mobile.
- **Offline Support**: Menyimpan *App Shell* menggunakan Service Worker dengan strategi *Cache First*.
- **Live Camera**: Ambil foto bukti tugas menggunakan webcam.
- **Dark Mode**: Pilihan tema gelap dan terang.

## Struktur Berkas
- `index.php` - Halaman utama
- `navibar.php` - Sidebar navigasi & form tugas (termasuk tombol install)
- `content.php` - Tampilan daftar tugas
- `config.php` - Koneksi database MySQL
- `insertprocess.php` & `deletepro.php` - Pemrosesan data tugas
- `manifest.json` - File manifest PWA
- `sw.js` - Service Worker untuk caching & mode offline
- `script.js` - Logika kamera, dark mode, dan instalasi PWA
- `style.css` - Styling aplikasi
- `img/icon.png` - Ikon PWA (512x512)

### 1. Manifest
<img width="1138" height="903" alt="Screenshot 2026-11-02 171153" src="https://github.com/user-attachments/assets/3e7f06f1-411f-4a0a-a351-e706725de6fa" />

<img width="1498" height="957" alt="Screenshot 2026-11-02 171906" src="https://github.com/user-attachments/assets/2bffc21b-59d6-44b9-9f28-cde143c82310" />


### 2. Cache Storage
<img width="1919" height="1019" alt="Screenshot 2026-11-02 174332" src="https://github.com/user-attachments/assets/b46734d8-a05a-4911-aa18-86fb4f39c7d0" />


### 3. Mode Offline
<img width="1919" height="1015" alt="Screenshot 2026-11-02 175011" src="https://github.com/user-attachments/assets/7edc3b5e-7540-4430-84b1-c178561ddd0e" />


### 3. Tambahan Fitur Install
<img width="1919" height="948" alt="Screenshot 2026-11-02 181457" src="https://github.com/user-attachments/assets/5ec8a59c-5b32-4a20-ab1a-c85f68ae085d" />

- Tampilan icon di dekstop
<img width="948" height="516" alt="Screenshot 2026-11-02 181534" src="https://github.com/user-attachments/assets/46f51bb2-09ac-4449-91bd-7e4b21c31fff" />


## Credit Aset
* Ikon PWA: [To do icons created by Magnific - Flaticon](https://www.flaticon.com/free-icons/to-do)
