// app.js - Logika Interaktif Web Profile Lukmanisme
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initTrackFilter();
  initPosSimulator();
  initConsultationModal();
  initSoundEffects();
});

// ==========================================
// 1. Audio Effect Synthesizer (Web Audio API)
// ==========================================
let audioCtx = null;
function getAudioContext() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

function playMechanicalClick() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.04);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  } catch (e) {
    console.debug('Audio not allowed yet:', e);
  }
}

function playBeepSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  } catch (e) {}
}

function initSoundEffects() {
  document.querySelectorAll('button, a.btn-action').forEach(el => {
    el.addEventListener('click', () => {
      playMechanicalClick();
    });
  });
}

// ==========================================
// 2. Theme Management (Dark / Light Mode)
// ==========================================
function initTheme() {
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  const themeText = document.getElementById('theme-text');

  const savedTheme = localStorage.getItem('lukmanisme-theme') || 
    (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem('lukmanisme-theme', newTheme);
      playMechanicalClick();
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeIcon && themeText) {
      if (theme === 'dark') {
        themeIcon.innerHTML = `
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
        `;
        themeText.textContent = 'Light Mode';
      } else {
        themeIcon.innerHTML = `
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
          </svg>
        `;
        themeText.textContent = 'Dark Mode';
      }
    }
  }
}

// ==========================================
// 3. Dual-Track Quick Filter / View Switcher
// ==========================================
function initTrackFilter() {
  const tabs = document.querySelectorAll('.track-tab-btn');
  const balanjoSections = document.querySelectorAll('.track-balanjo');
  const customSections = document.querySelectorAll('.track-custom');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const mode = tab.dataset.mode;
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      if (mode === 'all') {
        balanjoSections.forEach(s => s.classList.remove('hidden'));
        customSections.forEach(s => s.classList.remove('hidden'));
      } else if (mode === 'balanjo') {
        balanjoSections.forEach(s => s.classList.remove('hidden'));
        customSections.forEach(s => s.classList.add('hidden'));
      } else if (mode === 'custom') {
        balanjoSections.forEach(s => s.classList.add('hidden'));
        customSections.forEach(s => s.classList.remove('hidden'));
      }
    });
  });
}

// ==========================================
// 4. Interactive Live POS Playground
// ==========================================
const POS_CATALOGS = {
  warung: {
    title: 'Warung Jangkung (Sop Kaki & Sate)',
    badge: 'F&B Mode • Meja & Bungkus',
    items: [
      { id: 'w1', name: 'Sop Kaki Kambing Spesial', price: 35000, desc: 'Porsi kuah rempah susu gurih' },
      { id: 'w2', name: 'Sate Kambing (10 Tusuk)', price: 40000, desc: 'Daging empuk bumbu kecap pedas' },
      { id: 'w3', name: 'Nasi Putih Pulen', price: 5000, desc: 'Bawang goreng tabur' },
      { id: 'w4', name: 'Es Teh Manis Segar', price: 4000, desc: 'Gula asli seduh teko' }
    ]
  },
  laundry: {
    title: 'Laundry Datz (Express & Setrika)',
    badge: 'Jasa Laundry • Hitung Kiloan & Satuan',
    items: [
      { id: 'l1', name: 'Cuci Komplit Reguler (Per Kg)', price: 7000, desc: 'Cuci, kering, setrika rapi (2-3 hari)', unit: 'kg' },
      { id: 'l2', name: 'Cuci Kilat Express 24 Jam (Per Kg)', price: 12000, desc: 'Prioritas selesai dalam 1 hari', unit: 'kg' },
      { id: 'l3', name: 'Setrika Uap Saja (Per Kg)', price: 5000, desc: 'Pakaian rapi & wangi higienis', unit: 'kg' },
      { id: 'l4', name: 'Bed Cover King Size (Satuan)', price: 25000, desc: 'Perawatan khusus wangi tahan lama', unit: 'pcs' }
    ]
  },
  ritel: {
    title: 'Toko Kelontong & Ritel',
    badge: 'Ritel Mode • Barcode & Stok',
    items: [
      { id: 'r1', name: 'Minyak Goreng Pouch 1 Liter', price: 16500, desc: 'Stok: 24 pouch' },
      { id: 'r2', name: 'Beras Premium 5 Kg', price: 69000, desc: 'Stok: 12 karung' },
      { id: 'r3', name: 'Kopi Bubuk Sachet (1 Renceng)', price: 15000, desc: 'Stok: 30 renceng' },
      { id: 'r4', name: 'Telur Ayam Negeri (1 Kg)', price: 28000, desc: 'Stok: 15 kg' }
    ]
  }
};

let currentSector = 'warung';
let cart = {};
let orderType = 'dine_in'; // dine_in vs takeaway
let paymentType = 'lunas'; // lunas vs pending

function initPosSimulator() {
  renderSectorCatalog();

  // Tab mode listener
  document.querySelectorAll('.pos-sector-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pos-sector-btn').forEach(b => {
        b.classList.remove('bg-emerald-500', 'text-black', 'border-emerald-500');
        b.classList.add('bg-zinc-800', 'text-zinc-300');
      });
      btn.classList.add('bg-emerald-500', 'text-black', 'border-emerald-500');
      btn.classList.remove('bg-zinc-800', 'text-zinc-300');

      currentSector = btn.dataset.sector;
      cart = {};
      renderSectorCatalog();
      updateCartDisplay();
      playMechanicalClick();
    });
  });

  // Order option toggles
  const dineInBtn = document.getElementById('pos-order-dinein');
  const takeawayBtn = document.getElementById('pos-order-takeaway');
  if (dineInBtn && takeawayBtn) {
    dineInBtn.addEventListener('click', () => {
      orderType = 'dine_in';
      dineInBtn.classList.add('bg-amber-500', 'text-black');
      dineInBtn.classList.remove('bg-zinc-800', 'text-zinc-400');
      takeawayBtn.classList.remove('bg-amber-500', 'text-black');
      takeawayBtn.classList.add('bg-zinc-800', 'text-zinc-400');
    });

    takeawayBtn.addEventListener('click', () => {
      orderType = 'takeaway';
      takeawayBtn.classList.add('bg-amber-500', 'text-black');
      takeawayBtn.classList.remove('bg-zinc-800', 'text-zinc-400');
      dineInBtn.classList.remove('bg-amber-500', 'text-black');
      dineInBtn.classList.add('bg-zinc-800', 'text-zinc-400');
    });
  }

  // Print Receipt Button
  const printBtn = document.getElementById('pos-print-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      generateThermalReceipt();
    });
  }

  // Reset Cart Button
  const clearBtn = document.getElementById('pos-clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      cart = {};
      updateCartDisplay();
      const receiptContainer = document.getElementById('pos-receipt-output');
      if (receiptContainer) receiptContainer.innerHTML = '';
      playMechanicalClick();
    });
  }
}

function renderSectorCatalog() {
  const container = document.getElementById('pos-items-grid');
  const sectorTitle = document.getElementById('pos-sector-title');
  const sectorBadge = document.getElementById('pos-sector-badge');

  const sectorData = POS_CATALOGS[currentSector];
  if (sectorTitle) sectorTitle.textContent = sectorData.title;
  if (sectorBadge) sectorBadge.textContent = sectorData.badge;

  if (!container) return;
  container.innerHTML = '';

  sectorData.items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'p-3 rounded-xl border border-zinc-700/60 bg-zinc-900/70 hover:border-emerald-500/60 transition cursor-pointer flex flex-col justify-between select-none';
    card.innerHTML = `
      <div>
        <div class="flex items-start justify-between gap-1">
          <h4 class="font-semibold text-sm text-zinc-100">${item.name}</h4>
          <span class="text-xs px-2 py-0.5 rounded font-mono font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-800/40">
            ${formatRupiah(item.price)}
          </span>
        </div>
        <p class="text-xs text-zinc-400 mt-1">${item.desc}</p>
      </div>
      <button class="mt-3 w-full py-1.5 px-3 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-black rounded-lg text-xs font-bold transition flex items-center justify-center gap-1">
        <span>+ Tambah</span>
      </button>
    `;

    card.addEventListener('click', () => {
      addItemToCart(item);
      playBeepSound();
    });

    container.appendChild(card);
  });
}

function addItemToCart(item) {
  if (cart[item.id]) {
    cart[item.id].qty += 1;
  } else {
    cart[item.id] = {
      id: item.id,
      name: item.name,
      price: item.price,
      unit: item.unit || 'x',
      qty: 1
    };
  }
  updateCartDisplay();
}

function removeItemFromCart(id) {
  if (cart[id]) {
    if (cart[id].qty > 1) {
      cart[id].qty -= 1;
    } else {
      delete cart[id];
    }
    updateCartDisplay();
    playMechanicalClick();
  }
}

function updateCartDisplay() {
  const cartList = document.getElementById('pos-cart-list');
  const totalAmountEl = document.getElementById('pos-total-amount');
  const printBtn = document.getElementById('pos-print-btn');

  if (!cartList) return;
  cartList.innerHTML = '';

  const itemKeys = Object.keys(cart);
  let total = 0;

  if (itemKeys.length === 0) {
    cartList.innerHTML = `
      <div class="p-6 text-center text-zinc-500 text-xs font-mono">
        Belum ada item dipilih.<br>Ketuk item menu di sebelah kiri untuk menambah ke antrean kasir.
      </div>
    `;
    if (totalAmountEl) totalAmountEl.textContent = 'Rp 0';
    if (printBtn) printBtn.disabled = true;
    return;
  }

  if (printBtn) printBtn.disabled = false;

  itemKeys.forEach(key => {
    const item = cart[key];
    const subtotal = item.price * item.qty;
    total += subtotal;

    const row = document.createElement('div');
    row.className = 'flex items-center justify-between text-xs py-1.5 border-b border-zinc-800 font-mono';
    row.innerHTML = `
      <div class="flex-1 pr-2 truncate">
        <span class="text-zinc-200 font-medium">${item.name}</span>
        <div class="text-[10px] text-zinc-500">${formatRupiah(item.price)} x ${item.qty}</div>
      </div>
      <div class="flex items-center gap-2">
        <span class="font-bold text-emerald-400">${formatRupiah(subtotal)}</span>
        <div class="flex items-center gap-1 bg-zinc-800 rounded px-1">
          <button class="px-1 text-zinc-400 hover:text-red-400 font-bold" onclick="removeItemFromCart('${item.id}')">-</button>
          <span class="text-zinc-200 font-bold">${item.qty}</span>
          <button class="px-1 text-zinc-400 hover:text-emerald-400 font-bold" onclick="addItemToCart({id:'${item.id}', name:'${item.name}', price:${item.price}})">+</button>
        </div>
      </div>
    `;
    cartList.appendChild(row);
  });

  if (totalAmountEl) totalAmountEl.textContent = formatRupiah(total);
}

// Make functions accessible from onclick HTML attributes
window.addItemToCart = (item) => addItemToCart(item);
window.removeItemFromCart = (id) => removeItemFromCart(id);

function generateThermalReceipt() {
  const receiptContainer = document.getElementById('pos-receipt-output');
  if (!receiptContainer) return;

  const itemKeys = Object.keys(cart);
  if (itemKeys.length === 0) return;

  playBeepSound();

  const sectorData = POS_CATALOGS[currentSector];
  const now = new Date();
  const dateStr = now.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  const trxId = 'TRX-' + Math.floor(100000 + Math.random() * 900000);

  let total = 0;
  let itemsHtml = '';

  itemKeys.forEach(k => {
    const item = cart[k];
    const subtotal = item.price * item.qty;
    total += subtotal;
    itemsHtml += `
      <div class="flex justify-between py-0.5">
        <span>${item.qty}x ${item.name.substring(0, 18)}</span>
        <span>${formatRupiah(subtotal)}</span>
      </div>
    `;
  });

  const orderLabel = orderType === 'dine_in' ? 'MEJA #04 (DINE IN)' : 'BUNGKUS (TAKEAWAY)';
  const statusLabel = currentSector === 'laundry' 
    ? 'STATUS: [DITERIMA - TGL CUCI]' 
    : 'LUNAS (CASH/QRIS)';

  receiptContainer.innerHTML = `
    <div class="receipt-paper animate-print p-4 rounded-t-lg max-w-sm mx-auto text-xs text-zinc-200 border-dashed border-zinc-600 bg-zinc-950 font-mono shadow-2xl">
      <div class="text-center border-b border-zinc-700/80 pb-2 mb-2">
        <div class="font-bold text-sm tracking-wider uppercase">${sectorData.title}</div>
        <div class="text-[10px] text-zinc-400">Powered by Balanjo POS / Lukmanisme</div>
        <div class="text-[10px] text-emerald-400 mt-1">● THERMAL PRINTER 58MM EMULATOR</div>
      </div>
      
      <div class="text-[10px] text-zinc-400 border-b border-zinc-700/80 pb-2 mb-2 space-y-0.5">
        <div class="flex justify-between">
          <span>NO: ${trxId}</span>
          <span>${timeStr}</span>
        </div>
        <div class="flex justify-between">
          <span>TGL: ${dateStr}</span>
          <span class="text-amber-400 font-bold">${orderLabel}</span>
        </div>
      </div>

      <div class="space-y-1 border-b border-zinc-700/80 pb-2 mb-2">
        ${itemsHtml}
      </div>

      <div class="space-y-1 text-[11px] pb-2 mb-2 border-b border-zinc-700/80">
        <div class="flex justify-between font-bold text-sm text-emerald-400">
          <span>TOTAL BAYAR:</span>
          <span>${formatRupiah(total)}</span>
        </div>
        <div class="flex justify-between text-zinc-400">
          <span>STATUS:</span>
          <span class="font-bold text-zinc-200">${statusLabel}</span>
        </div>
      </div>

      <div class="text-center text-[10px] text-zinc-500 pt-1">
        *** TERIMA KASIH ATAS KUNJUNGANNYA ***<br>
        <span class="text-zinc-600">Simulasi POS Lapangan Tanpa Ribet</span>
      </div>
    </div>
  `;

  // Scroll receipt into view smoothly
  receiptContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function formatRupiah(amount) {
  return 'Rp ' + amount.toLocaleString('id-ID');
}

// ==========================================
// 5. Consultation & WhatsApp Modal Dialog
// ==========================================
function initConsultationModal() {
  const dialog = document.getElementById('consultation-dialog');
  const openButtons = document.querySelectorAll('.open-consultation-btn');
  const closeButton = document.getElementById('close-dialog-btn');
  const form = document.getElementById('consultation-form');

  if (!dialog) return;

  // Open modal handler
  openButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const defaultTopic = btn.dataset.topic || 'balanjo';
      const topicSelect = document.getElementById('consult-topic');
      if (topicSelect) topicSelect.value = defaultTopic;
      
      dialog.showModal();
      playMechanicalClick();
    });
  });

  // Close modal button
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      dialog.close();
      playMechanicalClick();
    });
  }

  // Modern Light Dismiss: Close on backdrop click
  dialog.addEventListener('click', (e) => {
    const rect = dialog.getBoundingClientRect();
    const isInDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      dialog.close();
    }
  });

  // Handle WhatsApp submit
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('consult-name')?.value || 'Sahabat UMKM';
      const businessType = document.getElementById('consult-business')?.value || 'Warung / Laundry';
      const topic = document.getElementById('consult-topic')?.value || 'balanjo';
      const note = document.getElementById('consult-note')?.value || '';

      let topicLabel = 'Coba Demo Balanjo POS (Langganan)';
      if (topic === 'custom') topicLabel = 'Konsultasi Sistem Beli Lepas (Tanpa Biaya Bulanan)';
      if (topic === 'case_study') topicLabel = 'Diskusi Teknis Portofolio (Warung Jangkung/Laundry Datz)';

      const message = `Halo Mas Lukman (Lukmanisme),\n\nSaya ${name} dari usaha *${businessType}*.\nSaya tertarik dengan: *${topicLabel}*.\n\nCatatan tambahan: ${note || '-'}\n\nMohon info detail dan waktu untuk diskusi. Terima kasih!`;
      
      const phone = '6281234567890'; // Placeholder - will replace with user's preferred number
      const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      
      window.open(waUrl, '_blank');
      dialog.close();
    });
  }
}
