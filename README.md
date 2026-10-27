# Ruang Baca — Website Toko Buku Online

## Identitas Mahasiswa

- **Nama:** Muhammad Yuka Al Abid
- **NIM:** A12.2025.07401
- **Mata Kuliah:** Pemrograman Web Dasar
- **Proyek:** UTS — Website Toko Buku Online

## Deskripsi Proyek

Ruang Baca adalah website toko buku online yang dirancang untuk membantu pengunjung menjelajahi koleksi buku berdasarkan kategori, mencari buku, melihat detail produk, dan mengelola pilihan buku melalui keranjang belanja. Website menggunakan HTML untuk struktur halaman, CSS untuk tampilan dan responsivitas, JavaScript untuk interaksi, serta Bootstrap untuk membantu penyusunan komponen formulir.

## Fitur Utama

- Halaman utama dengan bagian beranda, kategori, koleksi buku, informasi toko, formulir pemesanan, newsletter, dan footer.
- Katalog buku yang menggunakan data dari `assets/books.js`.
- Pencarian buku berdasarkan judul, penulis, atau kategori.
- Filter kategori dan pengurutan buku berdasarkan harga atau nama.
- Halaman detail buku yang terbuka ketika pengunjung memilih kartu atau sampul buku.
- Keranjang belanja dengan fitur tambah, ubah jumlah, hapus buku, dan perhitungan total harga.
- Formulir pemesanan menggunakan Bootstrap, terdiri dari input nama, email opsional, textarea alamat, dropdown pilihan buku, dan radio button metode pembayaran.
- Validasi isian formulir dan tampilan ringkasan pesanan.
- Formulir newsletter dengan validasi format email.
- Efek hover pada kartu kategori, kartu buku, dan tombol.
- Tampilan responsif untuk desktop, tablet, dan ponsel menggunakan CSS Grid, Flexbox, serta media queries.
- Footer yang menampilkan nama dan NIM mahasiswa.

## Teknologi yang Digunakan

- **HTML5** — struktur halaman dan elemen semantik.
- **CSS3** — warna, tipografi, layout, efek hover, dan responsive design.
- **JavaScript** — pencarian, filter, detail buku, keranjang, dan validasi formulir.
- **Bootstrap 5.3.8** — grid dan komponen formulir.
- **LocalStorage** — menyimpan isi keranjang pada browser.
- **SVG** — logo dan ilustrasi sampul buku.

## Struktur Folder

```text
ruang-baca/
├── assets/
│   ├── books.js
│   ├── logo.svg
│   └── cover-*.svg
├── bootstrap-5.3.8-dist/
│   ├── css/
│   │   └── bootstrap.min.css
│   └── js/
│       └── bootstrap.bundle.min.js
├── index.html
├── detail.html
├── style.css
├── script.js
├── detail.js
├── README.md
└── PENJELASAN-UTS.md

---

**Ruang Baca** — Website toko buku online menggunakan HTML, CSS, JavaScript, dan Bootstrap.
