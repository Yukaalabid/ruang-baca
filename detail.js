"use strict";

const books = window.RUANG_BACA_BOOKS || [];
const params = new URLSearchParams(window.location.search);
const requestedId = Number(params.get("id"));
const book = books.find((item) => item.id === requestedId);
const productDetail = document.querySelector("#productDetail");
const detailToast = document.querySelector("#detailToast");
const detailCartCount = document.querySelector("#detailCartCount");
let selectedQuantity = 1;
let toastTimer;

function rupiah(value) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function escapeHTML(value) {
  return String(value).replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[character],
  );
}

function readCart() {
  try {
    const cart = JSON.parse(localStorage.getItem("ruangBacaCart") || "[]");
    return Array.isArray(cart)
      ? cart.filter(
          (item) =>
            books.some((entry) => entry.id === Number(item.id)) &&
            Number(item.quantity) > 0,
        )
      : [];
  } catch (error) {
    return [];
  }
}

function updateCartCount() {
  const total = readCart().reduce(
    (sum, item) => sum + Math.floor(Number(item.quantity)),
    0,
  );
  detailCartCount.textContent = total > 99 ? "99+" : String(total);
}

function saveCartWithBook(quantityToAdd) {
  const cart = readCart();
  const existing = cart.find((item) => Number(item.id) === book.id);
  if (existing)
    existing.quantity = Math.floor(Number(existing.quantity)) + quantityToAdd;
  else cart.push({ id: book.id, quantity: quantityToAdd });
  try {
    localStorage.setItem("ruangBacaCart", JSON.stringify(cart));
  } catch (error) {
    // Keranjang tetap dapat digunakan di sesi saat ini jika browser memblokir penyimpanan lokal.
  }
  updateCartCount();
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  detailToast.textContent = message;
  detailToast.classList.add("is-visible");
  toastTimer = window.setTimeout(
    () => detailToast.classList.remove("is-visible"),
    2600,
  );
}

function renderProduct() {
  if (!book) {
    document.title = "Buku Tidak Ditemukan — Ruang Baca";
    document.querySelector("#breadcrumbBookName").textContent =
      "Buku tidak ditemukan";
    productDetail.innerHTML = `
      <div class="product-not-found">
        <span aria-hidden="true">⌕</span><h1>Buku tidak ditemukan.</h1>
        <p>Buku yang kamu cari tidak tersedia atau tautannya tidak valid.</p>
        <a class="button button-primary" href="index.html#koleksi">Kembali ke koleksi buku <span aria-hidden="true">→</span></a>
      </div>`;
    return;
  }

  document.title = `${book.title} — Ruang Baca`;
  document.querySelector("#breadcrumbBookName").textContent = book.title;
  productDetail.innerHTML = `
    <div class="product-image-column">
      <div class="product-cover-stage">
        <span class="product-cover-ribbon">${escapeHTML(book.badge)}</span>
        <img class="product-main-cover" src="${escapeHTML(book.cover)}" alt="Sampul buku ${escapeHTML(book.title)}">
        <p class="cover-caption">Sampul buku · ilustrasi untuk proyek demo</p>
      </div>
      <div class="product-image-note"><span aria-hidden="true">✦</span><span><strong>Dipilih untuk menemani proses belajarmu</strong><small>Temukan bacaan sesuai tujuanmu.</small></span></div>
    </div>
    <div class="product-info-column">
      <p class="product-category-label">${escapeHTML(book.category)}</p>
      <p class="product-stock-label"><span aria-hidden="true">●</span> Tersedia di katalog demo</p>
      <h1 id="productTitle">${escapeHTML(book.title)}</h1>
      <p class="product-author-line">oleh <strong>${escapeHTML(book.author)}</strong></p>
      <div class="product-price-panel"><span>Harga buku</span><strong>${rupiah(book.price)}</strong><small>Harga contoh untuk proyek UTS</small></div>
      <p class="product-short-description">${escapeHTML(book.description)}</p>
      <div class="product-service-list">
        <div><span class="service-check" aria-hidden="true">✓</span><span><strong>Detail buku lengkap</strong><small>Informasi produk ditampilkan di bawah.</small></span></div>
        <div><span class="service-check" aria-hidden="true">✓</span><span><strong>Keranjang tersimpan</strong><small>Isi keranjang disimpan di browser ini.</small></span></div>
      </div>
      <div class="product-quantity-row"><span>Jumlah</span><div class="product-quantity-control" aria-label="Pilih jumlah buku"><button id="quantityMinus" type="button" aria-label="Kurangi jumlah">−</button><output id="quantityValue" aria-live="polite">1</output><button id="quantityPlus" type="button" aria-label="Tambah jumlah">+</button></div><span class="quantity-hint">Pilih jumlah buku</span></div>
      <div class="product-actions"><button class="button button-outline product-add-button" id="addDetailCart" type="button"><span aria-hidden="true">＋</span> Tambah ke Keranjang</button><button class="button button-primary product-buy-button" id="buyNow" type="button">Beli Sekarang <span aria-hidden="true">→</span></button></div>
      <p class="product-demo-note"><span aria-hidden="true">ⓘ</span> Ini adalah demo UTS. Tombol pembelian belum memproses pembayaran sungguhan.</p>
    </div>`;

  document.querySelector("#longDescription").textContent =
    book.longDescription || book.description;
  document.querySelector("#productSpecs").innerHTML = `
    <div><dt>Kategori</dt><dd>${escapeHTML(book.category)}</dd></div>
    <div><dt>Penulis</dt><dd>${escapeHTML(book.author)}</dd></div>
    <div><dt>Jumlah halaman</dt><dd>${book.pages} halaman</dd></div>
    <div><dt>Format</dt><dd>${escapeHTML(book.format)}</dd></div>
    <div><dt>Bahasa</dt><dd>${escapeHTML(book.language)}</dd></div>
    <div><dt>Penerbit</dt><dd>${escapeHTML(book.publisher)}</dd></div>`;
  document.querySelector("#bookDescriptionPanel").hidden = false;
  document.querySelector("#relatedSection").hidden = false;
  renderRelatedBooks();

  document.querySelector("#quantityMinus").addEventListener("click", () => {
    selectedQuantity = Math.max(1, selectedQuantity - 1);
    document.querySelector("#quantityValue").textContent =
      String(selectedQuantity);
  });
  document.querySelector("#quantityPlus").addEventListener("click", () => {
    selectedQuantity = Math.min(99, selectedQuantity + 1);
    document.querySelector("#quantityValue").textContent =
      String(selectedQuantity);
  });
  document.querySelector("#addDetailCart").addEventListener("click", () => {
    saveCartWithBook(selectedQuantity);
    showToast(
      `${selectedQuantity} buku “${book.title}” ditambahkan ke keranjang.`,
    );
  });
  document.querySelector("#buyNow").addEventListener("click", () => {
    saveCartWithBook(selectedQuantity);
    window.location.href = "index.html?cart=open";
  });
}

function renderRelatedBooks() {
  const otherBooks = books
    .filter((item) => item.id !== book.id && item.category === book.category)
    .concat(
      books.filter(
        (item) => item.id !== book.id && item.category !== book.category,
      ),
    )
    .slice(0, 4);
  document.querySelector("#relatedBooks").innerHTML = otherBooks
    .map(
      (item) => `
    <a class="related-book-card" href="detail.html?id=${item.id}">
      <div class="related-book-cover"><img src="${escapeHTML(item.cover)}" alt="Sampul ${escapeHTML(item.title)}" loading="lazy"></div>
      <div class="related-book-copy"><span>${escapeHTML(item.category)}</span><strong>${escapeHTML(item.title)}</strong><small>${escapeHTML(item.author)}</small><b>${rupiah(item.price)}</b></div>
    </a>`,
    )
    .join("");
}

updateCartCount();
document.querySelector("#detailCurrentYear").textContent = String(
  new Date().getFullYear(),
);
renderProduct();
