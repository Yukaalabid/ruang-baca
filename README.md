# Ruang Baca — Proyek UTS Pemrograman Web Dasar

Website demo toko buku online menggunakan HTML, CSS, JavaScript, dan Bootstrap 5.3.8. Website ini bersifat front-end demo dan belum memakai backend.

## Struktur folder

```text
ruang-baca/
├── index.html          # Beranda / katalog toko buku
├── detail.html         # Halaman detail setiap buku
├── style.css           # Tampilan desktop dan mobile
├── script.js           # Interaksi beranda dan keranjang
├── detail.js           # Interaksi halaman detail buku
├── README.md           # Panduan proyek
└── assets/
    ├── books.js        # Data katalog bersama
    ├── logo.svg
    └── cover-*.svg     # Ilustrasi sampul buku demo
```

## Cara menjalankan

1. Ekstrak ZIP ke folder yang mudah ditemukan.
2. Buka folder `ruang-baca` di Visual Studio Code.
3. Pastikan `index.html`, `detail.html`, `style.css`, kedua file JavaScript, dan folder `assets` berada di dalam satu folder proyek.
4. Buka `index.html` menggunakan browser, atau gunakan ekstensi Live Server pada VS Code lalu pilih **Open with Live Server**.
5. Klik sampul atau judul buku pada halaman beranda untuk membuka halaman detail produk.
6. Uji tampilan desktop dan mobile, pencarian, kategori, pengurutan, keranjang, pilihan jumlah, serta validasi form.

## Fitur yang tersedia

- Katalog delapan buku contoh.
- Halaman detail produk terpisah yang dibuka ketika sampul atau judul buku diklik.
- Halaman detail berisi sampul, kategori, penulis, harga, deskripsi, spesifikasi, pilihan jumlah, tombol tambah ke keranjang, dan tombol beli sekarang (demo).
- Rekomendasi buku terkait yang dapat diklik untuk melihat detail lainnya.
- Filter kategori, pencarian judul/penulis/kategori, dan pengurutan harga atau judul.
- Keranjang dengan tambah jumlah, kurangi jumlah, hapus, dan total harga.
- Isi keranjang disimpan di `localStorage` pada browser yang sama.
- Menu navigasi mobile.
- Formulir pemesanan memakai Bootstrap: nama (text), alamat (textarea), metode pembayaran (radio), dan pilihan buku (select).
- Validasi formulir pemesanan dan ringkasan pesanan demo menggunakan JavaScript.
- Validasi front-end untuk form newsletter.
- Bootstrap 5.3.8 melalui CDN untuk komponen form.
- Footer menampilkan nama dan NIM mahasiswa.
- Efek hover pada kartu buku, judul buku, tombol, dan kartu formulir.
- Layout responsif menggunakan CSS Grid, Flexbox, Bootstrap Grid, dan media queries.

## Catatan penting

- Judul buku, nama penulis, dan harga adalah data contoh untuk tugas, bukan katalog toko sungguhan.
- Website ini belum memakai database, akun pengguna, payment gateway, ongkos kirim, atau backend.
- Form newsletter hanya melakukan validasi di browser; data tidak dikirim ke server.
- Tombol lanjutkan pesanan hanya menampilkan notifikasi bahwa pembayaran belum tersedia.
- Jika ingin mengubah data buku, edit `window.RUANG_BACA_BOOKS` di `assets/books.js` dan pastikan file sampul tersedia di folder `assets`. Data di halaman beranda dan halaman detail memakai katalog bersama ini.


## Identitas mahasiswa pada footer

- Nama: Muhammad Yuka Al Abid
- NIM: A12.2025.07401

Silakan periksa kembali ejaan nama dan NIM sebelum pengumpulan. Bootstrap dimuat dari CDN, sehingga koneksi internet diperlukan agar stylesheet dan JavaScript Bootstrap dapat dimuat.


## Penjelasan kode untuk presentasi UTS

### 1. HTML — `index.html` dan `detail.html`

- `index.html` berisi struktur utama beranda: navbar, hero, kategori, katalog buku, tentang Ruang Baca, formulir pemesanan, newsletter, dan footer.
- `detail.html` menjadi halaman detail ketika sampul atau kartu buku diklik. ID buku dikirim lewat query string, misalnya `detail.html?id=1`.
- Form pemesanan menggunakan `input type="text"` untuk nama, `textarea` untuk alamat, `input type="radio"` untuk metode pembayaran, dan `select` untuk memilih buku.
- Bootstrap CSS dan JavaScript dipanggil dari CDN di dalam `<head>`. File `style.css` diletakkan setelah Bootstrap supaya gaya khusus Ruang Baca dapat mengatur tampilan akhir.

### 2. CSS — `style.css`

- Bagian awal berisi variabel warna pada `:root`, pengaturan dasar, navigasi, hero, kategori, katalog, detail produk, newsletter, dan footer.
- Efek hover ditunjukkan antara lain oleh `.book-card:hover`, `.category-card:hover`, `.button:hover`, `.order-form-card:hover`, dan `.btn-order:hover`.
- Responsivitas halaman utama terutama diatur oleh media queries `@media (max-width: 1000px)`, `@media (max-width: 700px)`, dan `@media (max-width: 380px)`.
- Gaya tambahan formulir dan footer berada pada bagian akhir file, termasuk media queries `@media (max-width: 767.98px)` dan `@media (max-width: 420px)`.
- Grid Bootstrap seperti `row`, `col-lg-5`, `col-lg-7`, `col-md-6`, dan `g-3` membantu menyusun formulir agar berpindah menjadi satu kolom pada layar kecil.

### 3. JavaScript — `script.js` dan `detail.js`

- `assets/books.js` menyimpan data katalog bersama, dan data tersebut digunakan oleh halaman beranda serta detail buku.
- `script.js` membuat kartu buku, mencari dan memfilter buku, mengurutkan harga/nama, mengelola keranjang melalui `localStorage`, membuka menu mobile, memvalidasi newsletter, dan memvalidasi form pemesanan.
- Form pemesanan mengambil pilihan buku dari data katalog, memeriksa input wajib, membaca metode pembayaran terpilih, dan menampilkan ringkasan pesanan menggunakan `textContent`.
- `detail.js` menampilkan detail buku, rekomendasi buku terkait, serta tombol tambah ke keranjang dan beli sekarang.
- Data formulir hanya divalidasi di browser. Belum ada pengiriman data ke server atau pembayaran sungguhan.
