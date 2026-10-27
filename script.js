"use strict";

const books = window.RUANG_BACA_BOOKS || [];

const bookGrid = document.querySelector("#bookGrid");
const bookSearch = document.querySelector("#bookSearch");
const sortBooks = document.querySelector("#sortBooks");
const filterButtons = [...document.querySelectorAll(".filter-button")];
const categoryCards = [...document.querySelectorAll(".category-card")];
const resultsCount = document.querySelector("#resultsCount");
const emptyState = document.querySelector("#emptyState");
const resetFiltersButton = document.querySelector("#resetFilters");
const emptyResetButton = document.querySelector("#emptyReset");
const toast = document.querySelector("#toast");
const cartOverlay = document.querySelector("#cartOverlay");
const cartItemsContainer = document.querySelector("#cartItems");
const cartEmpty = document.querySelector("#cartEmpty");
const cartFooter = document.querySelector("#cartFooter");
const cartCount = document.querySelector("#cartCount");
const cartItemLabel = document.querySelector("#cartItemLabel");
const cartTotal = document.querySelector("#cartTotal");
const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");

let activeCategory = "Semua";
let toastTimer;
let lastFocusedElement = null;
let cart = loadCart();

/** Mengubah angka menjadi format Rupiah. */
function formatRupiah(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Membuat teks aman untuk dimasukkan sebagai teks HTML. */
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

/** Menampilkan kartu buku sesuai hasil pencarian dan filter. */
function renderBooks() {
  const searchTerm = bookSearch.value.trim().toLocaleLowerCase("id-ID");
  let visibleBooks = books.filter((book) => {
    const matchesCategory =
      activeCategory === "Semua" || book.category === activeCategory;
    const searchText =
      `${book.title} ${book.author} ${book.category}`.toLocaleLowerCase(
        "id-ID",
      );
    return matchesCategory && searchText.includes(searchTerm);
  });

  switch (sortBooks.value) {
    case "low":
      visibleBooks.sort((a, b) => a.price - b.price);
      break;
    case "high":
      visibleBooks.sort((a, b) => b.price - a.price);
      break;
    case "az":
      visibleBooks.sort((a, b) => a.title.localeCompare(b.title, "id-ID"));
      break;
    default:
      visibleBooks.sort((a, b) => a.id - b.id);
  }

  bookGrid.innerHTML = visibleBooks
    .map(
      (book) => `
    <article class="book-card">
      <a class="book-card-main" href="detail.html?id=${book.id}" aria-label="Lihat detail ${escapeHTML(book.title)}">
        <div class="book-cover-wrap">
          <span class="book-badge ${book.id % 2 === 0 ? "badge-orange" : ""}">${escapeHTML(book.badge)}</span>
          <img class="book-cover" src="${escapeHTML(book.cover)}" alt="Sampul buku ${escapeHTML(book.title)}" loading="lazy">
          <span class="book-detail-cue">Lihat detail <span aria-hidden="true">↗</span></span>
        </div>
        <div class="book-content">
          <p class="book-category">${escapeHTML(book.category)}</p>
          <h3 class="book-title">${escapeHTML(book.title)}</h3>
          <p class="book-author">${escapeHTML(book.author)}</p>
        </div>
      </a>
      <div class="book-bottom">
        <span class="book-price">${formatRupiah(book.price)}</span>
        <button class="add-to-cart" type="button" data-add-to-cart="${book.id}" aria-label="Tambahkan ${escapeHTML(book.title)} ke keranjang" title="Tambah ke keranjang">+</button>
      </div>
    </article>
  `,
    )
    .join("");

  resultsCount.textContent = `Menampilkan ${visibleBooks.length} dari ${books.length} buku`;
  emptyState.hidden = visibleBooks.length !== 0;
  bookGrid.hidden = visibleBooks.length === 0;
}

/** Menandai tombol kategori aktif dan menampilkan ulang katalog. */
function selectCategory(category) {
  activeCategory = category;
  filterButtons.forEach((button) => {
    const isActive = button.dataset.category === activeCategory;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  renderBooks();
}

function resetFilters() {
  bookSearch.value = "";
  sortBooks.value = "featured";
  selectCategory("Semua");
}

/** Membaca keranjang dari browser. Data lokal ini hanya untuk demo. */
function loadCart() {
  try {
    const savedCart = JSON.parse(localStorage.getItem("ruangBacaCart") || "[]");
    if (!Array.isArray(savedCart)) return [];
    return savedCart
      .filter((item) => {
        return (
          books.some((book) => book.id === Number(item.id)) &&
          Number(item.quantity) > 0
        );
      })
      .map((item) => ({
        id: Number(item.id),
        quantity: Math.floor(Number(item.quantity)),
      }));
  } catch (error) {
    return [];
  }
}

function saveCart() {
  try {
    localStorage.setItem("ruangBacaCart", JSON.stringify(cart));
  } catch (error) {
    // Keranjang tetap berfungsi selama halaman terbuka jika penyimpanan browser diblokir.
  }
}

function getCartQuantity() {
  return cart.reduce((total, item) => total + item.quantity, 0);
}

function getCartTotal() {
  return cart.reduce((total, item) => {
    const book = books.find((entry) => entry.id === item.id);
    return total + (book ? book.price * item.quantity : 0);
  }, 0);
}

/** Memperbarui isi panel keranjang dan angka total. */
function renderCart() {
  const quantity = getCartQuantity();
  cartCount.textContent = quantity > 99 ? "99+" : String(quantity);
  cartItemLabel.textContent = `(${quantity})`;
  cartEmpty.hidden = cart.length > 0;
  cartFooter.hidden = cart.length === 0;
  cartItemsContainer.hidden = cart.length === 0;
  cartTotal.textContent = formatRupiah(getCartTotal());

  cartItemsContainer.innerHTML = cart
    .map((item) => {
      const book = books.find((entry) => entry.id === item.id);
      if (!book) return "";
      return `
      <article class="cart-item">
        <img src="${escapeHTML(book.cover)}" alt="Sampul ${escapeHTML(book.title)}">
        <div>
          <h3>${escapeHTML(book.title)}</h3>
          <p class="cart-item-price">${formatRupiah(book.price * item.quantity)}</p>
          <div class="quantity-controls" aria-label="Jumlah ${escapeHTML(book.title)}">
            <button type="button" data-cart-action="decrease" data-book-id="${book.id}" aria-label="Kurangi jumlah">−</button>
            <span>${item.quantity}</span>
            <button type="button" data-cart-action="increase" data-book-id="${book.id}" aria-label="Tambah jumlah">+</button>
          </div>
        </div>
        <button class="cart-item-remove" type="button" data-cart-action="remove" data-book-id="${book.id}">Hapus</button>
      </article>
    `;
    })
    .join("");
}

function addToCart(bookId) {
  const book = books.find((entry) => entry.id === Number(bookId));
  if (!book) return;
  const cartItem = cart.find((item) => item.id === book.id);
  if (cartItem) {
    cartItem.quantity += 1;
  } else {
    cart.push({ id: book.id, quantity: 1 });
  }
  saveCart();
  renderCart();
  showToast(`“${book.title}” ditambahkan ke keranjang.`);
}

function changeCartQuantity(bookId, action) {
  const item = cart.find((entry) => entry.id === Number(bookId));
  if (!item) return;

  if (action === "increase") item.quantity += 1;
  if (action === "decrease") item.quantity -= 1;
  if (action === "remove" || item.quantity <= 0) {
    cart = cart.filter((entry) => entry.id !== Number(bookId));
  }

  saveCart();
  renderCart();
}

function openCart() {
  lastFocusedElement = document.activeElement;
  cartOverlay.hidden = false;
  document.body.classList.add("no-scroll");
  document.querySelector("#closeCart").focus();
}

function closeCart() {
  cartOverlay.hidden = true;
  document.body.classList.remove("no-scroll");
  if (lastFocusedElement && typeof lastFocusedElement.focus === "function") {
    lastFocusedElement.focus();
  }
}

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("is-visible");
  }, 2600);
}

function closeMobileMenu() {
  mainNav.classList.remove("is-open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Buka menu navigasi");
}

// Delegasi event untuk tombol tambah ke keranjang pada kartu buku.
bookGrid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-to-cart]");
  if (addButton) addToCart(addButton.dataset.addToCart);
});

// Pencarian, filter kategori, dan pengurutan katalog.
bookSearch.addEventListener("input", renderBooks);
sortBooks.addEventListener("change", renderBooks);
filterButtons.forEach((button) => {
  button.setAttribute(
    "aria-pressed",
    String(button.classList.contains("is-active")),
  );
  button.addEventListener("click", () =>
    selectCategory(button.dataset.category),
  );
});
categoryCards.forEach((card) => {
  card.addEventListener("click", () => {
    selectCategory(card.dataset.category);
    document.querySelector("#koleksi").scrollIntoView({ behavior: "smooth" });
  });
});
resetFiltersButton.addEventListener("click", resetFilters);
emptyResetButton.addEventListener("click", resetFilters);

// Interaksi keranjang.
document.querySelector("#openCart").addEventListener("click", openCart);
document.querySelector("#closeCart").addEventListener("click", closeCart);
document.querySelector("#cartBackdrop").addEventListener("click", closeCart);
document.querySelector("#continueShopping").addEventListener("click", () => {
  closeCart();
  document.querySelector("#koleksi").scrollIntoView({ behavior: "smooth" });
});
cartItemsContainer.addEventListener("click", (event) => {
  const actionButton = event.target.closest("[data-cart-action]");
  if (!actionButton) return;
  changeCartQuantity(
    actionButton.dataset.bookId,
    actionButton.dataset.cartAction,
  );
});
document.querySelector("#checkoutButton").addEventListener("click", () => {
  showToast(
    "Ini masih demo UTS. Belum ada pembayaran atau pemesanan sungguhan.",
  );
});

// Menu navigasi mobile.
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("is-open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Tutup menu navigasi" : "Buka menu navigasi",
  );
});
mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

// Formulir pemesanan buku dengan komponen Bootstrap.
const orderForm = document.querySelector("#orderForm");
const orderBookSelect = document.querySelector("#orderBook");
const orderMessage = document.querySelector("#orderMessage");
const paymentFeedback = orderForm?.querySelector(".payment-feedback");

function updatePaymentFeedback() {
  if (!orderForm || !paymentFeedback) return;
  const selected = Boolean(
    orderForm.querySelector('input[name="paymentMethod"]:checked'),
  );
  paymentFeedback.classList.toggle(
    "is-visible",
    orderForm.classList.contains("was-validated") && !selected,
  );
}

function populateOrderBookOptions() {
  if (!orderBookSelect) return;

  // Menggunakan judul dan harga dari katalog agar opsi selalu konsisten.
  books.forEach((book) => {
    const option = document.createElement("option");
    option.value = String(book.id);
    option.textContent = `${book.title} — ${formatRupiah(book.price)}`;
    orderBookSelect.appendChild(option);
  });
}

populateOrderBookOptions();

if (orderForm && orderBookSelect && orderMessage) {
  orderForm.querySelectorAll('input[name="paymentMethod"]').forEach((radio) => {
    radio.addEventListener("change", updatePaymentFeedback);
  });

  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();
    orderForm.classList.add("was-validated");
    updatePaymentFeedback();

    if (!orderForm.checkValidity()) {
      orderMessage.textContent =
        "Periksa kembali formulir. Pastikan nama, alamat, buku, dan metode pembayaran sudah diisi dengan benar; periksa juga format email jika kamu mengisinya.";
      orderMessage.classList.remove("is-success");
      orderMessage.classList.add("is-error");
      const firstInvalid = orderForm.querySelector(":invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const customerName = document.querySelector("#orderName").value.trim();
    const selectedBook = books.find(
      (book) => String(book.id) === orderBookSelect.value,
    );
    const payment = orderForm.querySelector(
      'input[name="paymentMethod"]:checked',
    );
    const email = document.querySelector("#orderEmail").value.trim();

    if (!selectedBook || !payment) {
      orderMessage.textContent =
        "Pilih buku dan metode pembayaran terlebih dahulu.";
      orderMessage.classList.remove("is-success");
      orderMessage.classList.add("is-error");
      return;
    }

    updatePaymentFeedback();
    orderMessage.textContent = `Ringkasan pesanan demo: ${customerName} memilih “${selectedBook.title}” seharga ${formatRupiah(selectedBook.price)} dengan metode ${payment.value}.${email ? ` Email kontak: ${email}.` : ""} Pesanan belum dikirim ke server dan pembayaran belum diproses.`;
    orderMessage.classList.remove("is-error");
    orderMessage.classList.add("is-success");
    showToast("Formulir pesanan berhasil divalidasi sebagai demo.");
  });
}

// Form newsletter: validasi front-end saja, tidak mengirim data ke server.
document
  .querySelector("#newsletterForm")
  .addEventListener("submit", (event) => {
    event.preventDefault();
    const emailInput = document.querySelector("#newsletterEmail");
    const message = document.querySelector("#newsletterMessage");
    const email = emailInput.value.trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    message.classList.remove("is-error", "is-success");
    if (!validEmail) {
      message.textContent = "Masukkan alamat email yang valid.";
      message.classList.add("is-error");
      emailInput.focus();
      return;
    }

    message.textContent = `Terima kasih! Email ${email} lolos validasi demo.`;
    message.classList.add("is-success");
    showToast("Formulir berhasil divalidasi. Tidak ada email yang dikirim.");
    event.currentTarget.reset();
  });

// Tombol Escape menutup dialog keranjang dan menu mobile.
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!cartOverlay.hidden) closeCart();
    closeMobileMenu();
  }
});

// Tahun footer otomatis mengikuti tahun pada perangkat.
document.querySelector("#currentYear").textContent = String(
  new Date().getFullYear(),
);

// Render awal saat halaman dibuka.
renderBooks();
renderCart();

// Jika pengguna menekan "Beli Sekarang" dari detail buku, buka keranjang setelah kembali.
if (new URLSearchParams(window.location.search).get("cart") === "open") {
  openCart();
  window.history.replaceState(
    {},
    "",
    window.location.pathname + window.location.hash,
  );
}
