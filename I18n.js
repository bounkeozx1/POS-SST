/* ============================================================
   i18n.js — Language System (ລາວ | ไทย | English | 中文)
   ============================================================ */
const i18n = (() => {
  const LANGS = [
    { code:'lo', label:'ລາວ', flag:'🇱🇦' },
    { code:'th', label:'ไทย', flag:'🇹🇭' },
    { code:'en', label:'EN',  flag:'🇬🇧' },
    { code:'zh', label:'中文',flag:'🇨🇳' },
  ];
  const T = {
    'app.name':          { lo:'ຮ້ານອາຫານລາວ',    th:'ร้านอาหารลาว',      en:'Lao Restaurant',    zh:'老挝餐厅'   },
    'btn.save':          { lo:'ບັນທຶກ',            th:'บันทึก',             en:'Save',              zh:'保存'       },
    'btn.cancel':        { lo:'ຍົກເລີກ',           th:'ยกเลิก',             en:'Cancel',            zh:'取消'       },
    'btn.delete':        { lo:'ລຶບ',               th:'ลบ',                 en:'Delete',            zh:'删除'       },
    'btn.edit':          { lo:'ແກ້ໄຂ',             th:'แก้ไข',              en:'Edit',              zh:'编辑'       },
    'btn.close':         { lo:'ປິດ',               th:'ปิด',                en:'Close',             zh:'关闭'       },
    'btn.confirm':       { lo:'ຢືນຢັນ',            th:'ยืนยัน',             en:'Confirm',           zh:'确认'       },
    'btn.add':           { lo:'ເພີ່ມ',              th:'เพิ่ม',              en:'Add',               zh:'添加'       },
    'btn.refresh':       { lo:'ໂຫຼດໃໝ່',           th:'รีเฟรช',             en:'Refresh',           zh:'刷新'       },
    'currency':          { lo:'ກີບ',               th:'ກີບ',                en:'LAK',               zh:'基普'       },
    'vat.label':         { lo:'VAT 7%',            th:'VAT 7%',             en:'VAT 7%',            zh:'增值税7%'   },
    'status.pending':    { lo:'ລໍຖ້າ',             th:'รอดำเนินการ',        en:'Pending',           zh:'待处理'     },
    'status.cooking':    { lo:'ກຳລັງປຸງ',          th:'กำลังปรุง',          en:'Cooking',           zh:'烹饪中'     },
    'status.done':       { lo:'ສຳເລັດ',            th:'สำเร็จ',             en:'Done',              zh:'完成'       },
    'status.cancel':     { lo:'ຍົກເລີກ',           th:'ยกเลิก',             en:'Cancelled',         zh:'已取消'     },
    'cat.all':           { lo:'ທັງໝົດ',            th:'ทั้งหมด',            en:'All',               zh:'全部'       },
    'cat.rice':          { lo:'ຂ້າວ',              th:'ข้าว',               en:'Rice',              zh:'米饭'       },
    'cat.noodle':        { lo:'ເຝີ/ກ໋ວຍ',          th:'เฝอ/ก๋วย',           en:'Noodles',           zh:'面条'       },
    'cat.grill':         { lo:'ປີ້ງ',              th:'ปิ้ง',               en:'Grilled',           zh:'烤制'       },
    'cat.drink':         { lo:'ດື່ມ',               th:'ดื่ม',               en:'Drinks',            zh:'饮品'       },
    'cat.dessert':       { lo:'ຂອງຫວານ',           th:'ของหวาน',            en:'Dessert',           zh:'甜点'       },
    'order.search.ph':   { lo:'ຄົ້ນຫາເມນູ...',    th:'ค้นหาเมนู...',       en:'Search menu...',    zh:'搜索菜单...' },
    'order.soldout':     { lo:'ໝົດ',               th:'หมด',                en:'Sold Out',          zh:'售罄'       },
    'order.notfound':    { lo:'ບໍ່ພົບເມນູ',        th:'ไม่พบเมนู',          en:'No menu found',     zh:'未找到菜单'  },
    'order.location':    { lo:'ທີ່ຕັ້ງຮ້ານ',       th:'ที่ตั้งร้าน',         en:'Location',          zh:'位置'       },
    'nav.order':         { lo:'ສັ່ງ',              th:'สั่ง',               en:'Order',             zh:'点餐'       },
    'nav.myorders':      { lo:'ອໍ້ເດີຂ້ອຍ',        th:'ออร์เดอร์ของฉัน',    en:'My Orders',         zh:'我的订单'   },
    'cart.title':        { lo:'ລາຍການສັ່ງ',        th:'รายการสั่ง',         en:'Your Order',        zh:'订单'       },
    'cart.empty':        { lo:'ຍັງບໍ່ມີລາຍການ',   th:'ยังไม่มีรายการ',     en:'Cart is empty',     zh:'购物车为空'  },
    'cart.empty.sub':    { lo:'ກາລຸນາເລືອກ',      th:'กรุณาเลือกอาหาร',    en:'Please select items',zh:'请选择菜品'  },
    'cart.subtotal':     { lo:'ລາຄາ',              th:'ราคา',               en:'Subtotal',          zh:'小计'       },
    'cart.total':        { lo:'ລວມທັງໝົດ',         th:'รวมทั้งหมด',         en:'Total',             zh:'合计'       },
    'cart.view':         { lo:'ເບິ່ງລາຍການສັ່ງ',   th:'ดูรายการสั่ง',       en:'View Order',        zh:'查看订单'   },
    'cart.confirm':      { lo:'ຢືນຢັນການສັ່ງ',     th:'ยืนยันการสั่ง',      en:'Place Order',       zh:'确认下单'   },
    'cart.clear':        { lo:'ລຶບທັງໝົດ',         th:'ลบทั้งหมด',          en:'Clear All',         zh:'清空'       },
    'modal.success':     { lo:'ສັ່ງສຳເລັດ!',       th:'สั่งสำเร็จ!',        en:'Order Placed!',     zh:'下单成功！'  },
    'modal.wait':        { lo:'ກາລຸນາລໍຖ້າ...',   th:'กรุณารอ...',         en:'Please wait...',    zh:'请稍候...'  },
    'modal.track':       { lo:'ຕິດຕາມອໍ້ເດີ →',   th:'ติดตามออร์เดอร์ →',  en:'Track Order →',     zh:'追踪订单 →' },
    'track.title':       { lo:'ອໍ້ເດີຂ້ອຍ',        th:'ออร์เดอร์ของฉัน',    en:'My Orders',         zh:'我的订单'   },
    'track.empty':       { lo:'ຍັງບໍ່ມີອໍ້ເດີ',    th:'ยังไม่มีออร์เดอร์',  en:'No orders yet',     zh:'暂无订单'   },
    'track.empty.sub':   { lo:'ກົດ "ສັ່ງ" ເພື່ອເລີ່ມ', th:'กด "สั่ง" เพื่อเริ่ม', en:'Tap "Order" to start', zh:'点击点餐开始' },
    'track.session':     { lo:'ລວມທີ່ສັ່ງ',        th:'รวมที่สั่ง',          en:'Session Total',     zh:'本次合计'   },
    'track.bill':        { lo:'ເບິ່ງບິນ',          th:'ดูบิล',              en:'View Bill',         zh:'查看账单'   },
    'track.step.rcv':    { lo:'ຮັບ',               th:'รับ',                en:'Received',          zh:'已接单'     },
    'track.step.cook':   { lo:'ປຸງ',               th:'ปรุง',               en:'Cooking',           zh:'烹饪'       },
    'track.step.done':   { lo:'ສຳເລັດ',            th:'เสร็จ',              en:'Ready',             zh:'完成'       },
    'bill.title':        { lo:'ໃບບິນ',             th:'ใบบิล',              en:'Bill',              zh:'账单'       },
    'bill.subtotal':     { lo:'ລາຄາສິນຄ້າ',        th:'ราคาสินค้า',         en:'Subtotal',          zh:'小计'       },
    'bill.total':        { lo:'ລວມທັງໝົດ',         th:'รวมทั้งหมด',         en:'Total',             zh:'合计'       },
    'bill.pay.title':    { lo:'ວິທີຊຳລະ',          th:'วิธีชำระ',           en:'Payment Method',    zh:'支付方式'   },
    'bill.pay.cash':     { lo:'ເງິນສົດ',            th:'เงินสด',             en:'Cash',              zh:'现金'       },
    'bill.pay.qr':       { lo:'QR Code',           th:'QR Code',            en:'QR Code',           zh:'二维码'     },
    'bill.pay.transfer': { lo:'ໂອນ',               th:'โอน',                en:'Transfer',          zh:'转账'       },
    'bill.paid':         { lo:'ຊຳລະແລ້ວ',          th:'ชำระแล้ว',           en:'Paid',              zh:'已付款'     },
    'bill.qr.scan':      { lo:'ສະແກນຊຳລະ',        th:'สแกนเพื่อชำระ',      en:'Scan to Pay',       zh:'扫码支付'   },
    'bill.footer':       { lo:'ຂໍຂອບໃຈ 🙏',        th:'ขอบคุณ 🙏',          en:'Thank you 🙏',      zh:'感谢惠顾 🙏' },
    'admin.dashboard':   { lo:'ໜ້າຫຼັກ',           th:'หน้าหลัก',           en:'Dashboard',         zh:'仪表盘'     },
    'admin.orders':      { lo:'ຄຳສັ່ງຊື້',          th:'คำสั่งซื้อ',          en:'Orders',            zh:'订单管理'   },
    'admin.products':    { lo:'ສິນຄ້າ / ເມນູ',     th:'สินค้า / เมนู',      en:'Products',          zh:'商品管理'   },
    'admin.inventory':   { lo:'ສ໊ຕ໊ອກ',            th:'สต็อกสินค้า',        en:'Inventory',         zh:'库存'       },
    'admin.reports':     { lo:'ລາຍງານ',            th:'รายงาน',             en:'Reports',           zh:'报表'       },
    'admin.users':       { lo:'ຜູ້ໃຊ້',             th:'ผู้ใช้งาน',           en:'Users',             zh:'用户管理'   },
    'admin.settings':    { lo:'ຕັ້ງຄ່າ',           th:'ตั้งค่า',            en:'Settings',          zh:'设置'       },
    'admin.logout':      { lo:'ອອກ',               th:'ออก',                en:'Logout',            zh:'退出'       },
    'admin.panel':       { lo:'Admin Panel',       th:'Admin Panel',        en:'Admin Panel',       zh:'管理面板'   },
    'dash.today.rev':    { lo:'ລາຍຮັບວັນນີ້',       th:'รายได้วันนี้',        en:"Today's Revenue",   zh:'今日营收'   },
    'dash.total.orders': { lo:'ຄຳສັ່ງທັງໝົດ',      th:'คำสั่งทั้งหมด',      en:'Total Orders',      zh:'总订单'     },
    'dash.products':     { lo:'ສິນຄ້າທີ່ຂາຍ',      th:'สินค้าที่ขาย',       en:'Active Products',   zh:'在售商品'   },
    'dash.tables':       { lo:'ໂຕ Online',         th:'โต๊ะ Online',        en:'Tables Online',     zh:'在线桌号'   },
    'dash.recent':       { lo:'ຄຳສັ່ງລ່າສຸດ',      th:'คำสั่งล่าสุด',       en:'Recent Orders',     zh:'最近订单'   },
    'dash.viewall':      { lo:'ເບິ່ງທັງໝົດ →',     th:'ดูทั้งหมด →',        en:'View All →',        zh:'查看全部 →' },
    'dash.sales':        { lo:'ຍອດຂາຍ 7 ວັນ',     th:'ยอดขาย 7 วัน',      en:'Sales 7 Days',      zh:'7天销售额'  },
    'dash.top':          { lo:'ເມນູຂາຍດີ',         th:'เมนูขายดี',          en:'Top Items',         zh:'热销商品'   },
    'dash.week':         { lo:'ອາທິດ',             th:'สัปดาห์',            en:'Week',              zh:'本周'       },
    'dash.month':        { lo:'ເດືອນ',             th:'เดือน',              en:'Month',             zh:'本月'       },
    'tbl.order':         { lo:'Order #',          th:'Order #',            en:'Order #',           zh:'订单号'     },
    'tbl.table':         { lo:'ໂຕ',               th:'โต๊ะ',               en:'Table',             zh:'桌号'       },
    'tbl.items':         { lo:'ລາຍການ',           th:'รายการ',             en:'Items',             zh:'商品'       },
    'tbl.total':         { lo:'ລວມ',              th:'รวม',                en:'Total',             zh:'金额'       },
    'tbl.time':          { lo:'ເວລາ',             th:'เวลา',               en:'Time',              zh:'时间'       },
    'tbl.status':        { lo:'ສະຖານະ',           th:'สถานะ',              en:'Status',            zh:'状态'       },
    'tbl.actions':       { lo:'ຈັດການ',            th:'จัดการ',             en:'Actions',           zh:'操作'       },
    'tbl.view':          { lo:'ເບິ່ງ',             th:'ดู',                 en:'View',              zh:'查看'       },
    'tbl.nodata':        { lo:'ບໍ່ມີຂໍ້ມູນ',       th:'ไม่มีข้อมูล',        en:'No data',           zh:'暂无数据'   },
    'prod.add':          { lo:'ເພີ່ມສິນຄ້າ',      th:'เพิ่มสินค้า',        en:'Add Product',       zh:'添加商品'   },
    'prod.name':         { lo:'ຊື່ສິນຄ້າ',         th:'ชื่อสินค้า',         en:'Product Name',      zh:'商品名称'   },
    'prod.price':        { lo:'ລາຄາ',             th:'ราคา',               en:'Price',             zh:'价格'       },
    'prod.cat':          { lo:'ໝວດໝູ່',            th:'หมวดหมู่',           en:'Category',          zh:'分类'       },
    'prod.stock':        { lo:'ສ໊ຕ໊ອກ',           th:'สต็อก',              en:'Stock',             zh:'库存'       },
    'prod.status':       { lo:'ສະຖານະ',           th:'สถานะ',              en:'Status',            zh:'状态'       },
    'prod.active':       { lo:'ຂາຍຢູ່',           th:'ขายอยู่',             en:'Active',            zh:'在售'       },
    'prod.soldout':      { lo:'ໝົດ',              th:'หมด',                en:'Sold Out',          zh:'售罄'       },
    'prod.hidden':       { lo:'ຊ່ອນ',             th:'ซ่อน',               en:'Hidden',            zh:'隐藏'       },
    'inv.adjust':        { lo:'ປັບສ໊ຕ໊ອກ',        th:'ปรับสต็อก',          en:'Adjust Stock',      zh:'调整库存'   },
    'inv.in':            { lo:'ເຂົ້າ (+)',         th:'เข้า (+)',            en:'Stock In',          zh:'入库'       },
    'inv.out':           { lo:'ອອກ (−)',           th:'ออก (−)',            en:'Stock Out',         zh:'出库'       },
    'inv.set':           { lo:'ຕັ້ງຄ່າໃໝ່',        th:'ตั้งค่าใหม่',        en:'Set Value',         zh:'设定值'     },
    'inv.qty':           { lo:'ຈຳນວນ',             th:'จำนวน',              en:'Quantity',          zh:'数量'       },
    'inv.note':          { lo:'ໝາຍເຫດ',            th:'หมายเหตุ',           en:'Note',              zh:'备注'       },
    'inv.history':       { lo:'ປະຫວັດ',            th:'ประวัติ',             en:'History',           zh:'记录'       },
    'inv.lowstock':      { lo:'ສ໊ຕ໊ອກໃກ້ໝົດ:',    th:'สต็อกใกล้หมด:',     en:'Low stock:',        zh:'库存不足:'  },
    'rep.revenue':       { lo:'ລາຍຮັບລວມ',         th:'รายได้รวม',          en:'Total Revenue',     zh:'总营收'     },
    'rep.completed':     { lo:'ອໍ້ເດີສຳເລັດ',       th:'ออร์เดอร์สำเร็จ',   en:'Completed Orders',  zh:'完成订单'   },
    'rep.avg':           { lo:'ສະເລ່ຍ/ອໍ້ເດີ',      th:'เฉลี่ย/ออร์เดอร์',  en:'Avg per Order',     zh:'均单价'     },
    'rep.export':        { lo:'ສົ່ງອອກ CSV',        th:'Export CSV',         en:'Export CSV',        zh:'导出CSV'    },
    'user.add':          { lo:'ເພີ່ມຜູ້ໃຊ້',        th:'เพิ่มผู้ใช้',        en:'Add User',          zh:'添加用户'   },
    'user.role':         { lo:'ສິດທິ',              th:'บทบาท',              en:'Role',              zh:'角色'       },
    'user.role.admin':   { lo:'Super Admin',        th:'Super Admin',        en:'Super Admin',       zh:'超级管理员'  },
    'user.role.mgr':     { lo:'ຜູ້ຈັດການ',           th:'ผู้จัดการ',           en:'Manager',           zh:'经理'       },
    'user.role.cash':    { lo:'ພະນັກງານ',           th:'พนักงาน',            en:'Cashier',           zh:'收银员'     },
    'user.lastlogin':    { lo:'ເຂົ້າລ່າສຸດ',        th:'เข้าล่าสุด',         en:'Last Login',        zh:'最近登录'   },
    'user.active':       { lo:'ໃຊ້ງານ',            th:'ใช้งาน',             en:'Active',            zh:'启用'       },
    'user.inactive':     { lo:'ລະງັບ',             th:'ระงับ',              en:'Inactive',          zh:'停用'       },
    'login.btn':         { lo:'ເຂົ້າສູ່ລະບົບ',      th:'เข้าสู่ระบบ',        en:'Sign In',           zh:'登录'       },
    'login.error':       { lo:'ຊື່ຜູ້ໃຊ້/ລະຫັດ ບໍ່ຖືກ', th:'Username/Password ผิด', en:'Invalid credentials', zh:'用户名或密码错误' },
    'set.store':         { lo:'ຂໍ້ມູນຮ້ານ',          th:'ข้อมูลร้าน',         en:'Store Info',        zh:'店铺信息'   },
    'set.tax':           { lo:'ພາສີ',               th:'ภาษี',               en:'Tax',               zh:'税率'       },
    'set.receipt':       { lo:'ໃບບິນ',              th:'ใบเสร็จ',            en:'Receipt',           zh:'收据'       },
    'set.security':      { lo:'ຄວາມປອດໄພ',          th:'ความปลอดภัย',        en:'Security',          zh:'安全'       },
    'set.danger':        { lo:'Zone ອັນຕະລາຍ',      th:'Zone อันตราย',       en:'Danger Zone',       zh:'危险操作'   },
    'set.backup':        { lo:'ສຳຮອງຂໍ້ມູນ',        th:'สำรองข้อมูล',        en:'Backup',            zh:'备份'       },
    'set.reset':         { lo:'ລຶບຂໍ້ມູນທັງໝົດ',    th:'รีเซ็ตทั้งหมด',      en:'Reset All',         zh:'重置数据'   },
  };

  const KEY = 'pos_lang';
  let cur = localStorage.getItem(KEY) || 'lo';

  function t(key) {
    const e = T[key];
    if (!e) return key;
    return e[cur] || e['en'] || key;
  }

  function setLang(code) {
    cur = code;
    localStorage.setItem(KEY, code);
    const lg = LANGS.find(l => l.code === code);
    // Update button
    const fl = document.getElementById('lf'); if (fl && lg) fl.textContent = lg.flag;
    const ll = document.getElementById('ll'); if (ll && lg) ll.textContent = lg.label;
    // Update active
    document.querySelectorAll('.lo-opt').forEach(b => b.classList.toggle('active', b.dataset.code === code));
    document.getElementById('langDropdown')?.classList.remove('open');
    document.documentElement.lang = code;
    window.dispatchEvent(new CustomEvent('langchange', { detail: code }));
  }

  function getLang() { return cur; }

  function buildSwitcher(mountEl) {
    if (!mountEl) return;
    const lg = LANGS.find(l => l.code === cur) || LANGS[0];
    const wrap = document.createElement('div');
    wrap.className = 'lang-switcher';
    wrap.innerHTML = `
      <button class="lang-trigger" id="langTrigger" type="button">
        <span id="lf">${lg.flag}</span>
        <span id="ll">${lg.label}</span>
        <span style="font-size:.55rem;color:var(--muted,#888);margin-left:1px">▾</span>
      </button>
      <div class="lang-dropdown" id="langDropdown">
        ${LANGS.map(l=>`
        <button class="lo-opt${l.code===cur?' active':''}" data-code="${l.code}" type="button">
          <span>${l.flag}</span><span>${l.label}</span>
        </button>`).join('')}
      </div>`;
    mountEl.appendChild(wrap);

    wrap.querySelector('#langTrigger').addEventListener('click', e => {
      e.stopPropagation();
      document.getElementById('langDropdown').classList.toggle('open');
    });
    wrap.querySelectorAll('.lo-opt').forEach(btn => {
      btn.addEventListener('click', e => { e.stopPropagation(); setLang(btn.dataset.code); });
    });
    document.addEventListener('click', () => document.getElementById('langDropdown')?.classList.remove('open'));
  }

  return { t, setLang, getLang, buildSwitcher, LANGS };
})();
window.i18n = i18n;