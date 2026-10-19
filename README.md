# 5025251111_Todo-App

# Identitas

Nama : Ahmad Rafli Syarif Attallah
NRP : 5025251111
Kelas : Pemrograman Web (A)

# Deskripsi
(Update E04) 
Pada pembaruan ini, penyimpanan data ToDo App telah dimigrasikan dari penyimpanan lokal browser (IndexedDB) ke sistem basis data server menggunakan PHP dan MySQL.
Perubahan dan Fitur yang Diterapkan:
1. Modularisasi Kode: Memecah struktur file HTML utama menjadi beberapa modul PHP (index.php, navibar.php, dan content.php) agar lebih rapi.
2. Sistem Kategori: Menambahkan navigasi menu (sidebar) untuk memisahkan daftar tugas menjadi dua tipe: Personal dan Shared.
3. Konfigurasi Database: Mengimplementasikan skema database (data.sql) dan koneksi server (config.php).
4. Fungsi CRUD menggunakan PHP:
  - Create: Menerima data dari form dan menyimpannya ke MySQL (insertprocess.php).
  - Read: Menampilkan tugas secara dinamis dari database berdasarkan kategori (content.php).
  - Update: Mengubah status penyelesaian tugas (statustoggle.php).
  - Delete: Menghapus baris data tugas dari database (deletepro.php).

Dokumentasi web:
<img width="1913" height="1013" alt="image" src="https://github.com/user-attachments/assets/7cb300da-aa8d-4d95-9069-3ed3bca59c26" />

-
<img width="1919" height="1017" alt="image" src="https://github.com/user-attachments/assets/73b6e200-a2ec-448d-88f8-287423b865fa" />

-
<img width="1917" height="1016" alt="image" src="https://github.com/user-attachments/assets/11774051-d6b0-4b78-9e22-73c70ffb9693" />


