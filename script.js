/* ==========================================
   SELF-ORDERING POS — SCRIPT.JS
   Mobile-First · Lao Language
   ========================================== */

// ============================================================
// 1. DATA — Menu Items
// ============================================================
let menuItems = [
  { id:1,  name:'ຂ້າວໜຽວ',   desc:'ຂ້າວໜຽວຫຸງສຸກ ລ້ຽນ',         price:5000,  cat:'rice',    emoji:'🍚', soldOut:false },
  { id:2,  name:'ຂ້າວຜັດ',    desc:'ຜັດໄຂ່ ຜັກ ສົດ',              price:35000, cat:'rice',    emoji:'🍳', soldOut:false },
  { id:3,  name:'ຂ້າວໝູ',     desc:'ຂ້າວໝູແດງ ຊອດຫວານ',           price:30000, cat:'rice',    emoji:'🥩', soldOut:false },
  { id:4,  name:'ລາບໝູ',      desc:'ລາບໝູດິບ / ສຸກ ເຄື່ອງຄົບ',   price:40000, cat:'rice',    emoji:'🥗', soldOut:false },
  { id:5,  name:'ຕົ້ມຍຳ',     desc:'ຕົ້ມຍຳກຸ້ງ ເຜັດຮ້ອນ',         price:50000, cat:'rice',    emoji:'🦐', soldOut:false },
  { id:6,  name:'ເຝີໄກ່',     desc:'ນ້ຳສຸບໄກ່ ເສັ້ນໃຫຍ່ ໃຫ້ຜັກ',  price:25000, cat:'noodle',  emoji:'🍜', soldOut:false },
  { id:7,  name:'ກ໋ວຍຈັ໊ບ',   desc:'ເສັ້ນໃຫຍ່ ໝູ ໄຂ່ຕ້ົ',         price:30000, cat:'noodle',  emoji:'🍲', soldOut:false },
  { id:8,  name:'ຂ້າວປຽກ',    desc:'ຂ້າວປຽກໄກ່ ຂີງ ສຸກນຸ່ມ',     price:28000, cat:'noodle',  emoji:'🫕', soldOut:false },
  { id:9,  name:'ໄກ່ຍ່າງ',    desc:'ໄກ່ຍ່າງຟືນ ຊອດໃຫ້',           price:45000, cat:'grill',   emoji:'🍗', soldOut:false },
  { id:10, name:'ປາຫນຶ່ງ',    desc:'ປາຕົ້ມ ເຄື່ອງຈ້ຳ ຫອມ',        price:60000, cat:'grill',   emoji:'🐟', soldOut:false },
  { id:11, name:'ໝູກົ້ງ',     desc:'ໝູສາມຊັ້ນ ຖ່ານ',               price:55000, cat:'grill',   emoji:'🥓', soldOut:true  },
  { id:12, name:'ເບຍລາວ',     desc:'ເບຍຂວດ 640ml ເຢັນ',            price:20000, cat:'drink',   emoji:'🍺', soldOut:false },
  { id:13, name:'ນ້ຳໝາກໄມ້',  desc:'ສົ້ມ / ໝາກສີດາ / ໝາກນາວ',    price:15000, cat:'drink',   emoji:'🧃', soldOut:false },
  { id:14, name:'ນ້ຳດື່ມ',     desc:'ນ້ຳດ່ຽວ ເຢັນ 600ml',           price:5000,  cat:'drink',   emoji:'💧', soldOut:false },
  { id:15, name:'ຂ້າວໜົມ',    desc:'ຂ້າວໜົມຫໍ່ຢ່ອຍ ງາ',           price:8000,  cat:'dessert', emoji:'🍡', soldOut:false },
  { id:16, name:'ຂ້າວຕ້ົ',    desc:'ຂ້າວຕ້ົ ໝາກໂກ ໝົນ',           price:12000, cat:'dessert', emoji:'🧆', soldOut:false },
];

// ============================================================
// 2. STATE
// ============================================================
let cart         = []; // [{ id, name, price, emoji, qty }]
let orderHistory = [];
let orderNum     = 1;
let currentCat   = 'all';
let searchQuery  = '';

const catNames = {
  all: 'ທັງໝົດ', rice: 'ຂ້າວ', noodle: 'ເຝີ / ກ໋ວຍ',
  grill: 'ປີ້ງ', drink: 'ດື່ມ', dessert: 'ຂອງຫວານ'
};

// ============================================================
// 3. INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  renderMenu();
  addLog('ລະບົບ POS ເລີ່ມຕົ້ນ', 'success');
  addLog('ໂຕ 9A7F5A ເຊື່ອມຕໍ່ສຳເລັດ', 'success');
  addLog('ໂຫລດເມນູ ' + menuItems.length + ' ລາຍການ', 'info');

  // Swipe to close sheet
  setupSheetSwipe();
});

// ============================================================
// 4. PAGE NAVIGATION
// ============================================================
function showPage(page) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));

  // Show target
  const el = document.getElementById('page-' + page);
  if (el) el.classList.add('active');
  const navEl = document.getElementById('nav-' + page);
  if (navEl) navEl.classList.add('active');

  // Scroll back to top
  document.getElementById('mainContent').scrollTo({ top: 0, behavior: 'smooth' });

  if (page === 'report') updateReport();
  addLog('ເຂົ້າໜ້າ: ' + page, 'info');
}

// ============================================================
// 5. MENU RENDER
// ============================================================
function renderMenu() {
  const grid = document.getElementById('menuGrid');

  const filtered = menuItems.filter(item => {
    const matchCat  = currentCat === 'all' || item.cat === currentCat;
    const matchSrch = !searchQuery ||
      item.name.toLowerCase().includes(searchQuery) ||
      item.desc.toLowerCase().includes(searchQuery);
    return matchCat && matchSrch;
  });

  // Update label
  document.getElementById('sectionLabel').textContent = catNames[currentCat] || 'ທັງໝົດ';

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔍</div>
        <div>ບໍ່ພົບເມນູ</div>
      </div>`;
    return;
  }

  grid.innerHTML = filtered.map(item => {
    const inCart = cart.find(c => c.id === item.id);
    const qty    = inCart ? inCart.qty : 0;
    return `
      <div class="menu-card${item.soldOut ? ' sold-out-card' : ''}"
           id="card-${item.id}"
           onclick="${item.soldOut ? '' : 'tapCard(' + item.id + ')'}">

        ${item.soldOut ? '<div class="sold-out-badge">ໝົດ</div>' : ''}

        <div class="card-qty-badge${qty > 0 ? ' show' : ''}" id="badge-${item.id}">${qty}</div>

        <div class="menu-emoji">${item.emoji}</div>

        <div class="menu-body">
          <div class="menu-name">${item.name}</div>
          <div class="menu-desc">${item.desc}</div>
          <div class="menu-footer">
            <div class="menu-price">${fmt(item.price)} <small>ກີບ</small></div>
            ${item.soldOut
              ? '<span style="color:var(--red);font-size:0.72rem">ໝົດ</span>'
              : `<button class="add-btn" onclick="event.stopPropagation();addToCart(${item.id})">+</button>`
            }
          </div>
        </div>
      </div>`;
  }).join('');
}

// ============================================================
// 6. CATEGORY FILTER
// ============================================================
function filterCat(cat, el) {
  currentCat = cat;
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  renderMenu();
}

// ============================================================
// 7. SEARCH
// ============================================================
function searchMenu(val) {
  searchQuery = val.toLowerCase().trim();
  document.getElementById('searchClear').style.display = val ? 'flex' : 'none';
  renderMenu();
}

function clearSearch() {
  document.getElementById('searchInput').value = '';
  searchMenu('');
}

// ============================================================
// 8. CART OPERATIONS
// ============================================================

/** Tap card = add to cart + visual bounce */
function tapCard(id) {
  addToCart(id);
  const card = document.getElementById('card-' + id);
  if (card) {
    card.style.transition = 'transform 0.15s';
    card.style.transform  = 'scale(0.94)';
    setTimeout(() => { card.style.transform = 'scale(1)'; }, 150);
  }
}

function addToCart(id) {
  const item = menuItems.find(m => m.id === id);
  if (!item || item.soldOut) return;

  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: item.id, name: item.name, price: item.price, emoji: item.emoji, qty: 1 });
  }

  updateCartBadge(id);
  updateCartBar();
  showToast('✅ ' + item.name);
  addLog('ເພີ່ມ: ' + item.name, 'success');
}

function changeQty(id, delta) {
  const idx = cart.findIndex(c => c.id === id);
  if (idx === -1) return;
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  updateCartBadge(id);
  updateCartBar();
  renderSheet();
}

function clearCart() {
  cart.forEach(c => updateCartBadge(c.id, 0));
  cart = [];
  updateCartBar();
  renderSheet();
}

/** Update qty badge on menu card */
function updateCartBadge(id, forceQty = null) {
  const badge = document.getElementById('badge-' + id);
  if (!badge) return;
  const qty = forceQty !== null ? forceQty : (cart.find(c => c.id === id)?.qty || 0);
  badge.textContent = qty;
  badge.classList.toggle('show', qty > 0);
}

// ============================================================
// 9. CART BAR (sticky above bottom nav)
// ============================================================
function updateCartBar() {
  const bar  = document.getElementById('cartBar');
  const total = cartGrandTotal();
  const qty   = cartTotalQty();

  if (qty === 0) {
    bar.style.display = 'none';
    return;
  }
  bar.style.display = 'flex';
  document.getElementById('cartBarQty').textContent   = qty;
  document.getElementById('cartBarTotal').textContent = fmt(total) + ' ກີບ';
}

// ============================================================
// 10. BOTTOM SHEET
// ============================================================
function openCart() {
  document.getElementById('bottomSheet').classList.add('open');
  document.getElementById('sheetOverlay').classList.add('show');
  renderSheet();
}

function closeCart() {
  document.getElementById('bottomSheet').classList.remove('open');
  document.getElementById('sheetOverlay').classList.remove('show');
}

function renderSheet() {
  const body = document.getElementById('sheetBody');

  if (cart.length === 0) {
    body.innerHTML = `
      <div class="cart-empty-sheet">
        <div class="e-icon">🛒</div>
        ຍັງບໍ່ມີລາຍການ<br>ກາລຸນາເລືອກອາຫານ
      </div>`;
    updateSheetSummary(0, 0, 0);
    return;
  }

  body.innerHTML = cart.map(c => `
    <div class="cart-item" id="ci-${c.id}">
      <div class="ci-emoji">${c.emoji}</div>
      <div class="ci-info">
        <div class="ci-name">${c.name}</div>
        <div class="ci-price">${fmt(c.price * c.qty)} ກີບ</div>
      </div>
      <div class="ci-ctrl">
        <button class="ci-btn" onclick="changeQty(${c.id}, -1)">−</button>
        <span class="ci-qty">${c.qty}</span>
        <button class="ci-btn" onclick="changeQty(${c.id}, +1)">+</button>
      </div>
    </div>`
  ).join('');

  const sub   = cartSubtotal();
  const vat   = Math.round(sub * 0.07);
  const total = sub + vat;
  updateSheetSummary(sub, vat, total);
}

function updateSheetSummary(sub, vat, total) {
  document.getElementById('sumSub').textContent   = fmt(sub)   + ' ກີບ';
  document.getElementById('sumVat').textContent   = fmt(vat)   + ' ກີບ';
  document.getElementById('sumTotal').textContent = fmt(total) + ' ກີບ';
}

// ============================================================
// 11. PLACE ORDER
// ============================================================
function placeOrder() {
  if (cart.length === 0) {
    showToast('⚠️ ກາລຸນາເລືອກອາຫານກ່ອນ');
    return;
  }

  const sub   = cartSubtotal();
  const vat   = Math.round(sub * 0.07);
  const total = sub + vat;
  const num   = String(orderNum).padStart(4, '0');
  const table = document.getElementById('tableCode').textContent;
  const time  = new Date().toLocaleTimeString('lo-LA');
  const items = cart.map(c => c.name + ' ×' + c.qty).join(', ');

  // Save to history
  const order = { num, table, items, total, time, status: 'pending' };
  orderHistory.unshift(order);

  addLog('Order #' + num + ' ລວມ ' + fmt(total) + ' ກີບ — ລໍຖ້າ', 'warning');

  // Auto complete after 3s (simulate kitchen)
  setTimeout(() => {
    order.status = 'done';
    updateReport();
    addLog('Order #' + num + ' ສຳເລັດ ✅', 'success');
    document.getElementById('logDot').classList.add('show');
  }, 3000);

  orderNum++;

  // Show success modal
  document.getElementById('modalNum').textContent   = '#' + num;
  document.getElementById('modalTable').textContent = table;
  document.getElementById('modal').classList.add('show');

  // Reset cart
  cart.forEach(c => updateCartBadge(c.id, 0));
  cart = [];
  updateCartBar();
  closeCart();
}

function closeModal() {
  document.getElementById('modal').classList.remove('show');
  document.getElementById('logDot').classList.remove('show');
}

// ============================================================
// 12. REPORT
// ============================================================
function updateReport() {
  const total = orderHistory.reduce((s, o) => s + o.total, 0);
  document.getElementById('todayRevenue').textContent = fmt(total);
  document.getElementById('totalOrders').textContent  = orderHistory.length;

  // Top item
  const freq = {};
  orderHistory.forEach(o =>
    o.items.split(', ').forEach(i => {
      const n = i.split(' ×')[0].trim();
      freq[n] = (freq[n] || 0) + 1;
    })
  );
  const top = Object.entries(freq).sort((a, b) => b[1] - a[1])[0];
  document.getElementById('topItem').textContent = top ? top[0] : '—';

  const list = document.getElementById('ordersList');
  if (orderHistory.length === 0) {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">📭</div><div>ຍັງບໍ່ມີລາຍການ</div></div>`;
    return;
  }

  list.innerHTML = orderHistory.map(o => `
    <div class="order-item">
      <div class="order-top">
        <span class="order-num">#${o.num}</span>
        <span class="order-total">${fmt(o.total)} ກີບ</span>
      </div>
      <div class="order-items-txt">${o.items}</div>
      <div class="order-meta">
        <span>${o.time} · ໂຕ ${o.table}</span>
        <span class="status-badge ${o.status === 'done' ? 's-done' : o.status === 'cancel' ? 's-cancel' : 's-pending'}">
          ${o.status === 'done' ? '✅ ສຳເລັດ' : o.status === 'cancel' ? '❌ ຍົກເລີກ' : '⏳ ລໍຖ້າ'}
        </span>
      </div>
    </div>`).join('');
}

// ============================================================
// 13. SETTINGS — Add new item
// ============================================================
function addNewItem() {
  const name  = document.getElementById('newName').value.trim();
  const price = parseInt(document.getElementById('newPrice').value);
  const cat   = document.getElementById('newCat').value;

  if (!name)       { showToast('⚠️ ໃສ່ຊື່ເມນູ'); return; }
  if (isNaN(price) || price < 1) { showToast('⚠️ ໃສ່ລາຄາ'); return; }

  const emojis = { rice:'🍽️', noodle:'🍜', grill:'🔥', drink:'🥤', dessert:'🍮' };

  menuItems.push({
    id: Date.now(),
    name, price, cat,
    desc: 'ເມນູໃໝ່',
    emoji: emojis[cat] || '🍽️',
    soldOut: false
  });

  document.getElementById('newName').value  = '';
  document.getElementById('newPrice').value = '';

  showToast('✅ ເພີ່ມ ' + name + ' ສຳເລັດ');
  addLog('ເພີ່ມສິນຄ້າໃໝ່: ' + name + ' (' + fmt(price) + ' ກີບ)', 'success');

  // Re-render menu if visible
  if (document.getElementById('page-order').classList.contains('active')) {
    renderMenu();
  }
}

// ============================================================
// 14. LOG
// ============================================================
function addLog(msg, type = 'info') {
  const box  = document.getElementById('logBox');
  const time = new Date().toLocaleTimeString('lo-LA');
  const div  = document.createElement('div');
  div.className = 'log-entry ' + type;
  div.innerHTML  = `<span class="log-time">[${time}]</span><span class="log-msg">${msg}</span>`;
  box.insertBefore(div, box.firstChild);
}

function clearLogs() {
  document.getElementById('logBox').innerHTML = '';
  showToast('🗑️ ລ້າງ Log ແລ້ວ');
}

// ============================================================
// 15. TOAST
// ============================================================
function showToast(msg, duration = 2200) {
  const wrap = document.getElementById('toastWrap');
  const t    = document.createElement('div');
  t.className   = 'toast';
  t.textContent = msg;
  wrap.appendChild(t);
  setTimeout(() => {
    t.style.opacity   = '0';
    t.style.transform = 'translateY(6px)';
    t.style.transition = 'all 0.3s';
    setTimeout(() => t.remove(), 300);
  }, duration);
}

// ============================================================
// 16. SWIPE DOWN TO CLOSE SHEET
// ============================================================
function setupSheetSwipe() {
  const sheet = document.getElementById('bottomSheet');
  let startY = 0, startTime = 0;

  sheet.addEventListener('touchstart', e => {
    startY    = e.touches[0].clientY;
    startTime = Date.now();
  }, { passive: true });

  sheet.addEventListener('touchend', e => {
    const dy   = e.changedTouches[0].clientY - startY;
    const dt   = Date.now() - startTime;
    // Swipe down ≥ 80px in < 400ms = close
    if (dy > 80 && dt < 400) closeCart();
  }, { passive: true });
}

// ============================================================
// 17. HELPERS
// ============================================================
function cartSubtotal()  { return cart.reduce((s, c) => s + c.price * c.qty, 0); }
function cartTotalQty()  { return cart.reduce((s, c) => s + c.qty, 0); }
function cartGrandTotal() {
  const sub = cartSubtotal();
  return sub + Math.round(sub * 0.07);
}

function fmt(n) {
  return Number(n).toLocaleString('lo-LA');
}