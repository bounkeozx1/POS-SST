/* ============================================================
   db.js — Shared Data Layer
   ใช้ localStorage เชื่อมข้อมูลระหว่าง:
     • index.html  (Self-Ordering หน้าลูกค้า)
     • admin.html  (Admin Dashboard)

   วิธีใช้: เพิ่ม <script src="db.js"></script>
   ก่อน script หลักในทั้งสองหน้า
   ============================================================ */

const POS_DB = (() => {

  // ── Keys ──────────────────────────────────────────────────
  const KEY = {
    products:  'posdb_products',
    orders:    'posdb_orders',
    stockLog:  'posdb_stockLog',
    users:     'posdb_users',
    settings:  'posdb_settings',
    orderNum:  'posdb_orderNum',
  };

  // ── Default Data ──────────────────────────────────────────
  const DEFAULTS = {
    products: [
      { id:1,  name:'ຂ້າວໜຽວ',  desc:'ຂ້າວໜຽວຫຸງສຸກ',      price:5000,  cat:'rice',    emoji:'🍚', stock:99, status:'active'  },
      { id:2,  name:'ຂ້າວຜັດ',   desc:'ຜັດໄຂ່ ຜັກ ສົດ',     price:35000, cat:'rice',    emoji:'🍳', stock:50, status:'active'  },
      { id:3,  name:'ຂ້າວໝູ',    desc:'ຂ້າວໝູແດງ ຊອດ',       price:30000, cat:'rice',    emoji:'🥩', stock:40, status:'active'  },
      { id:4,  name:'ລາບໝູ',     desc:'ດິບ / ສຸກ',           price:40000, cat:'rice',    emoji:'🥗', stock:30, status:'active'  },
      { id:5,  name:'ຕົ້ມຍຳ',    desc:'ກຸ້ງ ເຜັດຮ້ອນ',        price:50000, cat:'rice',    emoji:'🦐', stock:25, status:'active'  },
      { id:6,  name:'ເຝີໄກ່',    desc:'ນ້ຳສຸບໄກ່ ເສັ້ນໃຫຍ່',  price:25000, cat:'noodle',  emoji:'🍜', stock:35, status:'active'  },
      { id:7,  name:'ກ໋ວຍຈັ໊ບ',  desc:'ເສັ້ນໃຫຍ່ ໝູ ໄຂ່',    price:30000, cat:'noodle',  emoji:'🍲', stock:5,  status:'active'  },
      { id:8,  name:'ໄກ່ຍ່າງ',   desc:'ໄກ່ຍ່າງຟືນ ຊອດ',      price:45000, cat:'grill',   emoji:'🍗', stock:20, status:'active'  },
      { id:9,  name:'ປາຕົ້ມ',    desc:'ເຄື່ອງຈ້ຳ ຫອມ',       price:60000, cat:'grill',   emoji:'🐟', stock:3,  status:'soldout' },
      { id:10, name:'ເບຍລາວ',    desc:'ຂວດ 640ml ເຢັນ',       price:20000, cat:'drink',   emoji:'🍺', stock:80, status:'active'  },
      { id:11, name:'ນ້ຳໝາກໄມ້', desc:'ສົ້ມ / ໝາກນາວ ເຢັນ',  price:15000, cat:'drink',   emoji:'🧃', stock:60, status:'active'  },
      { id:12, name:'ນ້ຳດ່ຽວ',   desc:'ນ້ຳເຢັນ 600ml',         price:5000,  cat:'drink',   emoji:'💧', stock:100,status:'active'  },
      { id:13, name:'ຂ້າວໜົມ',   desc:'ຂ້າວໜົມຫໍ່ ງາ',        price:8000,  cat:'dessert', emoji:'🍡', stock:15, status:'active'  },
      { id:14, name:'ຂ້າວຕ້ົ',   desc:'ຂ້າວຕ້ົ ໝາກໂກ',        price:12000, cat:'dessert', emoji:'🧆', stock:0,  status:'soldout' },
    ],
    orders:   [],
    stockLog: [],
    users: [
      { id:1, name:'Admin User', username:'admin',   password:'1234', role:'admin',   status:'active', lastLogin:'-' },
      { id:2, name:'Cashier 1',  username:'cashier', password:'1234', role:'cashier', status:'active', lastLogin:'-' },
    ],
    settings: {
      storeName:  'ຮ້ານອາຫານລາວ',
      phone:      '020 xxxx xxxx',
      address:    'ວຽງຈັນ, ລາວ',
      vatPct:     7,
      currency:   'LAK',
      receiptHeader: 'ຮ້ານອາຫານລາວ',
      receiptFooter: 'ຂອບໃຈທີ່ໃຊ້ບໍລິການ 🙏',
    },
    orderNum: 1001,
  };

  // ── Storage Helpers ───────────────────────────────────────
  function load(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  }

  function save(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      // Dispatch custom event so OTHER open tab can react
      window.dispatchEvent(new StorageEvent('storage', { key, newValue: JSON.stringify(value) }));
    } catch (e) { console.warn('POS_DB save error:', e); }
  }

  function init(key, defaultVal) {
    if (load(key) === null) save(key, defaultVal);
  }

  // Initialise all stores with defaults if not present
  function bootstrap() {
    Object.entries(DEFAULTS).forEach(([k, v]) => init(KEY[k], v));
  }

  // ── Products ──────────────────────────────────────────────
  const products = {
    getAll()   { return load(KEY.products) || []; },
    getActive(){ return this.getAll().filter(p => p.status === 'active'); },
    get(id)    { return this.getAll().find(p => p.id === id) || null; },
    save(arr)  { save(KEY.products, arr); },

    add(item) {
      const arr = this.getAll();
      item.id   = Date.now();
      arr.push(item);
      this.save(arr);
      return item;
    },

    update(id, patch) {
      const arr = this.getAll();
      const idx = arr.findIndex(p => p.id === id);
      if (idx < 0) return null;
      arr[idx] = { ...arr[idx], ...patch };
      this.save(arr);
      return arr[idx];
    },

    delete(id) {
      const arr = this.getAll().filter(p => p.id !== id);
      this.save(arr);
    },

    decreaseStock(id, qty = 1) {
      const p = this.get(id);
      if (!p) return;
      p.stock = Math.max(0, p.stock - qty);
      if (p.stock === 0) p.status = 'soldout';
      this.update(id, p);
    },
  };

  // ── Orders ────────────────────────────────────────────────
  const orders = {
    getAll()  { return load(KEY.orders) || []; },
    get(id)   { return this.getAll().find(o => o.id === id) || null; },
    save(arr) { save(KEY.orders, arr); },

    // Create a new order from cart items
    create({ tableCode, tableId, items, paymentMethod = 'cash' }) {
      const num      = load(KEY.orderNum) || 1001;
      const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
      const vatAmt   = Math.round(subtotal * ((load(KEY.settings)?.vatPct || 7) / 100));
      const total    = subtotal + vatAmt;
      const now      = new Date();

      const order = {
        id:            num,
        num:           String(num),
        tableCode,
        tableId,
        items,          // [{id, name, price, qty, emoji}]
        subtotal,
        vatAmt,
        total,
        paymentMethod,
        status:        'pending',
        createdAt:     now.toISOString(),
        date:          now.toLocaleDateString('lo-LA'),
        time:          now.toLocaleTimeString('lo-LA'),
        source:        'self-order',   // 'self-order' | 'pos'
      };

      const arr = this.getAll();
      arr.unshift(order);
      this.save(arr);
      save(KEY.orderNum, num + 1);

      // Decrease stock for each item
      items.forEach(i => products.decreaseStock(i.id, i.qty));

      return order;
    },

    updateStatus(id, status) {
      const arr = this.getAll();
      const idx = arr.findIndex(o => o.id === id);
      if (idx < 0) return;
      arr[idx].status = status;
      arr[idx].updatedAt = new Date().toISOString();
      this.save(arr);
      return arr[idx];
    },

    getPending() { return this.getAll().filter(o => o.status === 'pending'); },
    getDone()    { return this.getAll().filter(o => o.status === 'done');    },
  };

  // ── Stock Log ─────────────────────────────────────────────
  const stockLog = {
    getAll()  { return load(KEY.stockLog) || []; },
    save(arr) { save(KEY.stockLog, arr); },

    add({ productId, productName, type, qty, note }) {
      const arr = this.getAll();
      arr.unshift({
        id:          Date.now(),
        productId, productName, type, qty,
        note:        note || '',
        date:        new Date().toLocaleString('lo-LA'),
      });
      this.save(arr);
    },
  };

  // ── Users ─────────────────────────────────────────────────
  const users = {
    getAll()            { return load(KEY.users) || []; },
    get(id)             { return this.getAll().find(u => u.id === id) || null; },
    save(arr)           { save(KEY.users, arr); },
    authenticate(u, p)  { return this.getAll().find(x => x.username === u && x.password === p && x.status === 'active') || null; },

    add(user) {
      const arr  = this.getAll();
      user.id    = Date.now();
      user.lastLogin = '-';
      arr.push(user);
      this.save(arr);
      return user;
    },

    update(id, patch) {
      const arr = this.getAll();
      const idx = arr.findIndex(u => u.id === id);
      if (idx < 0) return null;
      arr[idx] = { ...arr[idx], ...patch };
      this.save(arr);
      return arr[idx];
    },

    delete(id) {
      this.save(this.getAll().filter(u => u.id !== id));
    },

    touchLogin(id) {
      this.update(id, { lastLogin: new Date().toLocaleString('lo-LA') });
    },
  };

  // ── Settings ──────────────────────────────────────────────
  const settings = {
    get()         { return load(KEY.settings) || DEFAULTS.settings; },
    set(patch)    { save(KEY.settings, { ...this.get(), ...patch }); },
    getVat()      { return this.get().vatPct || 7; },
    getStoreName(){ return this.get().storeName || 'POS-SST'; },
  };

  // ── Cross-tab Listener ────────────────────────────────────
  // Fires when admin changes products/orders → self-order page updates
  function onExternalChange(callback) {
    window.addEventListener('storage', e => {
      if (Object.values(KEY).includes(e.key)) {
        callback(e.key, e.newValue ? JSON.parse(e.newValue) : null);
      }
    });
  }

  // ── Reset ─────────────────────────────────────────────────
  function reset() {
    Object.values(KEY).forEach(k => localStorage.removeItem(k));
    bootstrap();
  }

  // ── Init ──────────────────────────────────────────────────
  bootstrap();

  // Public API
  return { products, orders, stockLog, users, settings, onExternalChange, reset, KEY };

})();

// Make globally available
window.POS_DB = POS_DB;