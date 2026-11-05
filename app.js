// ── PRODUCTOS ──
const products = [
  { id: 1, name: "Cyber Nexus 2077",  genre: "RPG",          price: 59.99, icon: "🎮", stars: 5, reviews: 128 },
  { id: 2, name: "Shadow Ops: Zero",  genre: "Acción",       price: 49.99, icon: "🕹️", stars: 4, reviews: 94  },
  { id: 3, name: "Galactic Clash",    genre: "Estrategia",   price: 39.99, icon: "🚀", stars: 4, reviews: 76  },
  { id: 4, name: "Neon Racer X",      genre: "Carreras",     price: 29.99, icon: "🏎️", stars: 5, reviews: 210 },
  { id: 5, name: "Dungeon Protocol",  genre: "Roguelike",    price: 24.99, icon: "⚔️", stars: 4, reviews: 58  },
  { id: 6, name: "Storm Arena",       genre: "Battle Royale",price: 0.00,  icon: "⚡", stars: 3, reviews: 320 },
  { id: 7, name: "Phantom Blade",     genre: "Acción",       price: 54.99, icon: "🗡️", stars: 5, reviews: 142 },
  { id: 8, name: "Pixel Worlds",      genre: "Sandbox",      price: 19.99, icon: "🌍", stars: 4, reviews: 87  },
];

let cart = [];
let activeFilter = "all";

// ── HELPERS ──
function starsHTML(n) {
  return Array.from({ length: 5 }, (_, i) =>
    `<span>${i < n ? "★" : "☆"}</span>`
  ).join("");
}

function formatPrice(p) {
  return p === 0 ? "GRATIS" : "$" + p.toFixed(2);
}

// ── RENDER PRODUCTOS ──
function renderProducts() {
  const grid = document.getElementById("productsGrid");
  const filtered = activeFilter === "all"
    ? products
    : products.filter(p => p.genre === activeFilter);

  if (filtered.length === 0) {
    grid.innerHTML = `<p style="color:var(--muted);font-size:.9rem;grid-column:1/-1;text-align:center;padding:3rem 0;">Sin resultados para esta categoría.</p>`;
    return;
  }

  grid.innerHTML = filtered.map(p => `
    <div class="product-card">
      <div class="product-img">${p.icon}</div>
      <div class="product-info">
        <div class="product-name">${p.name}</div>
        <div class="product-price">${formatPrice(p.price)}</div>
      </div>
      <div class="product-footer">
        <div>
          <div class="stars">${starsHTML(p.stars)}<span class="star-count">(${p.reviews})</span></div>
        </div>
        <button class="add-btn" id="btn-${p.id}" onclick="addToCart(${p.id})" title="Agregar al carrito">
          &#43;
        </button>
      </div>
    </div>
  `).join("");
}

// ── FILTROS ──
document.getElementById("filters").addEventListener("click", e => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  activeFilter = btn.dataset.filter;
  renderProducts();
});

// ── AGREGAR AL CARRITO ──
function addToCart(id) {
  const product = products.find(p => p.id === id);
  const existing = cart.find(i => i.id === id);
  if (existing) { existing.qty += 1; } else { cart.push({ ...product, qty: 1 }); }
  renderCart();
  openDrawer();

  const btn = document.getElementById("btn-" + id);
  if (!btn) return;
  btn.innerHTML = "✓";
  btn.classList.add("added");
  setTimeout(() => {
    btn.innerHTML = "&#43;";
    btn.classList.remove("added");
  }, 1200);
}

// ── CAMBIAR CANTIDAD ──
function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(i => i.id !== id);
  renderCart();
}

// ── ELIMINAR ITEM ──
function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
}

// ── RENDER CARRITO ──
function renderCart() {
  const list     = document.getElementById("cartList");
  const footer   = document.getElementById("cartTotal");
  const badge    = document.getElementById("badge");
  const totalEl  = document.getElementById("totalPrice");

  const totalQty   = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.price * i.qty, 0);

  if (totalQty > 0) {
    badge.textContent = totalQty;
    badge.style.display = "flex";
  } else {
    badge.style.display = "none";
  }

  if (cart.length === 0) {
    list.innerHTML = '<p class="empty-msg">No hay productos en el carrito.</p>';
    footer.style.display = "none";
    return;
  }

  footer.style.display = "flex";
  totalEl.textContent = "$" + totalPrice.toFixed(2);

  list.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-icon">${item.icon}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatPrice(item.price * item.qty)}</div>
      </div>
      <div class="qty-controls">
        <button class="qty-btn" onclick="changeQty(${item.id}, -1)">&#8722;</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id}, 1)">&#43;</button>
      </div>
      <button class="remove-btn" onclick="removeItem(${item.id})" title="Eliminar">&#10005;</button>
    </div>
  `).join("");
}

// ── DRAWER OPEN / CLOSE ──
function openDrawer() {
  document.getElementById("cartDrawer").classList.add("open");
  document.getElementById("cartOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeDrawer() {
  document.getElementById("cartDrawer").classList.remove("open");
  document.getElementById("cartOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

document.getElementById("cartBtn").addEventListener("click", openDrawer);
document.getElementById("cartClose").addEventListener("click", closeDrawer);
document.getElementById("cartOverlay").addEventListener("click", closeDrawer);

document.getElementById("btnClear").addEventListener("click", () => {
  cart = [];
  renderCart();
});

// ── INICIO ──
renderProducts();
