# 5025251111_Todo-App

# Identitas

Nama : Ahmad Rafli Syarif Attallah <br>
NRP : 5025251111 <br>
Kelas : Pemrograman Web (A) <br>


**Tugas [E06] The Endpoint of Portals**  
Peningkatan arsitektur backend aplikasi ToDo App menjadi RESTful API berbasis JSON serta integrasi antarmuka secara asinkron menggunakan JavaScript `fetch()` tanpa memuat ulang halaman.

---

##  Ringkasan Pembaruan

1. Seluruh operasi CRUD dimigrasikan ke satu endpoint REST API yang menangani metode `GET`, `POST`, `PUT`, `PATCH`, dan `DELETE`.
2. Daftar tugas dirender secara dinamis dari respons JSON, serta mendukung pengiriman gambar kamera Base64 dan fitur edit tugas tanpa *reload* halaman.
3. Mengimplementasikan kode respons standar untuk kondisi berhasil maupun validasi kesalahan (*error handling*).
4. Mengecualikan rute `/api/` dari strategi *Cache-First* agar data tugas yang ditampilkan selalu sinkron dengan database.

---

## Bukti Pengujian Endpoint (Postman)

Berikut adalah dokumentasi hasil pengujian kode respons sukses dan kesalahan menggunakan Postman:

### 1. Pengujian Kode Sukses (*Correct Response Code*)
* **`POST` — `201 Created` (Tambah Tugas Baru)**
  <img width="1919" height="1079" alt="Screenshot 2026-11-16 182237" src="https://github.com/user-attachments/assets/8a5f43ce-30d6-428c-b070-e3b0f125ebc4" />


* **`GET` — `200 OK` (Ambil Daftar Tugas)**
 <img width="1919" height="1079" alt="Screenshot 2026-11-16 182554" src="https://github.com/user-attachments/assets/32cc2014-a22b-43f5-a65e-d740ba3ce11d" />


* **`PATCH` — `200 OK` (Ubah Status Selesai)**
 <img width="1919" height="1079" alt="Screenshot 2026-11-16 182712" src="https://github.com/user-attachments/assets/fc601e37-dc3f-4a40-a319-e0f364675107" />

* **`PUT` — `200 OK` (Edit Detail Tugas)**
<img width="1919" height="1079" alt="Screenshot 2026-11-16 182740" src="https://github.com/user-attachments/assets/9baf8b7c-8086-4496-be3e-99cd4b343cd3" />


* **`DELETE` — `200 OK` (Hapus Tugas)**
  <img width="1919" height="1079" alt="Screenshot 2026-11-16 182807" src="https://github.com/user-attachments/assets/3a7c2696-5ad0-49a3-ae07-16147e55b598" />


### 2. Pengujian Kode Kesalahan (*Wrong Response Code*)
* **`400 Bad Request` (Validasi Input Kosong)**
  <img width="1919" height="1079" alt="Screenshot 2026-11-16 182849" src="https://github.com/user-attachments/assets/7316712b-e304-4315-bfc0-c24007185c64" />


* **`404 Not Found` (ID Tugas Tidak Ditemukan)**
  <img width="1919" height="1079" alt="Screenshot 2026-11-16 182927" src="https://github.com/user-attachments/assets/b0077239-aaa4-4ca3-8633-888f06e51762" />


* **`405 Method Not Allowed` (Metode HTTP Tidak Diizinkan)**
  <img width="1919" height="1079" alt="Screenshot 2026-11-16 183004" src="https://github.com/user-attachments/assets/8908c774-6f24-41d8-8366-8a9616948aef" />


---

## 📜 Credits

* **Ikon Aplikasi PWA:** [To do icons created by Magnific - Flaticon](https://www.flaticon.com/free-icons/to-do)
