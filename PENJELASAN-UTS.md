# Penjelasan Proyek UTS — Ruang Baca

## Ringkasan
Ruang Baca adalah prototipe toko buku online. Project ini menggunakan HTML untuk struktur, CSS untuk tampilan, Bootstrap untuk komponen form dan grid, serta JavaScript untuk interaksi.

## File yang penting
- `index.html`: beranda, katalog, formulir pemesanan, newsletter, dan footer.
- `detail.html`: halaman detail buku.
- `style.css`: gaya visual, efek hover, dan aturan responsif.
- `script.js`: pencarian/filter/sort katalog, keranjang, menu mobile, serta validasi formulir.
- `detail.js`: perilaku halaman detail buku.
- `assets/books.js`: data buku yang digunakan beranda dan detail.

## Bootstrap di mana?
Pada bagian `<head>` di `index.html` dan `detail.html`, terdapat link CSS Bootstrap 5.3.8 CDN. Di bagian `<head>` yang sama juga ada script bundle Bootstrap. Form menggunakan class `form-control`, `form-select`, `form-check-input`, `form-check`, `btn`, dan grid `row` / `col-*`.

## Formulir apa yang tersedia?
- Nama lengkap: `input type="text"`.
- Email opsional: `input type="email"`.
- Alamat pengiriman: `textarea`.
- Metode pembayaran: `input type="radio"`.
- Buku yang dipilih: `select` yang opsinya diisi dari data katalog dengan JavaScript.
- Saat dikirim, JavaScript memvalidasi input dan menampilkan ringkasan pesanan demo. Data tidak dikirim ke server.

## Hover ada di mana?
Lihat selector `:hover` di `style.css`, misalnya `.book-card:hover`, `.category-card:hover`, `.button:hover`, `.order-form-card:hover`, dan `.btn-order:hover`.

## Responsif ada di mana?
Media queries halaman utama terdapat di `style.css` pada breakpoint `1000px`, `700px`, dan `380px`. Gaya formulir memiliki breakpoint tambahan `767.98px` dan `420px`. Bootstrap Grid juga membantu mengatur kolom formulir: dua kolom untuk beberapa field di layar lebih besar dan satu kolom ketika ruang tidak mencukupi.

## Footer identitas
Footer pada halaman utama dan detail menampilkan nama **Muhammad Yuka Al Abid** dan NIM **A12.2025.07401**. Pastikan keduanya benar sebelum pengumpulan.

## Batasan demo
Website belum memakai database, backend, gateway pembayaran, atau pengiriman pesanan nyata. Harga dan katalog buku adalah data contoh.
