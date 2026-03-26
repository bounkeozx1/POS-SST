/* ============================================================
   script.js — Self-Ordering (index.html) — Clean User Version
   Pages: สั่ง | ติดตามออร์เดอร์
   Removed: Settings, Log, total revenue report
   ============================================================ */
'use strict';

let cart=[], currentCat='all', searchQuery='';
const catNames={all:'ທັງໝົດ',rice:'ຂ້າວ',noodle:'ເຝີ/ກ໋ວຍ',grill:'ປີ້ງ',drink:'ດື່ມ',dessert:'ຂອງຫວານ'};

// ── Init ───────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadStoreInfo();
  renderMenu();
  setupSheetSwipe();

  // React to admin changes: menu updates, order status changes
  POS_DB.onExternalChange(key => {
    if (key === POS_DB.KEY.products) { renderMenu(); }
    if (key === POS_DB.KEY.orders)   { renderTracking(); updateHeaderPill(); }
  });

  // Poll order status every 8s (fallback for same-tab usage)
  setInterval(() => { renderTracking(); updateHeaderPill(); }, 8000);
});

// ── Store info from DB ─────────────────────────────────────
function loadStoreInfo() {
  const s = POS_DB.settings.get();
  const nameEl = document.getElementById('headerStoreName');
  const mapEl  = document.getElementById('mapStoreName');
  if (nameEl) nameEl.textContent = s.storeName || 'ຮ້ານອາຫານລາວ';
  if (mapEl)  mapEl.textContent  = (s.storeName || 'ຮ້ານອາຫານລາວ') + ' — ສາຂາຫຼັກ';
}

// ── Helpers ────────────────────────────────────────────────
function getTableCode() {
  return new URLSearchParams(window.location.search).get('table')
      || document.getElementById('tableCode')?.textContent
      || '9A7F5A';
}
function getTableId() {
  return new URLSearchParams(window.location.search).get('tableId') || 'table_default';
}

// ── Page Navigation ────────────────────────────────────────
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
  document.getElementById('page-'  + page)?.classList.add('active');
  document.getElementById('nav-'   + page)?.classList.add('active');
  document.getElementById('mainContent')?.scrollTo({ top:0, behavior:'smooth' });
  if (page === 'track') { renderTracking(); updateHeaderPill(); }
}

// ── Menu ───────────────────────────────────────────────────
function renderMenu() {
  const grid = document.getElementById('menuGrid');
  const filtered = POS_DB.products.getAll().filter(item => {
    const mc = currentCat === 'all' || item.cat === currentCat;
    const ms = !searchQuery
      || item.name.toLowerCase().includes(searchQuery)
      || item.desc.toLowerCase().includes(searchQuery);
    return mc && ms;
  });
  document.getElementById('sectionLabel').textContent = catNames[currentCat] || 'ທັງໝົດ';
  if (!filtered.length) {
    grid.innerHTML = `<div class="empty-state"><div class="empty-icon">🔍</div><div>ບໍ່ພົບເມນູ</div></div>`;
    return;
  }
  grid.innerHTML = filtered.map(item => {
    const qty    = (cart.find(c => c.id === item.id)||{qty:0}).qty;
    const isSold = item.status !== 'active' || item.stock <= 0;
    return `
      <div class="menu-card${isSold?' sold-out-card':''}" id="card-${item.id}"
           onclick="${isSold?'':'tapCard('+item.id+')'}">
        ${isSold?'<div class="sold-out-badge">ໝົດ</div>':''}
        <div class="card-qty-badge${qty>0?' show':''}" id="badge-${item.id}">${qty}</div>
        <div class="menu-emoji">${item.emoji}</div>
        <div class="menu-body">
          <div class="menu-name">${item.name}</div>
          <div class="menu-desc">${item.desc}</div>
          <div class="menu-footer">
            <div class="menu-price">${fmt(item.price)} <small>ກີບ</small></div>
            ${isSold
              ? '<span style="color:var(--red);font-size:.72rem">ໝົດ</span>'
              : `<button class="add-btn" onclick="event.stopPropagation();addToCart(${item.id})">+</button>`}
          </div>
        </div>
      </div>`;
  }).join('');
}

function filterCat(cat, el) {
  currentCat = cat;
  document.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  renderMenu();
}
function searchMenu(val) {
  searchQuery = val.toLowerCase().trim();
  document.getElementById('searchClear').style.display = val ? 'flex' : 'none';
  renderMenu();
}
function clearSearch() {
  document.getElementById('searchInput').value = '';
  searchMenu('');
}

// ── Cart ───────────────────────────────────────────────────
function tapCard(id) {
  addToCart(id);
  const card = document.getElementById('card-' + id);
  if (card) {
    card.style.transition = 'transform .15s';
    card.style.transform  = 'scale(.94)';
    setTimeout(() => card.style.transform = 'scale(1)', 150);
  }
}

function addToCart(id) {
  const item = POS_DB.products.get(id);
  if (!item || item.status !== 'active' || item.stock <= 0) return;
  const ex = cart.find(c => c.id === id);
  if (ex) {
    if (ex.qty >= item.stock) { showToast('⚠️ ສ່ວ ' + item.name + ' ໝົດ'); return; }
    ex.qty++;
  } else {
    cart.push({ id:item.id, name:item.name, price:item.price, emoji:item.emoji, qty:1 });
  }
  updateCartBadge(id);
  updateCartBar();
  showToast('✅ ' + item.name);
}

function changeQty(id, delta) {
  const idx = cart.findIndex(c => c.id === id);
  if (idx < 0) return;
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

function updateCartBadge(id, fq = null) {
  const b = document.getElementById('badge-' + id);
  if (!b) return;
  const q = fq !== null ? fq : (cart.find(c => c.id === id)?.qty || 0);
  b.textContent = q;
  b.classList.toggle('show', q > 0);
}

function updateCartBar() {
  const bar = document.getElementById('cartBar');
  const qty = cart.reduce((s,c) => s+c.qty, 0);
  if (!qty) { bar.style.display = 'none'; return; }
  bar.style.display = 'flex';
  document.getElementById('cartBarQty').textContent   = qty;
  document.getElementById('cartBarTotal').textContent = fmt(cartGrandTotal()) + ' ກີບ';
}

function openCart()  {
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
  if (!cart.length) {
    body.innerHTML = `<div class="cart-empty-sheet"><div class="e-icon">🛒</div>ຍັງບໍ່ມີລາຍການ</div>`;
    updateSheetSummary(0,0,0);
    return;
  }
  body.innerHTML = cart.map(c => `
    <div class="cart-item">
      <div class="ci-emoji">${c.emoji}</div>
      <div class="ci-info">
        <div class="ci-name">${c.name}</div>
        <div class="ci-price">${fmt(c.price * c.qty)} ກີບ</div>
      </div>
      <div class="ci-ctrl">
        <button class="ci-btn" onclick="changeQty(${c.id},-1)">−</button>
        <span class="ci-qty">${c.qty}</span>
        <button class="ci-btn" onclick="changeQty(${c.id},+1)">+</button>
      </div>
    </div>`).join('');
  const sub = cartSubtotal();
  const vat = Math.round(sub * (POS_DB.settings.getVat() / 100));
  updateSheetSummary(sub, vat, sub + vat);
}

function updateSheetSummary(s, v, t) {
  document.getElementById('sumSub').textContent   = fmt(s) + ' ກີບ';
  document.getElementById('sumVat').textContent   = fmt(v) + ' ກີບ';
  document.getElementById('sumTotal').textContent = fmt(t) + ' ກີບ';
}

// ── Place Order ────────────────────────────────────────────
function placeOrder() {
  if (!cart.length) { showToast('⚠️ ກາລຸນາເລືອກອາຫານ'); return; }
  const order = POS_DB.orders.create({
    tableCode:     getTableCode(),
    tableId:       getTableId(),
    items:         cart.map(c => ({ id:c.id, name:c.name, price:c.price, qty:c.qty, emoji:c.emoji })),
    paymentMethod: 'cash',
  });
  document.getElementById('modalNum').textContent   = '#' + order.num;
  document.getElementById('modalTable').textContent = order.tableCode;
  document.getElementById('modal').classList.add('show');
  cart.forEach(c => updateCartBadge(c.id, 0));
  cart = [];
  updateCartBar();
  closeCart();
  renderMenu();
  renderTracking();
  updateHeaderPill();
}

function closeModal() {
  document.getElementById('modal').classList.remove('show');
  showPage('track'); // redirect to tracking after order
}

// ── Order Tracking — MY ORDERS ONLY (this table) ──────────
function renderTracking() {
  const myTable  = getTableCode();
  // Filter orders for THIS table only — no other tables' data
  const myOrders = POS_DB.orders.getAll().filter(o => o.tableCode === myTable);

  const pending  = myOrders.filter(o => o.status === 'pending').length;
  const cooking  = myOrders.filter(o => o.status === 'cooking').length;
  const done     = myOrders.filter(o => o.status === 'done').length;

  document.getElementById('tPendingNum').textContent = pending;
  document.getElementById('tCookingNum').textContent = cooking;
  document.getElementById('tDoneNum').textContent    = done;

  // Nav badge — show pending count
  const navBadge = document.getElementById('navPendingBadge');
  const active   = pending + cooking;
  navBadge.style.display  = active > 0 ? 'flex' : 'none';
  navBadge.textContent    = active;

  const list = document.getElementById('trackOrders');
  if (!myOrders.length) {
    list.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🍽️</div>
        <div>ຍັງບໍ່ມີອໍ້ເດີ</div>
        <div style="font-size:.8rem;color:var(--muted);margin-top:6px">ກົດ "ສັ່ງ" ເພື່ອເລືອກອາຫານ</div>
      </div>`;
    document.getElementById('sessionTotal').style.display = 'none';
    return;
  }

  list.innerHTML = myOrders.map(o => {
    const steps = [
      { key:'pending', label:'ຮັບ' },
      { key:'cooking', label:'ປຸງ' },
      { key:'done',    label:'ສຳເລັດ' },
    ];
    const statusIdx = { pending:0, cooking:1, done:2, cancel:-1 };
    const curIdx    = statusIdx[o.status] ?? 0;

    const stepHTML = steps.map((s, i) => {
      const isDone   = i < curIdx;
      const isActive = i === curIdx && o.status !== 'cancel';
      const dotClass = isDone ? 'done-dot' : isActive ? 'active' : '';
      const lineClass = i < steps.length - 1 ? (isDone ? 'active' : '') : '';
      return `
        <div class="step">
          <div class="step-dot ${dotClass}"></div>
          <div class="step-lbl">${s.label}</div>
        </div>
        ${i < steps.length-1 ? `<div class="step-line ${lineClass}"></div>` : ''}`;
    }).join('');

    const statusLabel = {
      pending: '⏳ ລໍຖ້າ',
      cooking: '👨‍🍳 ກຳລັງປຸງ',
      done:    '✅ ສຳເລັດ',
      cancel:  '❌ ຍົກເລີກ',
    }[o.status] || o.status;

    const itemsText = o.items.map(i => `${i.emoji||''} ${i.name} ×${i.qty}`).join('  ·  ');

    return `
      <div class="track-card status-${o.status}">
        <div class="track-card-header">
          <span class="track-order-num">#${o.num}</span>
          <span class="track-order-time">${o.time}</span>
        </div>
        <div class="track-items">${itemsText}</div>
        <div class="track-footer">
          <div class="track-stepper">${stepHTML}</div>
          <button class="bill-btn" onclick="openBill(${o.id})">🧾 ເບິ່ງບິນ</button>
        </div>
        <div style="display:flex;align-items:center;justify-content:space-between;padding:8px 14px 12px;border-top:1px solid var(--border)">
          <span style="font-size:0.78rem;color:var(--muted)">
            ${{pending:'⏳ ລໍຖ້າ',cooking:'👨‍🍳 ກຳລັງປຸງ',done:'✅ ສຳເລັດ',cancel:'❌ ຍົກເລີກ'}[o.status]||''}
          </span>
          <span style="font-weight:700;color:var(--accent2);font-size:0.9rem">${fmt(o.total)} ກີບ</span>
        </div>
      </div>`;
  }).join('');

  // Session total
  const grandTotal = myOrders.filter(o=>o.status!=='cancel').reduce((s,o)=>s+o.total, 0);
  document.getElementById('sessionTotal').style.display = 'block';
  document.getElementById('stVal').textContent = fmt(grandTotal) + ' ກີບ';
}

// ── Header pill ────────────────────────────────────────────
function updateHeaderPill() {
  const myTable  = getTableCode();
  const active   = POS_DB.orders.getAll().filter(o =>
    o.tableCode === myTable && (o.status === 'pending' || o.status === 'cooking')
  );
  const pill     = document.getElementById('orderStatusPill');
  const pillText = document.getElementById('orderStatusText');
  if (active.length) {
    pill.style.display = 'flex';
    const cooking = active.filter(o => o.status === 'cooking').length;
    pillText.textContent = cooking ? 'ກຳລັງປຸງ ' + cooking + ' ອໍ້ເດີ' : 'ລໍຖ້າ ' + active.length + ' ອໍ້ເດີ';
  } else {
    pill.style.display = 'none';
  }
}

// ── Swipe sheet ────────────────────────────────────────────
function setupSheetSwipe() {
  const sheet = document.getElementById('bottomSheet');
  let sy=0, st=0;
  sheet.addEventListener('touchstart', e=>{sy=e.touches[0].clientY;st=Date.now();},{passive:true});
  sheet.addEventListener('touchend',   e=>{if(e.changedTouches[0].clientY-sy>80&&Date.now()-st<400)closeCart();},{passive:true});
}

// ── Utils ──────────────────────────────────────────────────
function cartSubtotal()  { return cart.reduce((s,c)=>s+c.price*c.qty,0); }
function cartGrandTotal(){ const s=cartSubtotal(); return s+Math.round(s*(POS_DB.settings.getVat()/100)); }

function fmt(n){ return Number(n).toLocaleString('lo-LA'); }

function showToast(msg, dur=2200) {
  const wrap = document.getElementById('toastWrap');
  const t    = document.createElement('div');
  t.className   = 'toast';
  t.textContent = msg;
  wrap.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; t.style.transition='all .3s'; setTimeout(()=>t.remove(),300); }, dur);
}

/* ════════════════════════════════════════
   BILL MODAL
════════════════════════════════════════ */

let currentBillOrderId = null;
let selectedPayment    = 'cash';

function openBill(orderId) {
  const order = POS_DB.orders.get(orderId);
  if (!order) return;
  currentBillOrderId = orderId;

  const s = POS_DB.settings.get();

  // Store info
  document.getElementById('billStoreName').textContent = s.storeName || 'ຮ້ານອາຫານລາວ';
  document.getElementById('billStoreMeta').textContent =
    (s.address || 'ວຽງຈັນ, ລາວ') + ' · ' + (s.phone || '—');

  // Order info
  document.getElementById('billTable').textContent    = order.tableCode;
  document.getElementById('billOrderNum').textContent = '#' + order.num;
  document.getElementById('billTime').textContent     = order.time;

  // Items
  document.getElementById('billBody').innerHTML = order.items.map(i => `
    <div class="bill-item">
      <div class="bill-item-left">
        <span class="bill-item-emoji">${i.emoji || '🍽️'}</span>
        <div>
          <div class="bill-item-name">${i.name}</div>
          <div class="bill-item-qty">× ${i.qty} &nbsp;@&nbsp; ${fmt(i.price)} ກີບ</div>
        </div>
      </div>
      <div class="bill-item-price">${fmt(i.price * i.qty)} ກີບ</div>
    </div>`).join('');

  // Summary
  document.getElementById('billSub').textContent   = fmt(order.subtotal) + ' ກີບ';
  document.getElementById('billVat').textContent   = fmt(order.vatAmt)   + ' ກີບ';
  document.getElementById('billTotal').textContent = fmt(order.total)    + ' ກີບ';

  // Payment section — show only for non-done orders
  const paySection = document.getElementById('billPaySection');
  const statusArea = document.getElementById('billStatusArea');
  const footerText = document.getElementById('billFooterText');

  if (order.status === 'done') {
    // Paid — show done badge, hide payment picker
    paySection.style.display = 'none';
    statusArea.innerHTML = `
      <div class="bill-status-tag">✅ ຊຳລະແລ້ວ — ${payMethodLabel(order.paymentMethod)}</div>`;
    footerText.textContent = s.receiptFooter || 'ຂໍຂອບໃຈທີ່ໃຊ້ບໍລິການ 🙏';
  } else if (order.status === 'cancel') {
    paySection.style.display = 'none';
    statusArea.innerHTML = `<div class="bill-status-tag" style="background:rgba(231,76,60,.12);color:var(--red);border-color:rgba(231,76,60,.3)">❌ ຍົກເລີກ</div>`;
    footerText.textContent = '';
  } else {
    // Pending / cooking — show payment picker
    paySection.style.display = 'block';
    statusArea.innerHTML = '';
    // Reset selection UI
    document.querySelectorAll('.pay-opt').forEach(o => {
      o.classList.toggle('selected', o.dataset.method === selectedPayment);
    });
    updateQrBlock();
  }

  document.getElementById('billOverlay').classList.add('show');
}

function closeBill() {
  document.getElementById('billOverlay').classList.remove('show');
  currentBillOrderId = null;
}

function closeBillOnOverlay(e) {
  if (e.target === document.getElementById('billOverlay')) closeBill();
}

function selectPayment(method, el) {
  selectedPayment = method;
  document.querySelectorAll('.pay-opt').forEach(o => o.classList.remove('selected'));
  el.classList.add('selected');
  updateQrBlock();

  // Persist payment method to order
  if (currentBillOrderId) {
    const orders = POS_DB.orders.getAll();
    const o = orders.find(x => x.id === currentBillOrderId);
    if (o) { o.paymentMethod = method; POS_DB.orders.save(orders); }
  }
}

function updateQrBlock() {
  document.getElementById('qrBlock').classList.toggle('show', selectedPayment === 'qr');
}

function payMethodLabel(m) {
  return { cash:'ເງິນສົດ', qr:'QR Code', transfer:'ໂອນເງິນ' }[m] || m || 'ເງິນສົດ';
}