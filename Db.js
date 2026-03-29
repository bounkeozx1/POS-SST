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
      // name/desc are multilingual objects: { lo, th, en, zh }
      { id:1,  name:{lo:'ຂ້າວໜຽວ',  th:'ข้าวเหนียว',  en:'Sticky Rice',    zh:'糯米饭'   }, desc:{lo:'ຂ້າວໜຽວຫຸງສຸກ',     th:'ข้าวเหนียวหุงสุก',    en:'Steamed sticky rice',     zh:'蒸糯米饭'      }, price:5000,  cat:'rice',    emoji:'🍚', stock:99,  status:'active'  },
      { id:2,  name:{lo:'ຂ້າວຜັດ',   th:'ข้าวผัด',     en:'Fried Rice',     zh:'炒饭'     }, desc:{lo:'ຜັດໄຂ່ ຜັກ ສົດ',    th:'ผัดไข่ ผัก สด',       en:'Egg & vegetable fried rice',zh:'鸡蛋蔬菜炒饭'  }, price:35000, cat:'rice',    emoji:'🍳', stock:50,  status:'active'  },
      { id:3,  name:{lo:'ຂ້າວໝູ',    th:'ข้าวหมู',     en:'Pork Rice',      zh:'猪肉饭'   }, desc:{lo:'ຂ້າວໝູແດງ ຊອດ',     th:'ข้าวหมูแดง ซอส',      en:'BBQ pork over rice',      zh:'叉烧饭配酱汁'  }, price:30000, cat:'rice',    emoji:'🥩', stock:40,  status:'active'  },
      { id:4,  name:{lo:'ລາບໝູ',     th:'ลาบหมู',      en:'Pork Laab',      zh:'猪肉拉帕' }, desc:{lo:'ດິບ / ສຸກ',          th:'ดิบ / สุก',           en:'Raw or cooked style',     zh:'生/熟皆可'     }, price:40000, cat:'rice',    emoji:'🥗', stock:30,  status:'active'  },
      { id:5,  name:{lo:'ຕົ້ມຍຳ',    th:'ต้มยำ',       en:'Tom Yum',        zh:'冬阴功'   }, desc:{lo:'ກຸ້ງ ເຜັດຮ້ອນ',       th:'กุ้ง เผ็ดร้อน',       en:'Spicy shrimp soup',       zh:'辣虾汤'        }, price:50000, cat:'rice',    emoji:'🦐', stock:25,  status:'active'  },
      { id:6,  name:{lo:'ເຝີໄກ່',    th:'เฝอไก่',      en:'Chicken Pho',    zh:'鸡肉河粉' }, desc:{lo:'ນ້ຳສຸບໄກ່ ເສັ້ນໃຫຍ່', th:'น้ำซุปไก่ เส้นใหญ่',  en:'Chicken broth noodle soup',zh:'鸡汤宽粉'      }, price:25000, cat:'noodle',  emoji:'🍜', stock:35,  status:'active'  },
      { id:7,  name:{lo:'ກ໋ວຍຈັ໊ບ',  th:'ก๋วยจั๊บ',   en:'Kuay Jab',       zh:'卷粉汤'   }, desc:{lo:'ເສັ້ນໃຫຍ່ ໝູ ໄຂ່',    th:'เส้นใหญ่ หมู ไข่',    en:'Wide noodle pork soup',   zh:'宽粉猪肉汤'    }, price:30000, cat:'noodle',  emoji:'🍲', stock:5,   status:'active'  },
      { id:8,  name:{lo:'ໄກ່ຍ່າງ',   th:'ไก่ย่าง',    en:'Grilled Chicken',zh:'烤鸡'     }, desc:{lo:'ໄກ່ຍ່າງຟືນ ຊອດ',      th:'ไก่ย่างฟืน ซอส',      en:'Wood-fired grilled chicken',zh:'柴火烤鸡配酱汁'}, price:45000, cat:'grill',   emoji:'🍗', stock:20,  status:'active'  },
      { id:9,  name:{lo:'ປາຕົ້ມ',    th:'ปาต้ม',       en:'Steamed Fish',   zh:'清蒸鱼'   }, desc:{lo:'ເຄື່ອງຈ້ຳ ຫອມ',       th:'เครื่องจ้ำ หอม',      en:'Steamed fish with herbs', zh:'香草蒸鱼'      }, price:60000, cat:'grill',   emoji:'🐟', stock:3,   status:'soldout' },
      { id:10, name:{lo:'ເບຍລາວ',    th:'เบียลาว',     en:'Beerlao',        zh:'老挝啤酒' }, desc:{lo:'ຂວດ 640ml ເຢັນ',       th:'ขวด 640ml เย็น',      en:'640ml bottle chilled',    zh:'640ml冰镇瓶装'  }, price:20000, cat:'drink',   emoji:'🍺', stock:80,  status:'active'  },
      { id:11, name:{lo:'ນ້ຳໝາກໄມ້', th:'น้ำผลไม้',   en:'Fruit Juice',    zh:'果汁'     }, desc:{lo:'ສົ້ມ / ໝາກນາວ ເຢັນ',  th:'ส้ม / มะนาว เย็น',   en:'Orange / lime, chilled',  zh:'橙汁/柠檬汁冰镇'}, price:15000, cat:'drink',   emoji:'🧃', stock:60,  status:'active'  },
      { id:12, name:{lo:'ນ້ຳດ່ຽວ',   th:'น้ำดื่ม',     en:'Water',          zh:'饮用水'   }, desc:{lo:'ນ້ຳເຢັນ 600ml',         th:'น้ำเย็น 600ml',       en:'Cold water 600ml',        zh:'冰水600ml'     }, price:5000,  cat:'drink',   emoji:'💧', stock:100, status:'active'  },
      { id:13, name:{lo:'ຂ້າວໜົມ',   th:'ข้าวหนม',    en:'Rice Cake',      zh:'米糕'     }, desc:{lo:'ຂ້າວໜົມຫໍ່ ງາ',        th:'ข้าวหนมห่อ งา',       en:'Wrapped rice cake, sesame',zh:'芝麻糯米糕'    }, price:8000,  cat:'dessert', emoji:'🍡', stock:15,  status:'active'  },
      { id:14, name:{lo:'ຂ້າວຕ້ົ',   th:'ข้าวต้ม',    en:'Rice Porridge',  zh:'米粥'     }, desc:{lo:'ຂ້າວຕ້ົ ໝາກໂກ',        th:'ข้าวต้ม มะพร้าว',     en:'Coconut rice porridge',   zh:'椰汁米粥'      }, price:12000, cat:'dessert', emoji:'🧆', stock:0,   status:'soldout' },
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
    // Check if stored products still use old string-only format
    // If so, wipe and re-seed with multilingual format
    const stored = load(KEY.products);
    if (stored && stored.length > 0) {
      const firstItem = stored[0];
      if (typeof firstItem.name === 'string') {
        // Old format detected — reset to multilingual defaults
        save(KEY.products, DEFAULTS.products);
      }
    }
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