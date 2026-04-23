/* ==========================================
   POS-SST ADMIN DASHBOARD — SCRIPT.JS
   Full logic: Auth, CRUD, Charts, Reports
   v2 — 100% i18n ready, multilingual mock data
   ========================================== */

'use strict';

// ════════════════════════════════
// 0. MULTILINGUAL HELPERS
// ════════════════════════════════
function localName(item) {
  if (!item) return '';
  if (typeof item.name === 'object') {
    return item.name[i18n.getLang()] || item.name.lo || item.name.th || item.name.en || '';
  }
  return item.name || '';
}
function localDesc(item) {
  if (!item) return '';
  if (typeof item.desc === 'object') {
    return item.desc[i18n.getLang()] || item.desc.lo || item.desc.th || item.desc.en || '';
  }
  return item.desc || '';
}

// ════════════════════════════════
// 1. MOCK DATA (Multilingual)
// ════════════════════════════════

let DB = {
  users: [
    { id:1, name:'Admin User',    username:'admin',   password:'1234', role:'admin',   status:'active',   lastLogin: '2025-01-15 09:00' },
    { id:2, name:'สมชาย ขายดี',  username:'somchai', password:'1234', role:'cashier', status:'active',   lastLogin: '2025-01-15 08:30' },
    { id:3, name:'Noy Manager',   username:'noy',     password:'1234', role:'manager', status:'inactive', lastLogin: '2025-01-10 14:00' },
  ],

  products: [
    { id:1,  name:{lo:'ຂ້າວໜຽວ',th:'ข้าวเหนียว',en:'Sticky Rice',zh:'糯米饭'}, desc:{lo:'ຂ້າວໜຽວຫຸງສຸກ',th:'ข้าวเหนียวหุงสุก',en:'Steamed sticky rice',zh:'蒸糯米饭'}, price:5000,  cat:'rice',    emoji:'🍚', stock:99, status:'active'  },
    { id:2,  name:{lo:'ຂ້າວຜັດ',th:'ข้าวผัด',en:'Fried Rice',zh:'炒饭'}, desc:{lo:'ຜັດໄຂ່ ຜັກ ສົດ',th:'ผัดไข่ ผัก สด',en:'Egg & veg fried rice',zh:'鸡蛋蔬菜炒饭'}, price:35000, cat:'rice',    emoji:'🍳', stock:50, status:'active'  },
    { id:3,  name:{lo:'ຂ້າວໝູ',th:'ข้าวหมู',en:'Pork Rice',zh:'猪肉饭'}, desc:{lo:'ຂ້າວໝູແດງ ຊອດ',th:'ข้าวหมูแดง ซอส',en:'BBQ pork over rice',zh:'叉烧饭'}, price:30000, cat:'rice',    emoji:'🥩', stock:40, status:'active'  },
    { id:4,  name:{lo:'ລາບໝູ',th:'ลาบหมู',en:'Pork Laab',zh:'猪肉拉帕'}, desc:{lo:'ດິບ / ສຸກ',th:'ดิบ / สุก',en:'Raw or cooked',zh:'生/熟'}, price:40000, cat:'rice',    emoji:'🥗', stock:30, status:'active'  },
    { id:5,  name:{lo:'ຕົ້ມຍຳ',th:'ต้มยำ',en:'Tom Yum',zh:'冬阴功'}, desc:{lo:'ກຸ້ງ ເຜັດຮ້ອນ',th:'กุ้ง เผ็ดร้อน',en:'Spicy shrimp soup',zh:'辣虾汤'}, price:50000, cat:'rice',    emoji:'🦐', stock:25, status:'active'  },
    { id:6,  name:{lo:'ເຝີໄກ່',th:'เฝอไก่',en:'Chicken Pho',zh:'鸡肉河粉'}, desc:{lo:'ນ້ຳສຸບໄກ່ ເສັ້ນໃຫຍ່',th:'น้ำซุปไก่ เส้นใหญ่',en:'Chicken broth noodles',zh:'鸡汤宽粉'}, price:25000, cat:'noodle',  emoji:'🍜', stock:35, status:'active'  },
    { id:7,  name:{lo:'ກ໋ວຍຈັ໊ບ',th:'ก๋วยจั๊บ',en:'Kuay Jab',zh:'卷粉汤'}, desc:{lo:'ເສັ້ນໃຫຍ່ ໝູ ໄຂ່',th:'เส้นใหญ่ หมู ไข่',en:'Wide noodle pork soup',zh:'宽粉猪肉汤'}, price:30000, cat:'noodle',  emoji:'🍲', stock:5,  status:'active'  },
    { id:8,  name:{lo:'ໄກ່ຍ່າງ',th:'ไก่ย่าง',en:'Grilled Chicken',zh:'烤鸡'}, desc:{lo:'ໄກ່ຍ່າງຟືນ ຊອດ',th:'ไก่ย่างฟืน ซอส',en:'Wood-fired chicken',zh:'柴火烤鸡'}, price:45000, cat:'grill',   emoji:'🍗', stock:20, status:'active'  },
    { id:9,  name:{lo:'ປາຕົ້ມ',th:'ปาต้ม',en:'Steamed Fish',zh:'清蒸鱼'}, desc:{lo:'ເຄື່ອງຈ້ຳ ຫອມ',th:'เครื่องจ้ำ หอม',en:'Steamed fish with herbs',zh:'香草蒸鱼'}, price:60000, cat:'grill',   emoji:'🐟', stock:3,  status:'soldout' },
    { id:10, name:{lo:'ເບຍລາວ',th:'เบียลาว',en:'Beerlao',zh:'老挝啤酒'}, desc:{lo:'ຂວດ 640ml ເຢັນ',th:'ขวด 640ml เย็น',en:'640ml bottle chilled',zh:'640ml冰镇'}, price:20000, cat:'drink',   emoji:'🍺', stock:80, status:'active'  },
    { id:11, name:{lo:'ນ້ຳໝາກໄມ້',th:'น้ำผลไม้',en:'Fruit Juice',zh:'果汁'}, desc:{lo:'ສົ້ມ / ໝາກນາວ ເຢັນ',th:'ส้ม / มะนาว เย็น',en:'Orange/lime chilled',zh:'橙汁/柠檬汁冰镇'}, price:15000, cat:'drink',   emoji:'🧃', stock:60, status:'active'  },
    { id:12, name:{lo:'ນ້ຳດ່ຽວ',th:'น้ำดื่ม',en:'Water',zh:'饮用水'}, desc:{lo:'ນ້ຳເຢັນ 600ml',th:'น้ำเย็น 600ml',en:'Cold water 600ml',zh:'冰水600ml'}, price:5000,  cat:'drink',   emoji:'💧', stock:100,status:'active'  },
    { id:13, name:{lo:'ຂ້າວໜົມ',th:'ข้าวหนม',en:'Rice Cake',zh:'米糕'}, desc:{lo:'ຂ້າວໜົມຫໍ່ ງາ',th:'ข้าวหนมห่อ งา',en:'Wrapped rice cake',zh:'芝麻糯米糕'}, price:8000,  cat:'dessert', emoji:'🍡', stock:15, status:'active'  },
    { id:14, name:{lo:'ຂ້າວຕົ້ມ',th:'ข้าวต้ม',en:'Rice Porridge',zh:'米粥'}, desc:{lo:'ຂ້າວຕົ້ມ ໝາກໂກ',th:'ข้าวต้ม มะพร้าว',en:'Coconut rice porridge',zh:'椰汁米粥'}, price:12000, cat:'dessert', emoji:'🧆', stock:0,  status:'soldout' },
  ],

  orders: generateSampleOrders(),

  stockLog: [
    { id:1, productId:1, productName:'ຂ້າວໜຽວ', type:'in',  qty:50, note:'ຮັບສິນຄ້າໃໝ່',    date:'2025-01-15 08:00' },
    { id:2, productId:7, productName:'ກ໋ວຍຈັ໊ບ',   type:'out', qty:5,  note:'ຂາຍອອກໄປ',         date:'2025-01-15 09:30' },
    { id:3, productId:9, productName:'ປາຕົ້ມ',    type:'set', qty:3,  note:'ຕັ້ງຄ່າໃໝ່ຈາກການນັບ', date:'2025-01-14 17:00' },
  ],

  currentUser: null,
  orderNum: 100,
};

function generateSampleOrders() {
  const items = [
    ['ຂ້າວໜຽວ x2, ລາບໝູ x1', 50000],
    ['ເຝີໄກ່ x2', 50000],
    ['ໄກ່ຍ່າງ x1, ເບຍລາວ x2', 85000],
    ['ຂ້າວຜັດ x1, ນ້ຳດ່ຽວ x2', 45000],
    ['ກ໋ວຍຈັ໊ບ x2, ນ້ຳໝາກໄມ້ x1', 75000],
    ['ຂ້າວໝູ x2, ຂ້າວໜົມ x2', 76000],
    ['ຕົ້ມຍຳ x1, ເບຍລາວ x1', 70000],
    ['ປາຕົ້ມ x1, ຂ້າວໜຽວ x3', 75000],
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
document.addEventListener('DOMContentLoaded', () => {
  const loginLangMount = document.getElementById('loginLangMount');
  if (loginLangMount) i18n.buildSwitcher(loginLangMount);
});

function doLogin() {
  const u = document.getElementById('loginUser').value.trim();
  const p = document.getElementById('loginPass').value;
  const user = POS_DB.users.authenticate(u, p);
  if (!user || user.status !== 'active') {
    document.getElementById('loginError').textContent = i18n.t('login.error');
    return;
  }
  DB.currentUser = user;
  document.getElementById('loginScreen').style.display = 'none';
  document.getElementById('appShell').style.display = 'flex';

  updateNavVisibility();

  document.getElementById('sbUserName').textContent = user.name;
  document.getElementById('sbAvatar').textContent   = user.name[0].toUpperCase();
  document.getElementById('tbAvatar').textContent   = user.name[0].toUpperCase();

  const mount = document.getElementById('langMount');
  if (mount && !mount.hasChildNodes()) {
    i18n.buildSwitcher(mount);
  }

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
      const info = pageMap[page];
      if (info) document.getElementById('tbTitle').textContent = i18n.t(info.i18nKey || 'admin.dashboard');
    }
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
  if (!confirm(i18n.t('toast.logoutconfirm'))) return;
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
  dashboard: { icon:'📊', i18nKey:'admin.dashboard' },
  orders:    { icon:'📦', i18nKey:'admin.orders'    },
  products:  { icon:'🍽️', i18nKey:'admin.products'  },
  inventory: { icon:'📋', i18nKey:'admin.inventory' },
  reports:   { icon:'📈', i18nKey:'admin.reports'   },
  users:     { icon:'👥', i18nKey:'admin.users'     },
  settings:  { icon:'⚙️', i18nKey:'admin.settings'  },
};

function navTo(page, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('page-' + page);
  if (pg) pg.classList.add('active');

  document.querySelectorAll('.sb-item').forEach(b => {
    b.classList.toggle('active', b.dataset.page === page);
  });
  document.querySelectorAll('.mn-item').forEach(b => {
    b.classList.toggle('active', b.dataset.page === page);
  });

  const info = pageMap[page] || { icon:'⚡', i18nKey:'admin.dashboard' };
  document.getElementById('tbIcon').textContent  = info.icon;
  document.getElementById('tbTitle').textContent = i18n.t(info.i18nKey);

  document.getElementById('pageContent').scrollTo({ top: 0, behavior: 'smooth' });
  closeMobileMenu();

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

  const kpiGrid = document.getElementById('kpiGrid');
  kpiGrid.innerHTML = kpiCard('💰', fmt(todayRev), i18n.t('dash.today.rev'), '+12%', 'up')
    + kpiCard('📦', orders.length, i18n.t('dash.total.orders'), pending + ' ' + i18n.t('status.pending'), 'neu', true)
    + kpiCard('🍽️', POS_DB.products.getAll().filter(p=>p.status==='active').length, i18n.t('dash.products'), lowStock + ' ' + i18n.t('products.status'), lowStock > 0 ? 'down' : 'neu')
    + kpiCard('👥', POS_DB.users.getAll().filter(u=>u.status==='active').length, i18n.t('admin.users'), 'Active', 'up');

  const recent = orders.slice(0, 8);
  document.getElementById('dashOrdersTable').innerHTML =
    orderTableHead() + `<tbody>${recent.map(orderRow).join('')}</tbody>`;

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
function switchChart(mode, btn) {
  document.querySelectorAll('.chart-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  drawSalesChart('salesChart', mode);
}

function drawSalesChart(canvasId, mode) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const days = mode === 'week' ? 7 : 30;
  const labels = [], values = [];
  const now = new Date();
  const dayNames = {
    lo: ['ອາ','ຈ','ອ','ພ','ພ຤','ສ','ສ'],
    th: ['อา','จ','อ','พ','พฤ','ศ','ส'],
    en: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
    zh: ['日','一','二','三','四','五','六']
  };
  const lang = i18n.getLang();
  const dn = dayNames[lang] || dayNames['en'];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const label = mode === 'week' ? dn[d.getDay()] : d.getDate() + '';
    labels.push(label);
    const dateStr = d.toLocaleDateString('th-TH');
    const dayTotal = DB.orders
      .filter(o => o.status === 'done' && o.date === dateStr)
      .reduce((s, o) => s + o.total, 0);
    values.push(dayTotal || Math.round(Math.random() * 400000 + 50000));
  }

  drawBarChart(ctx, canvas, labels, values, '#ff6b35', '#ffb347');
}

function drawTopChart(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

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

  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = pad.top + cH - (cH * i / 4);
    ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(W - pad.right, y); ctx.stroke();
    ctx.fillStyle = 'rgba(160,160,184,0.6)';
    ctx.font = '10px DM Mono';
    ctx.textAlign = 'right';
    ctx.fillText(fmtK(max * i / 4), pad.left - 6, y + 4);
  }

  labels.forEach((lbl, i) => {
    const bH = (values[i] / max) * cH;
    const x  = pad.left + i * gap + (gap - barW) / 2;
    const y  = pad.top + cH - bH;

    const grad = ctx.createLinearGradient(0, y, 0, y + bH);
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2 + '88');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barW, bH, [4, 4, 0, 0]);
    ctx.fill();

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

    ctx.fillStyle = 'rgba(160,160,184,0.85)';
    ctx.font = '10px Noto Sans Thai';
    ctx.textAlign = 'right';
    const truncated = lbl.length > 7 ? lbl.substring(0,7)+'…' : lbl;
    ctx.fillText(truncated, pad.left - 8, y + 4);

    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.beginPath();
    ctx.roundRect(pad.left, y - pad.bar/2, W - pad.left - pad.right, pad.bar, 4);
    ctx.fill();

    ctx.fillStyle = colors[i % colors.length];
    ctx.beginPath();
    ctx.roundRect(pad.left, y - pad.bar/2, bW, pad.bar, 4);
    ctx.fill();

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

  const catNames = {
    rice:    { lo:'ຂ້າວ',    th:'ข้าว',    en:'Rice',    zh:'米饭' },
    noodle:  { lo:'ເຝີ/ກ໋ວຍ', th:'เฝอ/ก๋วย', en:'Noodles', zh:'面条' },
    grill:   { lo:'ປີ້ງ',    th:'ปิ้ง',    en:'Grilled', zh:'烤制' },
    drink:   { lo:'ດື່ມ',     th:'ดื่ม',    en:'Drinks',  zh:'饮品' },
    dessert: { lo:'ຂອງຫວານ', th:'ของหวาน', en:'Dessert', zh:'甜点' }
  };
  const catColors= ['#ff6b35','#ffb347','#3498db','#2ecc71','#9b59b6'];
  const cats = Object.keys(catNames);
  const lang = i18n.getLang();

  const freq = {};
  cats.forEach(c => freq[c] = 0);
  DB.orders.filter(o => o.status === 'done').forEach(o => {
    o.items.split(', ').forEach(it => {
      const pName = it.split(' x')[0];
      const p = DB.products.find(pr => localName(pr) === pName);
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

    ctx.strokeStyle = 'rgba(12,12,16,0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();
    angle += slice;
  });

  cats.forEach((cat, i) => {
    const x = 10 + (i % 3) * (W / 3);
    const y = cy + r + 16 + Math.floor(i / 3) * 16;
    ctx.fillStyle = catColors[i];
    ctx.fillRect(x, y, 10, 10);
    ctx.fillStyle = 'rgba(160,160,184,0.8)';
    ctx.font = '9px Noto Sans Thai';
    ctx.textAlign = 'left';
    const pct = total > 0 ? Math.round(freq[cat]/total*100) : 0;
    const label = (catNames[cat][lang] || catNames[cat].en);
    ctx.fillText(label + ' ' + pct + '%', x + 13, y + 9);
  });
}

// ════════════════════════════════
// 8. ORDERS PAGE
// ════════════════════════════════
function orderTableHead() {
  return `<thead><tr>
    <th>${i18n.t('tbl.order')}</th>
    <th>${i18n.t('tbl.table')}</th>
    <th>${i18n.t('tbl.items')}</th>
    <th>${i18n.t('tbl.total')}</th>
    <th>${i18n.t('tbl.time')}</th>
    <th>${i18n.t('tbl.status')}</th>
    <th>${i18n.t('tbl.actions')}</th>
  </tr></thead>`;
}

function orderRow(o) {
  const badge = o.status === 'done' ? 'badge-green' : o.status === 'cancel' ? 'badge-red' : 'badge-yellow';
  const label = o.status === 'done' ? `✅ ${i18n.t('status.done')}` : o.status === 'cancel' ? `❌ ${i18n.t('status.cancel')}` : `⏳ ${i18n.t('status.pending')}`;
  return `<tr>
    <td><b class="mono">#${o.num}</b></td>
    <td><span class="badge badge-blue">${o.table}</span></td>
    <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text2);font-size:0.8rem">${o.items}</td>
    <td><b>${fmt(o.total)}</b> <span style="color:var(--muted);font-size:0.75rem">${i18n.t('currency')}</span></td>
    <td style="color:var(--muted);font-size:0.78rem;white-space:nowrap">${o.time}</td>
    <td><span class="badge ${badge}">${label}</span></td>
    <td><div class="tbl-actions">
      <button class="tbl-btn" onclick="viewOrder(${o.id})">📄 ${i18n.t('tbl.view')}</button>
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
      <div><span style="color:var(--muted)">${i18n.t('tbl.order')}:</span> <b>#${o.num}</b></div>
      <div><span style="color:var(--muted)">${i18n.t('tbl.table')}:</span> <b>${o.table}</b></div>
      <div><span style="color:var(--muted)">${i18n.t('tbl.time')}:</span> ${o.time}</div>
      <div><span style="color:var(--muted)">${i18n.t('tbl.status')}:</span> ${o.status}</div>
    </div>
    <div style="margin-top:14px;padding:12px;background:var(--surface2);border-radius:10px;font-size:0.85rem">
      <b>${i18n.t('tbl.items')}:</b><br>${o.items.split(', ').map(i => '• ' + i).join('<br>')}
    </div>
    <div style="margin-top:10px;font-size:0.85rem;display:flex;flex-direction:column;gap:5px">
      <div style="display:flex;justify-content:space-between"><span>${i18n.t('order.subtotal')}</span><span>${fmt(o.subtotal)} ${i18n.t('currency')}</span></div>
      <div style="display:flex;justify-content:space-between"><span>${i18n.t('vat.label')}</span><span>${fmt(o.vat)} ${i18n.t('currency')}</span></div>
      <div style="display:flex;justify-content:space-between;font-weight:700;border-top:1px solid var(--border);padding-top:8px">
        <span>${i18n.t('order.grandtotal')}</span><span style="color:var(--accent2)">${fmt(o.total)} ${i18n.t('currency')}</span>
      </div>
    </div>`;
  openModal('orderDetailModal');
}

function completeOrder(id) {
  const o = DB.orders.find(x => x.id === id);
  if (o) { POS_DB.orders.updateStatus(id, 'done'); renderOrdersPage(); updateOrderBadge(); showToast('✅ ' + i18n.t('toast.orderdone') + ' #' + o.num); }
}
function cancelOrder(id) {
  const o = DB.orders.find(x => x.id === id);
  if (o && confirm(i18n.t('toast.cancelconfirm') + ' #' + o.num + '?')) {
    POS_DB.orders.updateStatus(id, 'cancel'); renderOrdersPage(); updateOrderBadge(); showToast('❌ ' + i18n.t('toast.ordercancel') + ' #' + o.num);
  }
}

function updateOrderBadge() {
  const pending = DB.orders.filter(o => o.status === 'pending').length;
  const badge = document.getElementById('sbBadgeOrders');
  badge.textContent = pending;
  badge.dataset.count = pending;
}

function printReceipt() {
  showToast('🖨️ ' + i18n.t('toast.printsent')); closeModal('orderDetailModal');
}

// ════════════════════════════════
// 9. PRODUCTS PAGE
// ════════════════════════════════
function renderProductsPage() {
  const q   = (document.getElementById('productSearch')?.value || '').toLowerCase();
  const cat = document.getElementById('productCatFilter')?.value || 'all';

  const filtered = POS_DB.products.getAll().filter(p => {
    const matchQ   = !q || localName(p).toLowerCase().includes(q) || localDesc(p).toLowerCase().includes(q);
    const matchCat = cat === 'all' || p.cat === cat;
    return matchQ && matchCat;
  });

  const statusBadge = s => {
    if (s === 'active')  return `<span class="badge badge-green">✅ ${i18n.t('products.active')}</span>`;
    if (s === 'soldout') return `<span class="badge badge-red">❌ ${i18n.t('products.soldout')}</span>`;
    return `<span class="badge badge-gray">🚫 ${i18n.t('products.hidden')}</span>`;
  };

  const thead = `<thead><tr>
    <th>${i18n.t('products.name')}</th>
    <th>${i18n.t('products.cat')}</th>
    <th>${i18n.t('products.price')}</th>
    <th>${i18n.t('products.stock')}</th>
    <th>${i18n.t('products.status')}</th>
    <th>${i18n.t('orders.manage')}</th>
  </tr></thead>`;

  const tbody = `<tbody>${filtered.map(p => `<tr>
    <td><div style="display:flex;align-items:center;gap:10px">
      <span style="font-size:1.5rem">${p.emoji}</span>
      <div><div style="font-weight:600">${localName(p)}</div><div style="font-size:0.75rem;color:var(--muted)">${localDesc(p)}</div></div>
    </div></td>
    <td style="font-size:0.82rem">${i18n.t('cat.' + p.cat)}</td>
    <td><b>${fmt(p.price)}</b> <span style="color:var(--muted);font-size:0.75rem">${i18n.t('currency')}</span></td>
    <td><span style="color:${p.stock <= 5 ? 'var(--red)' : p.stock <= 20 ? 'var(--yellow)' : 'var(--green)'}; font-weight:600">${p.stock}</span></td>
    <td>${statusBadge(p.status)}</td>
    <td><div class="tbl-actions">
      <button class="tbl-btn" onclick="openProductModal(${p.id})">✏️ ${i18n.t('btn.edit')}</button>
      <button class="tbl-btn danger" onclick="deleteProduct(${p.id})">🗑️</button>
    </div></td>
  </tr>`).join('')}</tbody>`;

  document.getElementById('productsTable').innerHTML = thead + tbody;
}

function openProductModal(id = null) {
  document.getElementById('productModalTitle').textContent = id ? i18n.t('modal.editproduct') : i18n.t('modal.addproduct');
  if (id) {
    const p = DB.products.find(x => x.id === id);
    if (!p) return;
    document.getElementById('pmId').value    = p.id;
    document.getElementById('pmName').value  = localName(p);
    document.getElementById('pmPrice').value = p.price;
    document.getElementById('pmDesc').value  = localDesc(p);
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

  if (!name || isNaN(price)) { showToast('⚠️ ' + i18n.t('toast.fillall')); return; }

  // Build multilingual name/desc for mock data
  const nameObj = { lo:name, th:name, en:name, zh:name };
  const descObj = { lo:desc, th:desc, en:desc, zh:desc };

  if (id) {
    const p = DB.products.find(x => x.id === parseInt(id));
    POS_DB.products.update(parseInt(id), { name:nameObj, price, desc:descObj, cat, stock, status });
    showToast('✅ ' + i18n.t('toast.saved') + ' ' + name);
  } else {
    POS_DB.products.add({ name:nameObj, price, desc:descObj, cat, stock, status, emoji: emojis[cat] || '🍽️' });
    showToast('✅ ' + i18n.t('toast.added') + ' ' + name);
  }
  closeModal('productModal');
  renderProductsPage();
}

function deleteProduct(id) {
  const p = DB.products.find(x => x.id === id);
  if (!p || !confirm(i18n.t('toast.deleteconfirm') + ' ' + localName(p) + '?')) return;
  POS_DB.products.delete(id);
  renderProductsPage();
  showToast('🗑️ ' + i18n.t('toast.deleted') + ' ' + localName(p));
}

// ════════════════════════════════
// 10. INVENTORY PAGE
// ════════════════════════════════
function renderInventoryPage() {
  const low = DB.products.filter(p => p.stock <= 5);
  const alertEl = document.getElementById('stockAlert');
  if (low.length > 0) {
    alertEl.classList.add('show');
    alertEl.textContent = '⚠️ ' + i18n.t('inv.lowstock') + ' ' + low.map(p => localName(p) + ' (' + p.stock + ')').join(', ');
  } else {
    alertEl.classList.remove('show');
  }

  const thead = `<thead><tr>
    <th>${i18n.t('products.name')}</th>
    <th>${i18n.t('products.cat')}</th>
    <th>${i18n.t('products.stock')}</th>
    <th>${i18n.t('products.status')}</th>
    <th>${i18n.t('orders.manage')}</th>
  </tr></thead>`;

  const tbody = `<tbody>${DB.products.map(p => {
    const lvl = p.stock <= 0 ? 'badge-red' : p.stock <= 5 ? 'badge-yellow' : p.stock <= 20 ? 'badge-blue' : 'badge-green';
    return `<tr>
      <td><div style="display:flex;align-items:center;gap:8px">${p.emoji} <b>${localName(p)}</b></div></td>
      <td style="color:var(--muted);font-size:0.82rem">${i18n.t('cat.' + p.cat)}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="badge ${lvl}" style="font-size:0.85rem;padding:4px 12px">${p.stock}</span>
          <div style="flex:1;max-width:80px;height:6px;background:var(--surface3);border-radius:4px;overflow:hidden">
            <div style="height:100%;width:${Math.min(p.stock/100*100,100)}%;background:${p.stock<=5?'var(--red)':p.stock<=20?'var(--yellow)':'var(--green)'};border-radius:4px"></div>
          </div>
        </div>
      </td>
      <td>${p.status === 'active' ? `<span class="badge badge-green">✅ ${i18n.t('products.active')}</span>` : `<span class="badge badge-red">❌ ${i18n.t('products.soldout')}</span>`}</td>
      <td><button class="tbl-btn" onclick="quickStock(${p.id})">📦 ${i18n.t('inv.adjust')}</button></td>
    </tr>`;
  }).join('')}</tbody>`;
  document.getElementById('inventoryTable').innerHTML = thead + tbody;

  const logHead = `<thead><tr>
    <th>${i18n.t('products.name')}</th>
    <th>${i18n.t('modal.type')}</th>
    <th>${i18n.t('modal.qty')}</th>
    <th>${i18n.t('modal.note')}</th>
    <th>${i18n.t('tbl.time')}</th>
  </tr></thead>`;
  const logBody = `<tbody>${POS_DB.stockLog.getAll().map(l => `<tr>
    <td><b>${l.productName}</b></td>
    <td><span class="badge ${l.type==='in'?'badge-green':l.type==='out'?'badge-red':'badge-blue'}">${l.type==='in'?'▲ '+i18n.t('inv.in'):l.type==='out'?'▼ '+i18n.t('inv.out'):'= '+i18n.t('inv.set')}</span></td>
    <td><b>${l.qty}</b></td>
    <td style="color:var(--muted);font-size:0.82rem">${l.note}</td>
    <td style="color:var(--muted);font-size:0.78rem">${l.date}</td>
  </tr>`).join('')}</tbody>`;
  document.getElementById('stockLogTable').innerHTML = logHead + logBody;
}

function openStockModal() {
  const sel = document.getElementById('smProduct');
  sel.innerHTML = DB.products.map(p => `<option value="${p.id}">${p.emoji} ${localName(p)} (${i18n.t('products.stock')}: ${p.stock})</option>`).join('');
  openModal('stockModal');
}
function quickStock(id) {
  const sel = document.getElementById('smProduct');
  sel.innerHTML = DB.products.map(p => `<option value="${p.id}" ${p.id===id?'selected':''}>${p.emoji} ${localName(p)} (${i18n.t('products.stock')}: ${p.stock})</option>`).join('');
  openModal('stockModal');
}

function saveStock() {
  const pId  = parseInt(document.getElementById('smProduct').value);
  const type = document.getElementById('smType').value;
  const qty  = parseInt(document.getElementById('smQty').value);
  const note = document.getElementById('smNote').value.trim() || i18n.t('inv.adjust');
  if (isNaN(qty) || qty < 0) { showToast('⚠️ ' + i18n.t('toast.fillall')); return; }

  const p = DB.products.find(x => x.id === pId);
  if (!p) return;

  let newStock = p.stock;
  if (type === 'in')  newStock += qty;
  else if (type === 'out') newStock = Math.max(0, p.stock - qty);
  else newStock = qty;
  const newStatus = newStock === 0 ? 'soldout' : (p.status === 'soldout' ? 'active' : p.status);
  POS_DB.products.update(pId, { stock: newStock, status: newStatus });

  POS_DB.stockLog.add({ productId: p.id, productName: localName(p), type, qty, note });

  closeModal('stockModal');
  renderInventoryPage();
  showToast('✅ ' + i18n.t('toast.stockadjusted') + ' ' + localName(p));
}

// ════════════════════════════════
// 11. REPORTS PAGE
// ════════════════════════════════
function renderReportsPage() {
  const period = parseInt(document.getElementById('reportPeriod')?.value || 7);
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
    kpiCard('💰', fmt(revenue), i18n.t('rep.revenue'), '', 'neu', true)
    + kpiCard('📦', count, i18n.t('rep.completed'), '', 'up')
    + kpiCard('📊', fmt(avg), i18n.t('rep.avg'), i18n.t('currency'), 'neu')
    + kpiCard('🏆', top ? top[0] : '—', i18n.t('rep.top'), top ? top[1]+' '+i18n.t('rep.times') : '', 'up');

  const thead = `<thead><tr>
    <th>${i18n.t('tbl.order')}</th>
    <th>${i18n.t('tbl.table')}</th>
    <th>${i18n.t('tbl.items')}</th>
    <th>${i18n.t('tbl.total')}</th>
    <th>${i18n.t('tbl.time')}</th>
  </tr></thead>`;
  const tbody = `<tbody>${filtered.slice(0,20).map(o => `<tr>
    <td><b class="mono">#${o.num}</b></td>
    <td><span class="badge badge-blue">${o.table}</span></td>
    <td style="color:var(--text2);font-size:0.8rem;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${o.items}</td>
    <td><b>${fmt(o.total)}</b> ${i18n.t('currency')}</td>
    <td style="color:var(--muted);font-size:0.78rem">${o.time}</td>
  </tr>`).join('')}</tbody>`;
  document.getElementById('reportTable').innerHTML = thead + tbody;

  requestAnimationFrame(() => requestAnimationFrame(() => {
    drawSalesChart('reportChart', 'week');
    drawCategoryChart('catChart');
  }));
}

function exportCSV() {
  const rows = [[i18n.t('tbl.order'),i18n.t('tbl.table'),i18n.t('tbl.items'),i18n.t('tbl.total'),i18n.t('tbl.time'),i18n.t('tbl.status')]];
  DB.orders.forEach(o => rows.push([o.num, o.table, '"'+o.items+'"', o.total, o.time, o.status]));
  const csv = rows.map(r => r.join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'orders_export.csv'; a.click();
  showToast('⬇ ' + i18n.t('toast.exportdone'));
}

// ════════════════════════════════
// 12. USERS PAGE
// ════════════════════════════════
function renderUsersPage() {
  const roleLabel = {
    admin:   i18n.t('user.role.admin'),
    manager: i18n.t('user.role.mgr'),
    cashier: i18n.t('user.role.cash')
  };
  const thead = `<thead><tr>
    <th>${i18n.t('admin.users')}</th>
    <th>${i18n.t('users.username')}</th>
    <th>${i18n.t('users.role')}</th>
    <th>${i18n.t('products.status')}</th>
    <th>${i18n.t('users.last.login')}</th>
    <th>${i18n.t('orders.manage')}</th>
  </tr></thead>`;
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
  document.getElementById('userModalTitle').textContent = id ? i18n.t('modal.edituser') : i18n.t('modal.adduser');
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
  if (!name || !uname) { showToast('⚠️ ' + i18n.t('toast.fillall')); return; }

  if (id) {
    const u = DB.users.find(x => x.id === parseInt(id));
    POS_DB.users.update(parseInt(id), { name, username: uname, role, status });
    if (pass) POS_DB.users.update(parseInt(id), { password: pass });
    showToast('✅ ' + i18n.t('toast.saved') + ' ' + name);
  } else {
    if (!pass) { showToast('⚠️ ' + i18n.t('toast.fillall')); return; }
    POS_DB.users.add({ name, username: uname, password: pass, role, status });
    showToast('✅ ' + i18n.t('toast.added') + ' ' + name);
  }
  closeModal('userModal');
  renderUsersPage();
}

function deleteUser(id) {
  const u = DB.users.find(x => x.id === id);
  if (!u || !confirm(i18n.t('toast.deleteconfirm') + ' ' + u.name + '?')) return;
  POS_DB.users.delete(id);
  renderUsersPage();
  showToast('🗑️ ' + i18n.t('toast.deleted') + ' ' + u.name);
}

// ════════════════════════════════
// 13. SETTINGS UTILS
// ════════════════════════════════
function confirmReset() {
  if (confirm('⚠️ ' + i18n.t('toast.resetconfirm'))) {
    POS_DB.reset(); showToast('🗑️ ' + i18n.t('toast.resetdone'));
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
  showToast('🔄 ' + i18n.t('toast.refreshed'));
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