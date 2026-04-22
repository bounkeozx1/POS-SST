/* ==========================================
   POS-SST ADMIN DASHBOARD — SCRIPT.JS
   Full logic: Auth, CRUD, Charts, Reports
   ========================================== */

'use strict';

// ════════════════════════════════
// 1. MOCK DATA
// ════════════════════════════════

let DB = {
  users: [
    { id:1, name:'Admin User',    username:'admin',   password:'1234', role:'admin',   status:'active',   lastLogin: '2025-01-15 09:00' },
    { id:2, name:'สมชาย ขายดี',  username:'somchai', password:'1234', role:'cashier', status:'active',   lastLogin: '2025-01-15 08:30' },
    { id:3, name:'Noy Manager',   username:'noy',     password:'1234', role:'manager', status:'inactive', lastLogin: '2025-01-10 14:00' },
  ],

  products: [
    { id:1,  name:'ข้าวเหนียว',   desc:'ข้าวเหนียวหุงสุก',     price:5000,  cat:'rice',    emoji:'🍚', stock:99, status:'active'  },
    { id:2,  name:'ข้าวผัด',       desc:'ผัดไข่ ผัก สด',         price:35000, cat:'rice',    emoji:'🍳', stock:50, status:'active'  },
    { id:3,  name:'ข้าวหมู',       desc:'ข้าวหมูแดง ซอสหวาน',   price:30000, cat:'rice',    emoji:'🥩', stock:40, status:'active'  },
    { id:4,  name:'ลาบหมู',        desc:'ลาบหมูดิบ/สุก',         price:40000, cat:'rice',    emoji:'🥗', stock:30, status:'active'  },
    { id:5,  name:'ต้มยำ',         desc:'ต้มยำกุ้ง เผ็ดร้อน',    price:50000, cat:'rice',    emoji:'🦐', stock:25, status:'active'  },
    { id:6,  name:'เฝอไก่',        desc:'น้ำซุปไก่ เส้นใหญ่',    price:25000, cat:'noodle',  emoji:'🍜', stock:35, status:'active'  },
    { id:7,  name:'ก๋วยจั๊บ',      desc:'เส้นใหญ่ หมู ไข่',      price:30000, cat:'noodle',  emoji:'🍲', stock:5,  status:'active'  },
    { id:8,  name:'ไก่ย่าง',       desc:'ไก่ย่างฟืน ซอสให้',    price:45000, cat:'grill',   emoji:'🍗', stock:20, status:'active'  },
    { id:9,  name:'ปาหนึ่ง',       desc:'ปาต้ม เครื่องจ้ำ',      price:60000, cat:'grill',   emoji:'🐟', stock:3,  status:'soldout' },
    { id:10, name:'เบียลาว',       desc:'เบียขวด 640ml',          price:20000, cat:'drink',   emoji:'🍺', stock:80, status:'active'  },
    { id:11, name:'น้ำผลไม้',      desc:'ส้ม/มะนาว เย็น',        price:15000, cat:'drink',   emoji:'🧃', stock:60, status:'active'  },
    { id:12, name:'น้ำดื่ม',       desc:'น้ำเย็น 600ml',          price:5000,  cat:'drink',   emoji:'💧', stock:100,status:'active'  },
    { id:13, name:'ข้าวหนม',       desc:'ข้าวหนมห่อย่อย',        price:8000,  cat:'dessert', emoji:'🍡', stock:15, status:'active'  },
    { id:14, name:'ข้าวต้ม',       desc:'ข้าวต้มมะนาว',           price:12000, cat:'dessert', emoji:'🧆', stock:0,  status:'soldout' },
  ],

  orders: generateSampleOrders(),

  stockLog: [
    { id:1, productId:1, productName:'ข้าวเหนียว', type:'in',  qty:50, note:'รับสินค้าใหม่',    date:'2025-01-15 08:00' },
    { id:2, productId:7, productName:'ก๋วยจั๊บ',   type:'out', qty:5,  note:'ขายออกไป',         date:'2025-01-15 09:30' },
    { id:3, productId:9, productName:'ปาหนึ่ง',    type:'set', qty:3,  note:'ตั้งค่าใหม่จากนับ', date:'2025-01-14 17:00' },
  ],

  currentUser: null,
  orderNum: 100,
};

function generateSampleOrders() {
  const items = [
    ['ข้าวเหนียว x2, ลาบหมู x1', 50000],
    ['เฝอไก่ x2', 50000],
    ['ไก่ย่าง x1, เบียลาว x2', 85000],
    ['ข้าวผัด x1, น้ำดื่ม x2', 45000],
    ['ก๋วยจั๊บ x2, น้ำผลไม้ x1', 75000],
    ['ข้าวหมู x2, ข้าวหนม x2', 76000],
    ['ต้มยำ x1, เบียลาว x1', 70000],
    ['ปาหนึ่ง x1, ข้าวเหนียว x3', 75000],
  ];
  const statuses = ['done','done','done','done','pending','cancel'];
  const tables = ['A1','A2','B1','B3','C2','9A7F5A'];
  const orders = [];
  const now = Date.now();
  for (let i = 0; i < 40; i++) {
    const item = items[i % items.length];
    const vat  = Math.round(item[1] * 0.07);
    const ms   = now - (i * 3600000 * 2 + Math.random() * 3600000);
    const d    = new Date(ms);
    orders.push({
      id: 1000 + i,
      num: String(1000 + i),
      table: tables[i % tables.length],
      items: item[0],
      subtotal: item[1],
      vat,
      total: item[1] + vat,
      time: d.toLocaleString('th-TH'),
      date: d.toLocaleDateString('th-TH'),
      status: statuses[i % statuses.length],
    });
  }
  return orders.reverse();
}

// ════════════════════════════════
// 2. AUTH
// ════════════════════════════════
// Build lang switcher on the login screen immediately (before login)
document.addEventListener('DOMContentLoaded', () => {
  const loginLangMount = document.getElementById('loginLangMount');
  if (loginLangMount) i18n.buildSwitcher(loginLangMount);
});

function doLogin() {
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value;
  const user = POS_DB.users.authenticate(u, p);
  if (!user || user.status !== 'active') {
    document.getElementById('loginError').textContent = 'Username หรือ Password ไม่ถูกต้อง';
    return;
  }
  DB.currentUser = user;
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('appShell').style.display = 'flex';

  // Show mobile nav based on screen size
  updateNavVisibility();

  document.getElementById('sbUserName').textContent = user.name;
  document.getElementById('sbAvatar').textContent   = user.name[0].toUpperCase();
  document.getElementById('tbAvatar').textContent   = user.name[0].toUpperCase();

  // Build language switcher in topbar
  const mount = document.getElementById('langMount');
  if (mount && !mount.hasChildNodes()) {
    i18n.buildSwitcher(mount);
  }

  // Re-render on language change
  window.addEventListener('langchange', () => {
    const active = document.querySelector('.page.active');
    if (active) {
      const page = active.id.replace('page-', '');
      switch(page) {
        case 'dashboard':  renderDashboard();   break;
        case 'orders':     renderOrdersPage();  break;
        case 'products':   renderProductsPage();break;
        case 'inventory':  renderInventoryPage();break;
        case 'reports':    renderReportsPage(); break;
        case 'users':      renderUsersPage();   break;
      }
      // Update breadcrumb title
      const info = pageMap[page];
      if (info) document.getElementById('tbTitle').textContent = i18n.t(info.key || 'admin.dashboard');
    }
    // Update sidebar nav labels
    document.querySelectorAll('.sb-item[data-page]').forEach(btn => {
      const labelEl = btn.querySelector('.sb-label');
      if (labelEl && labelEl.dataset.i18n) labelEl.textContent = i18n.t(labelEl.dataset.i18n);
    });
  });

  navTo('dashboard', null);
  startClock();
  updateOrderBadge();
}

function doLogout() {
  if (!confirm('ออกจากระบบ?')) return;
  DB.currentUser = null;
  document.getElementById('appShell').style.display = 'none';
  document.getElementById('loginScreen').style.display = 'flex';
  document.getElementById('loginError').textContent = '';
}

function togglePw() {
  const inp = document.getElementById('loginPass');
  inp.type = inp.type === 'password' ? 'text' : 'password';
}

// ════════════════════════════════
// 3. NAVIGATION
// ════════════════════════════════
const pageMap = {
  dashboard: { icon:'📊', title:'Dashboard',      i18nKey:'admin.dashboard' },
  orders:    { icon:'📦', title:'คำสั่งซื้อ',      i18nKey:'admin.orders'    },
  products:  { icon:'🍽️', title:'สินค้า / เมนู',  i18nKey:'admin.products'  },
  inventory: { icon:'📋', title:'สต็อกสินค้า',     i18nKey:'admin.inventory' },
  reports:   { icon:'📈', title:'รายงาน',           i18nKey:'admin.reports'   },
  users:     { icon:'👥', title:i18n.t('admin.users'),        i18nKey:'admin.users'     },
  settings:  { icon:'⚙️', title:'ตั้งค่า',          i18nKey:'admin.settings'  },
};

function navTo(page, el) {
  // Update pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('page-' + page);
  if (pg) pg.classList.add('active');

  // Update sidebar items
  document.querySelectorAll('.sb-item').forEach(b => {
    b.classList.toggle('active', b.dataset.page === page);
  });
  // Update mobile nav
  document.querySelectorAll('.mn-item').forEach(b => {
    b.classList.toggle('active', b.dataset.page === page);
  });

  // Update topbar
  const info = pageMap[page] || { icon:'⚡', title: page };
  document.getElementById('tbIcon').textContent  = info.icon;
  document.getElementById('tbTitle').textContent = i18n.t(info.key || 'admin.dashboard');

  // Scroll to top
  document.getElementById('pageContent').scrollTo({ top: 0, behavior: 'smooth' });

  // Close mobile sidebar
  closeMobileMenu();

  // Render page content
  switch (page) {
    case 'dashboard': renderDashboard(); break;
    case 'orders':    renderOrdersPage(); break;
    case 'products':  renderProductsPage(); break;
    case 'inventory': renderInventoryPage(); break;
    case 'reports':   renderReportsPage(); break;
    case 'users':     renderUsersPage(); break;
  }
}

// ════════════════════════════════
// 4. SIDEBAR COLLAPSE
// ════════════════════════════════
let sidebarCollapsed = false;
function toggleSidebar() {
  sidebarCollapsed = !sidebarCollapsed;
  document.getElementById('sidebar').classList.toggle('collapsed', sidebarCollapsed);
}

function toggleMobileMenu() {
  const sb  = document.getElementById('sidebar');
  const ov  = document.getElementById('mobOverlay');
  const open = sb.classList.toggle('mobile-open');
  ov.classList.toggle('show', open);
}
function closeMobileMenu() {
  document.getElementById('sidebar').classList.remove('mobile-open');
  document.getElementById('mobOverlay').classList.remove('show');
}

function updateNavVisibility() {
  const isMobile = window.innerWidth <= 768;
  document.getElementById('mobileNav').style.display = isMobile ? 'grid' : 'none';
}
window.addEventListener('resize', updateNavVisibility);

// ════════════════════════════════
// 5. CLOCK
// ════════════════════════════════
function startClock() {
  function tick() {
    const now = new Date();
    document.getElementById('tbDatetime').textContent =
      now.toLocaleDateString('th-TH') + '  ' + now.toLocaleTimeString('th-TH');
  }
  tick();
  setInterval(tick, 1000);
}

// ════════════════════════════════
// 6. DASHBOARD
// ════════════════════════════════
function renderDashboard() {
  const orders   = POS_DB.orders.getAll();
  const done     = orders.filter(o => o.status === 'done');
  const today    = new Date().toLocaleDateString('th-TH');
  const todayOrd = done.filter(o => o.date === today);
  const todayRev = todayOrd.reduce((s, o) => s + o.total, 0);
  const allRev   = done.reduce((s, o) => s + o.total, 0);
  const pending  = orders.filter(o => o.status === 'pending').length;
  const lowStock = DB.products.filter(p => p.stock <= 5).length;

  // KPI
  const kpiGrid = document.getElementById('kpiGrid');
  kpiGrid.innerHTML = kpiCard('💰', fmt(todayRev), i18n.t('rep.revenue'), '+12%', 'up')
    + kpiCard('📦', orders.length, i18n.t('dash.orders'), pending + ' ' + i18n.t('status.pending'), 'neu', true)
    + kpiCard('🍽️', POS_DB.products.getAll().filter(p=>p.status==='active').length, i18n.t('admin.products'), lowStock + ' ' + i18n.t('products.status'), lowStock > 0 ? 'down' : 'neu')
    + kpiCard('👥', POS_DB.users.getAll().filter(u=>u.status==='active').length, i18n.t('admin.users'), 'Active', 'up');

  // Recent orders table
  const recent = orders.slice(0, 8);
  document.getElementById('dashOrdersTable').innerHTML =
    orderTableHead() + `<tbody>${recent.map(orderRow).join('')}</tbody>`;

  // Charts — use rAF so canvas reads correct clientWidth after layout paint
  requestAnimationFrame(() => requestAnimationFrame(() => {
    drawSalesChart('salesChart', 'week');
    drawTopChart('topChart');
  }));

  updateOrderBadge();
}

function kpiCard(icon, val, lbl, change, dir, isAccent = false) {
  return `
  <div class="kpi-card ${isAccent ? 'accent-card' : ''}">
    <div class="kpi-top">
      <span class="kpi-icon">${icon}</span>
      <span class="kpi-change ${dir}">${change}</span>
    </div>
    <div class="kpi-val ${String(val).length > 8 ? 'sm' : ''}">${val}</div>
    <div class="kpi-lbl">${lbl}</div>
  </div>`;
}

// ════════════════════════════════
// 7. CHARTS (Canvas)
// ════════════════════════════════
let salesChartInstance = null;
let topChartInstance   = null;
let reportChartInstance = null;
let catChartInstance    = null;

function switchChart(mode, btn) {
  document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  drawSalesChart('salesChart', mode);
}

function drawSalesChart(canvasId, mode) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Generate labels & data
  const days = mode === 'week' ? 7 : 30;
  const labels = [], values = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const label = mode === 'week'
      ? ['อา','จ','อ','พ','พฤ','ศ','ส'][d.getDay()]
      : d.getDate() + '';
    labels.push(label);
    // Sum orders for this day
    const dateStr = d.toLocaleDateString('th-TH');
    const dayTotal = DB.orders
      .filter(o => o.status === 'done' && o.date === dateStr)
      .reduce((s, o) => s + o.total, 0);
    values.push(dayTotal || Math.round(Math.random() * 400000 + 50000)); // demo fallback
  }

  drawBarChart(ctx, canvas, labels, values, '#ff6b35', '#ffb347');
}

function drawTopChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  // Count item frequency
  const freq = {};
  DB.orders.filter(o => o.status === 'done').forEach(o => {
    o.items.split(', ').forEach(i => {
      const n = i.split(' x')[0];
      freq[n] = (freq[n] || 0) + 1;
    });
  });
  const sorted = Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0,5);
  const labels = sorted.map(x => x[0]);
  const values = sorted.map(x => x[1]);
  drawHorizBar(ctx, canvas, labels, values);
}

function drawBarChart(ctx, canvas, labels, values, color1, color2) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W   = canvas.clientWidth  || 400;
  const H   = canvas.clientHeight || 200;
  if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const pad = { top:20, right:10, bottom:36, left:60 };
  const cW  = W - pad.left - pad.right;
  const cH  = H - pad.top  - pad.bottom;
  const max  = Math.max(...values) * 1.15 || 1;
  const barW = (cW / labels.length) * 0.55;
  const gap  = cW / labels.length;

  ctx.clearRect(0, 0, W, H);

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + cH - (cH * i / 4);
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
    ctx.fillStyle = 'rgba(160,160,184,0.6)';
    ctx.font = `${10 * window.devicePixelRatio / window.devicePixelRatio}px DM Mono`;
    ctx.textAlign = 'right';
    ctx.fillText(fmtK(max * i / 4), pad.left - 6, y + 4);
  }

  // Bars
  labels.forEach((lbl, i) => {
    const bH = (values[i] / max) * cH;
    const x  = pad.left + i * gap + (gap - barW) / 2;
    const y  = pad.top + cH - bH;

    // Bar gradient
    const grad = ctx.createLinearGradient(0, y, 0, y + bH);
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2 + '88');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barW, bH, [4, 4, 0, 0]);
    ctx.fill();

    // Label
    ctx.fillStyle = 'rgba(160,160,184,0.8)';
    ctx.font = '10px Noto Sans Thai';
    ctx.textAlign = 'center';
    ctx.fillText(lbl, x + barW / 2, pad.top + cH + 16);
  });
}

function drawHorizBar(ctx, canvas, labels, values) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W   = canvas.clientWidth  || 280;
  const H   = canvas.clientHeight || 200;
  if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const max    = Math.max(...values) || 1;
  const rowH   = H / labels.length;
  const pad    = { left: 90, right: 40, top: 8, bar: 14 };
  const colors = ['#ff6b35','#ffb347','#3498db','#2ecc71','#9b59b6'];

  ctx.clearRect(0, 0, W, H);

  labels.forEach((lbl, i) => {
    const y   = i * rowH + rowH / 2;
    const bW  = ((values[i] / max) * (W - pad.left - pad.right));

    // Label
    ctx.fillStyle = 'rgba(160,160,184,0.85)';
    ctx.font = '10px Noto Sans Thai';
    ctx.textAlign = 'right';
    const truncated = lbl.length > 7 ? lbl.substring(0,7)+'…' : lbl;
    ctx.fillText(truncated, pad.left - 8, y + 4);

    // Bar bg
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.beginPath();
    ctx.roundRect(pad.left, y - pad.bar/2, W - pad.left - pad.right, pad.bar, 4);
    ctx.fill();

    // Bar
    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.roundRect(pad.left, y - pad.bar/2, bW, pad.bar, 4);
    ctx.fill();

    // Value
    ctx.fillStyle = '#ffb347';
    ctx.font = 'bold 10px DM Mono';
    ctx.textAlign = 'left';
    ctx.fillText(values[i], pad.left + bW + 6, y + 4);
  });
}

function drawCategoryChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const W   = canvas.clientWidth  || 280;
  const H   = canvas.clientHeight || 220;
  if (canvas.width !== W * dpr || canvas.height !== H * dpr) {
    canvas.width  = W * dpr;
    canvas.height = H * dpr;
  }
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const catNames = { rice:'ข้าว', noodle:'เฝอ/ก๋วย', grill:'ปิ้ง', drink:'เครื่องดื่ม', dessert:'ของหวาน' };
  const catColors= ['#ff6b35','#ffb347','#3498db','#2ecc71','#9b59b6'];
  const cats = Object.keys(catNames);

  const freq = {};
  cats.forEach(c => freq[c] = 0);
  DB.orders.filter(o => o.status === 'done').forEach(o => {
    o.items.split(', ').forEach(it => {
      const pName = it.split(' x')[0];
      const p = DB.products.find(pr => pr.name === pName);
      if (p && freq[p.cat] !== undefined) freq[p.cat]++;
    });
  });

  const total  = cats.reduce((s, c) => s + freq[c], 0) || 1;
  const cx = W/2, cy = H/2 - 10, r = Math.min(W, H) * 0.32;

  ctx.clearRect(0, 0, W, H);

  let angle = -Math.PI / 2;
  cats.forEach((cat, i) => {
    const slice = (freq[cat] / total) * Math.PI * 2;
    ctx.fillStyle = catColors[i];
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, r, angle, angle + slice);
    ctx.closePath();
    ctx.fill();

    // Stroke
    ctx.strokeStyle = 'rgba(12,12,16,0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();
    angle += slice;
  });

  // Legend
  cats.forEach((cat, i) => {
    const x = 10 + (i % 3) * (W / 3);
    const y = cy + r + 16 + Math.floor(i / 3) * 16;
    ctx.fillStyle = catColors[i];
    ctx.fillRect(x, y, 10, 10);
    ctx.fillStyle = 'rgba(160,160,184,0.8)';
    ctx.font = '9px Noto Sans Thai';
    ctx.textAlign = 'left';
    const pct = total > 0 ? Math.round(freq[cat]/total*100) : 0;
    ctx.fillText(catNames[cat] + ' ' + pct + '%', x + 13, y + 9);
  });
}

// ════════════════════════════════
// 8. ORDERS PAGE
// ════════════════════════════════
function orderTableHead() {
  return `<thead><tr>
    <th>Order #</th><th>โต๊ะ</th><th>รายการ</th>
    <th>ยอดรวม</th><th>เวลา</th><th>สถานะ</th><th>จัดการ</th>
  </tr></thead>`;
}

function orderRow(o) {
  const badge = o.status === 'done' ? 'badge-green' : o.status === 'cancel' ? 'badge-red' : 'badge-yellow';
  const label = o.status === 'done' ? `✅ ${i18n.t('status.done')}` : o.status === 'cancel' ? `❌ ${i18n.t('status.cancel')}` : `⏳ ${i18n.t('status.pending')}`;
  return `<tr>
    <td><b class="mono">#${o.num}</b></td>
    <td><span class="badge badge-blue">${o.table}</span></td>
    <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text2);font-size:0.8rem">${o.items}</td>
    <td><b>${fmt(o.total)}</b> <span style="color:var(--muted);font-size:0.75rem">ກີບ</span></td>
    <td style="color:var(--muted);font-size:0.78rem;white-space:nowrap">${o.time}</td>
    <td><span class="badge ${badge}">${label}</span></td>
    <td><div class="tbl-actions">
      <button class="tbl-btn" onclick="viewOrder(${o.id})">📄 ดู</button>
      ${o.status === 'pending' ? `<button class="tbl-btn" onclick="completeOrder(${o.id})">✅</button>
      <button class="tbl-btn danger" onclick="cancelOrder(${o.id})">❌</button>` : ''}
    </div></td>
  </tr>`;
}

function renderOrdersPage() {
  const f = document.getElementById('orderStatusFilter')?.value || 'all';
  let orders = f === 'all' ? DB.orders : DB.orders.filter(o => o.status === f);
  const tbody = `<tbody>${orders.map(orderRow).join('')}</tbody>`;
  document.getElementById('ordersTable').innerHTML = orderTableHead() + tbody;
  document.getElementById('ordersEmpty').style.display = orders.length ? 'none' : 'block';
}

function viewOrder(id) {
  const o = DB.orders.find(x => x.id === id);
  if (!o) return;
  document.getElementById('odTitle').textContent = 'Order #' + o.num;
  document.getElementById('odBody').innerHTML = `
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;font-size:0.85rem">
      <div><span style="color:var(--muted)">Order:</span> <b>#${o.num}</b></div>
      <div><span style="color:var(--muted)">โต๊ะ:</span> <b>${o.table}</b></div>
      <div><span style="color:var(--muted)">เวลา:</span> ${o.time}</div>
      <div><span style="color:var(--muted)">สถานะ:</span> ${o.status}</div>
    </div>
    <div style="margin-top:14px;padding:12px;background:var(--surface2);border-radius:10px;font-size:0.85rem">
      <b>รายการ:</b><br>${o.items.split(', ').map(i => '• ' + i).join('<br>')}
    </div>
    <div style="margin-top:10px;font-size:0.85rem;display:flex;flex-direction:column;gap:5px">
      <div style="display:flex;justify-content:space-between"><span>ราคา</span><span>${fmt(o.subtotal)} ກີບ</span></div>
      <div style="display:flex;justify-content:space-between"><span>VAT 7%</span><span>${fmt(o.vat)} ກີບ</span></div>
      <div style="display:flex;justify-content:space-between;font-weight:700;border-top:1px solid var(--border);padding-top:8px">
        <span>รวมทั้งหมด</span><span style="color:var(--accent2)">${fmt(o.total)} ກີບ</span>
      </div>
    </div>`;
  openModal('orderDetailModal');
}

function completeOrder(id) {
  const o = DB.orders.find(x => x.id === id);
  if (o) { POS_DB.orders.updateStatus(id, 'done'); renderOrdersPage(); updateOrderBadge(); showToast('✅ ยืนยัน Order #' + o.num); }
}
function cancelOrder(id) {
  const o = DB.orders.find(x => x.id === id);
  if (o && confirm('ยกเลิก Order #' + o.num + '?')) {
    POS_DB.orders.updateStatus(id, 'cancel'); renderOrdersPage(); updateOrderBadge(); showToast('❌ ยกเลิก Order #' + o.num);
  }
}

function updateOrderBadge() {
  const pending = DB.orders.filter(o => o.status === 'pending').length;
  const badge = document.getElementById('sbBadgeOrders');
  badge.textContent = pending;
  badge.dataset.count = pending;
}

function printReceipt() {
  showToast('🖨️ กำลังส่งไปยังเครื่องพิมพ์...'); closeModal('orderDetailModal');
}

// ════════════════════════════════
// 9. PRODUCTS PAGE
// ════════════════════════════════
function renderProductsPage() {
  const q   = (document.getElementById('productSearch')?.value || '').toLowerCase();
  const cat = document.getElementById('productCatFilter')?.value || 'all';

  const filtered = POS_DB.products.getAll().filter(p => {
    const matchQ   = !q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q);
    const matchCat = cat === 'all' || p.cat === cat;
    return matchQ && matchCat;
  });

  const statusBadge = s => {
    if (s === 'active')  return `<span class="badge badge-green">✅ ${i18n.t('products.active')}</span>`;
    if (s === 'soldout') return `<span class="badge badge-red">❌ ${i18n.t('products.soldout')}</span>`;
    return `<span class="badge badge-gray">🚫 ${i18n.t('products.hidden')}</span>`;
  };
  const catLabel = { rice:'🍚 ข้าว', noodle:'🍜 เฝอ', grill:'🔥 ปิ้ง', drink:'🥤 ดื่ม', dessert:'🍮 หวาน' };

  const thead = `<thead><tr><th>${i18n.t('products.name')}</th><th>${i18n.t('products.cat')}</th><th>${i18n.t('products.price')}</th><th>${i18n.t('products.stock')}</th><th>${i18n.t('products.status')}</th><th>${i18n.t('orders.manage')}</th></tr></thead>`;
  const tbody = `<tbody>${filtered.map(p => `<tr>
    <td><div style="display:flex;align-items:center;gap:10px">
      <span style="font-size:1.5rem">${p.emoji}</span>
      <div><div style="font-weight:600">${p.name}</div><div style="font-size:0.75rem;color:var(--muted)">${p.desc}</div></div>
    </div></td>
    <td style="font-size:0.82rem">${catLabel[p.cat] || p.cat}</td>
    <td><b>${fmt(p.price)}</b> <span style="color:var(--muted);font-size:0.75rem">ກີບ</span></td>
    <td><span style="color:${p.stock <= 5 ? 'var(--red)' : p.stock <= 20 ? 'var(--yellow)' : 'var(--green)'}; font-weight:600">${p.stock}</span></td>
    <td>${statusBadge(p.status)}</td>
    <td><div class="tbl-actions">
      <button class="tbl-btn" onclick="openProductModal(${p.id})">✏️ แก้ไข</button>
      <button class="tbl-btn danger" onclick="deleteProduct(${p.id})">🗑️</button>
    </div></td>
  </tr>`).join('')}</tbody>`;

  document.getElementById('productsTable').innerHTML = thead + tbody;
}

function openProductModal(id = null) {
  document.getElementById('productModalTitle').textContent = id ? 'แก้ไขสินค้า' : 'เพิ่มสินค้า';
  if (id) {
    const p = DB.products.find(x => x.id === id);
    if (!p) return;
    document.getElementById('pmId').value    = p.id;
    document.getElementById('pmName').value  = p.name;
    document.getElementById('pmPrice').value = p.price;
    document.getElementById('pmDesc').value  = p.desc;
    document.getElementById('pmCat').value   = p.cat;
    document.getElementById('pmStock').value = p.stock;
    document.getElementById('pmStatus').value= p.status;
  } else {
    ['pmId','pmName','pmPrice','pmDesc','pmStock'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('pmStatus').value = 'active';
  }
  openModal('productModal');
}

function saveProduct() {
  const id    = document.getElementById('pmId').value;
  const name  = document.getElementById('pmName').value.trim();
  const price = parseInt(document.getElementById('pmPrice').value);
  const desc  = document.getElementById('pmDesc').value.trim();
  const cat   = document.getElementById('pmCat').value;
  const stock = parseInt(document.getElementById('pmStock').value) || 0;
  const status= document.getElementById('pmStatus').value;
  const emojis= { rice:'🍽️', noodle:'🍜', grill:'🔥', drink:'🥤', dessert:'🍮' };

  if (!name || isNaN(price)) { showToast('⚠️ กรอกข้อมูลให้ครบ'); return; }

  if (id) {
    const p = DB.products.find(x => x.id === parseInt(id));
    POS_DB.products.update(parseInt(id), { name, price, desc, cat, stock, status });
    showToast('✅ แก้ไข ' + name + ' แล้ว');
  } else {
    POS_DB.products.add({ name, price, desc, cat, stock, status, emoji: emojis[cat] || '🍽️' });
    showToast('✅ เพิ่ม ' + name + ' แล้ว');
  }
  closeModal('productModal');
  renderProductsPage();
}

function deleteProduct(id) {
  const p = DB.products.find(x => x.id === id);
  if (!p || !confirm('ลบ ' + p.name + '?')) return;
  POS_DB.products.delete(id);
  renderProductsPage();
  showToast('🗑️ ลบ ' + p.name + ' แล้ว');
}

// ════════════════════════════════
// 10. INVENTORY PAGE
// ════════════════════════════════
function renderInventoryPage() {
  // Alert for low stock
  const low = DB.products.filter(p => p.stock <= 5);
  const alertEl = document.getElementById('stockAlert');
  if (low.length > 0) {
    alertEl.classList.add('show');
    alertEl.textContent = '⚠️ สินค้าใกล้หมด: ' + low.map(p => p.name + ' (' + p.stock + ')').join(', ');
  } else {
    alertEl.classList.remove('show');
  }

  // Stock table
  const thead = `<thead><tr><th>${i18n.t('products.name')}</th><th>${i18n.t('products.cat')}</th><th>${i18n.t('products.stock')}</th><th>${i18n.t('products.status')}</th><th>${i18n.t('orders.manage')}</th></tr></thead>`;
  const catLabel = { rice:'ข้าว', noodle:'เฝอ', grill:'ปิ้ง', drink:'ดื่ม', dessert:'หวาน' };
  const tbody = `<tbody>${DB.products.map(p => {
    const lvl = p.stock <= 0 ? 'badge-red' : p.stock <= 5 ? 'badge-yellow' : p.stock <= 20 ? 'badge-blue' : 'badge-green';
    return `<tr>
      <td><div style="display:flex;align-items:center;gap:8px">${p.emoji} <b>${p.name}</b></div></td>
      <td style="color:var(--muted);font-size:0.82rem">${catLabel[p.cat]}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="badge ${lvl}" style="font-size:0.85rem;padding:4px 12px">${p.stock}</span>
          <div style="flex:1;max-width:80px;height:6px;background:var(--surface3);border-radius:4px;overflow:hidden">
            <div style="height:100%;width:${Math.min(p.stock/100*100,100)}%;background:${p.stock<=5?'var(--red)':p.stock<=20?'var(--yellow)':'var(--green)'};border-radius:4px"></div>
          </div>
        </div>
      </td>
      <td>${p.status === 'active' ? `<span class="badge badge-green">✅ ${i18n.t('products.active')}</span>` : `<span class="badge badge-red">❌ ${i18n.t('products.soldout')}</span>`}</td>
      <td><button class="tbl-btn" onclick="quickStock(${p.id})">📦 ปรับ</button></td>
    </tr>`;
  }).join('')}</tbody>`;
  document.getElementById('inventoryTable').innerHTML = thead + tbody;

  // Stock log
  const logHead = `<thead><tr><th>สินค้า</th><th>ประเภท</th><th>จำนวน</th><th>หมายเหตุ</th><th>วันที่</th></tr></thead>`;
  const logBody = `<tbody>${POS_DB.stockLog.getAll().map(l => `<tr>
    <td><b>${l.productName}</b></td>
    <td><span class="badge ${l.type==='in'?'badge-green':l.type==='out'?'badge-red':'badge-blue'}">${l.type==='in'?'▲ เข้า':l.type==='out'?'▼ ออก':'= ตั้งค่า'}</span></td>
    <td><b>${l.qty}</b></td>
    <td style="color:var(--muted);font-size:0.82rem">${l.note}</td>
    <td style="color:var(--muted);font-size:0.78rem">${l.date}</td>
  </tr>`).join('')}</tbody>`;
  document.getElementById('stockLogTable').innerHTML = logHead + logBody;
}

function openStockModal() {
  // Populate product dropdown
  const sel = document.getElementById('smProduct');
  sel.innerHTML = DB.products.map(p => `<option value="${p.id}">${p.emoji} ${p.name} (สต็อก: ${p.stock})</option>`).join('');
  openModal('stockModal');
}
function quickStock(id) {
  const sel = document.getElementById('smProduct');
  sel.innerHTML = DB.products.map(p => `<option value="${p.id}" ${p.id===id?'selected':''}>${p.emoji} ${p.name} (สต็อก: ${p.stock})</option>`).join('');
  openModal('stockModal');
}

function saveStock() {
  const pId  = parseInt(document.getElementById('smProduct').value);
  const type = document.getElementById('smType').value;
  const qty  = parseInt(document.getElementById('smQty').value);
  const note = document.getElementById('smNote').value.trim() || 'ปรับสต็อก';
  if (isNaN(qty) || qty < 0) { showToast('⚠️ ใส่จำนวน'); return; }

  const p = DB.products.find(x => x.id === pId);
  if (!p) return;

  let newStock = p.stock;
  if (type === 'in')  newStock += qty;
  else if (type === 'out') newStock = Math.max(0, p.stock - qty);
  else newStock = qty;
  const newStatus = newStock === 0 ? 'soldout' : (p.status === 'soldout' ? 'active' : p.status);
  POS_DB.products.update(pId, { stock: newStock, status: newStatus });

  POS_DB.stockLog.add({ productId: p.id, productName: p.name, type, qty, note });

  closeModal('stockModal');
  renderInventoryPage();
  showToast('✅ ปรับสต็อก ' + p.name + ' แล้ว');
}

// ════════════════════════════════
// 11. REPORTS PAGE
// ════════════════════════════════
function renderReportsPage() {
  const period = parseInt(document.getElementById('reportPeriod')?.value || 7);
  const cutoff = Date.now() - period * 86400000;
  const filtered = DB.orders.filter(o => o.status === 'done');

  const revenue = filtered.reduce((s, o) => s + o.total, 0);
  const count   = filtered.length;
  const avg     = count ? Math.round(revenue / count) : 0;
  const freq = {};
  filtered.forEach(o => o.items.split(', ').forEach(i => {
    const n = i.split(' x')[0]; freq[n] = (freq[n]||0)+1;
  }));
  const top = Object.entries(freq).sort((a,b)=>b[1]-a[1])[0];

  document.getElementById('reportKpi').innerHTML =
    kpiCard('💰', fmt(revenue), 'ยอดขายทั้งหมด (ກີບ)', '', 'neu', true)
    + kpiCard('📦', count, i18n.t('rep.orders'), '', 'up')
    + kpiCard('📊', fmt(avg), i18n.t('rep.avg'), 'ກີບ', 'neu')
    + kpiCard('🏆', top ? top[0] : '—', 'สินค้าขายดี', top ? top[1]+' ครั้ง' : '', 'up');

  // Table
  const thead = `<thead><tr><th>#</th><th>โต๊ะ</th><th>รายการ</th><th>ยอดรวม</th><th>วันที่</th></tr></thead>`;
  const tbody = `<tbody>${filtered.slice(0,20).map(o => `<tr>
    <td><b class="mono">#${o.num}</b></td>
    <td><span class="badge badge-blue">${o.table}</span></td>
    <td style="color:var(--text2);font-size:0.8rem;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${o.items}</td>
    <td><b>${fmt(o.total)}</b> ກີບ</td>
    <td style="color:var(--muted);font-size:0.78rem">${o.time}</td>
  </tr>`).join('')}</tbody>`;
  document.getElementById('reportTable').innerHTML = thead + tbody;

  requestAnimationFrame(() => requestAnimationFrame(() => {
    drawSalesChart('reportChart', 'week');
    drawCategoryChart('catChart');
  }));
}

function exportCSV() {
  const rows = [['Order#','Table','Items','Total','Time','Status']];
  DB.orders.forEach(o => rows.push([o.num, o.table, '"'+o.items+'"', o.total, o.time, o.status]));
  const csv = rows.map(r => r.join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'orders_export.csv'; a.click();
  showToast('⬇ Export CSV แล้ว');
}

// ════════════════════════════════
// 12. USERS PAGE
// ════════════════════════════════
function renderUsersPage() {
  const roleLabel = { admin:`⚡ ${i18n.t('users.role.admin')}`, manager:`👔 ${i18n.t('users.role.mgr')}`, cashier:`🏪 ${i18n.t('users.role.cash')}` };
  const thead = `<thead><tr><th>${i18n.t('admin.users')}</th><th>${i18n.t('users.username')}</th><th>${i18n.t('users.role')}</th><th>${i18n.t('products.status')}</th><th>${i18n.t('users.last.login')}</th><th>${i18n.t('orders.manage')}</th></tr></thead>`;
  const tbody = `<tbody>${DB.users.map(u => `<tr>
    <td><div style="display:flex;align-items:center;gap:10px">
      <div style="width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,var(--blue),#1a252f);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:0.9rem;flex-shrink:0">${u.name[0]}</div>
      <b>${u.name}</b>
    </div></td>
    <td style="font-family:'DM Mono',monospace;font-size:0.82rem;color:var(--text2)">${u.username}</td>
    <td><span class="badge badge-blue">${roleLabel[u.role]||u.role}</span></td>
    <td>${u.status==='active'?`<span class="badge badge-green">✅ ${i18n.t('users.active')}</span>`:`<span class="badge badge-red">🚫 ${i18n.t('users.inactive')}</span>`}</td>
    <td style="color:var(--muted);font-size:0.78rem">${u.lastLogin}</td>
    <td><div class="tbl-actions">
      <button class="tbl-btn" onclick="openUserModal(${u.id})">✏️</button>
      ${u.id !== DB.currentUser?.id ? `<button class="tbl-btn danger" onclick="deleteUser(${u.id})">🗑️</button>` : ''}
    </div></td>
  </tr>`).join('')}</tbody>`;
  document.getElementById('usersTable').innerHTML = thead + tbody;
}

function openUserModal(id = null) {
  document.getElementById('userModalTitle').textContent = id ? 'แก้ไขผู้ใช้' : 'เพิ่มผู้ใช้';
  if (id) {
    const u = DB.users.find(x => x.id === id);
    if (!u) return;
    document.getElementById('umId').value     = u.id;
    document.getElementById('umName').value   = u.name;
    document.getElementById('umUser').value   = u.username;
    document.getElementById('umPass').value   = '';
    document.getElementById('umRole').value   = u.role;
    document.getElementById('umStatus').value = u.status;
  } else {
    ['umId','umName','umUser','umPass'].forEach(id => document.getElementById(id).value = '');
    document.getElementById('umRole').value   = 'cashier';
    document.getElementById('umStatus').value = 'active';
  }
  openModal('userModal');
}

function saveUser() {
  const id     = document.getElementById('umId').value;
  const name   = document.getElementById('umName').value.trim();
  const uname  = document.getElementById('umUser').value.trim();
  const pass   = document.getElementById('umPass').value;
  const role   = document.getElementById('umRole').value;
  const status = document.getElementById('umStatus').value;
  if (!name || !uname) { showToast('⚠️ กรอกข้อมูลให้ครบ'); return; }

  if (id) {
    const u = DB.users.find(x => x.id === parseInt(id));
    POS_DB.users.update(parseInt(id), { name, username: uname, role, status });
    if (pass) POS_DB.users.update(parseInt(id), { password: pass });
    showToast('✅ แก้ไขผู้ใช้ ' + name + ' แล้ว');
  } else {
    if (!pass) { showToast('⚠️ ใส่รหัสผ่าน'); return; }
    POS_DB.users.add({ name, username: uname, password: pass, role, status });
    showToast('✅ เพิ่มผู้ใช้ ' + name + ' แล้ว');
  }
  closeModal('userModal');
  renderUsersPage();
}

function deleteUser(id) {
  const u = DB.users.find(x => x.id === id);
  if (!u || !confirm('ลบผู้ใช้ ' + u.name + '?')) return;
  POS_DB.users.delete(id);
  renderUsersPage();
  showToast('🗑️ ลบ ' + u.name + ' แล้ว');
}

// ════════════════════════════════
// 13. SETTINGS UTILS
// ════════════════════════════════
function confirmReset() {
  if (confirm('⚠️ รีเซ็ตข้อมูลทั้งหมด? ไม่สามารถย้อนกลับได้')) {
    POS_DB.reset(); showToast('🗑️ รีเซ็ตข้อมูลแล้ว');
    showToast('🗑️ รีเซ็ตข้อมูลแล้ว');
  }
}

// ════════════════════════════════
// 14. MODAL HELPERS
// ════════════════════════════════
function openModal(id) {
  document.getElementById(id).classList.add('show');
}
function closeModal(id) {
  document.getElementById(id).classList.remove('show');
}
// Close modal on overlay click
document.querySelectorAll?.('.modal-overlay')?.forEach(el => {
  el.addEventListener('click', e => {
    if (e.target === el) el.classList.remove('show');
  });
});

// ════════════════════════════════
// 15. TOAST
// ════════════════════════════════
function showToast(msg, duration = 2500) {
  const stack = document.getElementById('toastStack');
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  stack.appendChild(t);
  setTimeout(() => {
    t.style.opacity = '0'; t.style.transform = 'translateX(10px)';
    t.style.transition = 'all 0.3s';
    setTimeout(() => t.remove(), 300);
  }, duration);
}

// ════════════════════════════════
// 16. REFRESH
// ════════════════════════════════
function refreshPage() {
  const active = document.querySelector('.page.active');
  if (!active) return;
  const page = active.id.replace('page-','');
  navTo(page, null);
  showToast('🔄 รีเฟรชแล้ว');
}

// ════════════════════════════════
// 17. UTILS
// ════════════════════════════════
function fmt(n) {
  return Number(n).toLocaleString('th-TH');
}
function fmtK(n) {
  if (n >= 1000000) return (n/1000000).toFixed(1) + 'M';
  if (n >= 1000)    return (n/1000).toFixed(0) + 'K';
  return Math.round(n).toString();
}

// Keyboard shortcuts
document.addEventListener('keydown', e => {
  if (!DB.currentUser) return;
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.show').forEach(m => m.classList.remove('show'));
  }
});

// Close modals on overlay click (after DOM ready)
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.modal-overlay').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target === el) el.classList.remove('show');
    });
  });
});