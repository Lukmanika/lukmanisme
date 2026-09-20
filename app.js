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
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch (e) {
    return null;
  }
}

function playMechanicalClick() {
  try {
    const ctx = getAudioContext();
    if (!ctx || ctx.state !== 'running') return;
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
  } catch (e) {}
}

function playBeepSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx || ctx.state !== 'running') return;
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

function playPrintSound() {
  try {
    const ctx = getAudioContext();
    if (!ctx || ctx.state !== 'running') return;
    // Simulate thermal gear stepper sound
    for (let i = 0; i < 4; i++) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(400 + i * 50, ctx.currentTime + i * 0.1);
      gain.gain.setValueAtTime(0.04, ctx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.06);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + i * 0.1);
      osc.stop(ctx.currentTime + i * 0.1 + 0.07);
    }
  } catch (e) {}
}

function initSoundEffects() {
  document.querySelectorAll('button:not(.silent), a.btn-action').forEach(el => {
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

function initPosSimulator() {
  renderSectorCatalog();
  updateCartDisplay();

  // Sector Mode Buttons
  document.querySelectorAll('.pos-sector-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pos-sector-btn').forEach(b => {
        b.classList.remove('bg-emerald-500', 'text-black', 'font-bold');
        b.classList.add('text-zinc-400');
      });
      btn.classList.add('bg-emerald-500', 'text-black', 'font-bold');
      btn.classList.remove('text-zinc-400');

      currentSector = btn.dataset.sector;
      cart = {};
      renderSectorCatalog();
      updateCartDisplay();
      
      const receiptContainer = document.getElementById('pos-receipt-output');
      if (receiptContainer) receiptContainer.innerHTML = '';
      playMechanicalClick();
    });
  });

  // Dine-in vs Takeaway Buttons
  const dineInBtn = document.getElementById('pos-order-dinein');
  const takeawayBtn = document.getElementById('pos-order-takeaway');
  if (dineInBtn && takeawayBtn) {
    dineInBtn.addEventListener('click', () => {
      orderType = 'dine_in';
      dineInBtn.classList.add('bg-amber-500', 'text-black');
      dineInBtn.classList.remove('bg-transparent', 'text-[var(--text-secondary)]');
      takeawayBtn.classList.remove('bg-amber-500', 'text-black');
      takeawayBtn.classList.add('bg-transparent', 'text-[var(--text-secondary)]');
      playMechanicalClick();
    });

    takeawayBtn.addEventListener('click', () => {
      orderType = 'takeaway';
      takeawayBtn.classList.add('bg-amber-500', 'text-black');
      takeawayBtn.classList.remove('bg-transparent', 'text-[var(--text-secondary)]');
      dineInBtn.classList.remove('bg-amber-500', 'text-black');
      dineInBtn.classList.add('bg-transparent', 'text-[var(--text-secondary)]');
      playMechanicalClick();
    });
  }

  // Print Receipt Button
  const printBtn = document.getElementById('pos-print-btn');
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      generateThermalReceipt();
    });
  }

  // Clear Cart Button
  const clearBtn = document.getElementById('pos-clear-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      cart = {};
      updateCartDisplay();
      renderSectorCatalog();
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
    const qtyInCart = cart[item.id] ? cart[item.id].qty : 0;
    const card = document.createElement('div');
    card.className = `p-4 rounded-xl border transition cursor-pointer flex flex-col justify-between select-none ${
      qtyInCart > 0 
        ? 'border-emerald-500 bg-[var(--bg-tertiary)] shadow-md shadow-emerald-500/10' 
        : 'border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-emerald-500/50'
    }`;

    card.innerHTML = `
      <div>
        <div class="flex items-start justify-between gap-2">
          <h4 class="font-bold text-sm text-[var(--text-primary)] leading-tight">${item.name}</h4>
          <span class="text-xs px-2 py-0.5 rounded font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/30 whitespace-nowrap">
            ${formatRupiah(item.price)}
          </span>
        </div>
        <p class="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">${item.desc}</p>
      </div>

      <div class="mt-4 pt-3 border-t border-[var(--border-color)] flex items-center justify-between gap-2">
        <div>
          ${qtyInCart > 0 
            ? `<span class="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-500 text-black">✓ ${qtyInCart}x di antrean</span>` 
            : `<span class="text-[11px] text-[var(--text-muted)] font-mono">Ketuk untuk pilih</span>`
          }
        </div>
        <button type="button" class="btn-add-item py-1.5 px-3 rounded-lg text-xs font-bold font-mono transition flex items-center gap-1 ${
          qtyInCart > 0
            ? 'bg-emerald-500 text-black hover:bg-emerald-400'
            : 'bg-emerald-500/15 hover:bg-emerald-500 text-emerald-500 hover:text-black'
        }">
          <span>+ Tambah</span>
        </button>
      </div>
    `;

    // Click whole card
    card.addEventListener('click', () => {
      addItemToCartById(item.id);
    });

    // Click button explicitly
    const addBtn = card.querySelector('.btn-add-item');
    if (addBtn) {
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addItemToCartById(item.id);
      });
    }

    container.appendChild(card);
  });
}

function addItemToCartById(itemId) {
  const sectorData = POS_CATALOGS[currentSector];
  const item = sectorData.items.find(i => i.id === itemId);
  if (!item) return;

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

  playBeepSound();
  updateCartDisplay();
  renderSectorCatalog();
}

function removeItemFromCart(itemId) {
  if (cart[itemId]) {
    if (cart[itemId].qty > 1) {
      cart[itemId].qty -= 1;
    } else {
      delete cart[itemId];
    }
    playMechanicalClick();
    updateCartDisplay();
    renderSectorCatalog();
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
      <div class="p-6 text-center text-[var(--text-muted)] text-xs font-mono border border-dashed border-[var(--border-color)] rounded-xl">
        <div class="text-base mb-1">🛒</div>
        Belum ada item di antrean.<br>
        <span class="text-[var(--text-secondary)]">Ketuk menu di sebelah kiri untuk menambah.</span>
      </div>
    `;
    if (totalAmountEl) totalAmountEl.textContent = 'Rp 0';
    if (printBtn) {
      printBtn.disabled = true;
      printBtn.classList.add('opacity-40', 'cursor-not-allowed');
    }
    return;
  }

  if (printBtn) {
    printBtn.disabled = false;
    printBtn.classList.remove('opacity-40', 'cursor-not-allowed');
  }

  itemKeys.forEach(key => {
    const item = cart[key];
    const subtotal = item.price * item.qty;
    total += subtotal;

    const row = document.createElement('div');
    row.className = 'flex items-center justify-between text-xs py-2 px-2.5 rounded-lg border border-[var(--border-color)] bg-[var(--bg-tertiary)] font-mono';
    row.innerHTML = `
      <div class="flex-1 pr-2 truncate">
        <div class="text-[var(--text-primary)] font-bold truncate">${item.name}</div>
        <div class="text-[11px] text-[var(--text-muted)]">${formatRupiah(item.price)} &times; ${item.qty}</div>
      </div>
      <div class="flex items-center gap-3">
        <span class="font-bold text-emerald-500 font-mono text-xs">${formatRupiah(subtotal)}</span>
        <div class="flex items-center gap-1 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md px-1 py-0.5">
          <button type="button" class="w-5 h-5 flex items-center justify-center text-[var(--text-secondary)] hover:text-red-400 font-bold" onclick="removeItemFromCart('${item.id}')">-</button>
          <span class="text-[var(--text-primary)] font-bold text-xs px-1">${item.qty}</span>
          <button type="button" class="w-5 h-5 flex items-center justify-center text-[var(--text-secondary)] hover:text-emerald-400 font-bold" onclick="addItemToCartById('${item.id}')">+</button>
        </div>
      </div>
    `;
    cartList.appendChild(row);
  });

  if (totalAmountEl) totalAmountEl.textContent = formatRupiah(total);
}

function generateThermalReceipt() {
  const receiptContainer = document.getElementById('pos-receipt-output');
  if (!receiptContainer) return;

  const itemKeys = Object.keys(cart);
  if (itemKeys.length === 0) return;

  playPrintSound();

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
      <div class="flex justify-between py-0.5 text-zinc-900">
        <span class="font-medium">${item.qty}x ${item.name.substring(0, 19)}</span>
        <span class="font-bold">${formatRupiah(subtotal)}</span>
      </div>
    `;
  });

  const orderLabel = orderType === 'dine_in' ? 'MEJA #04 (DINE IN)' : 'BUNGKUS (TAKEAWAY)';
  const statusLabel = currentSector === 'laundry' 
    ? 'STATUS: [DITERIMA - TGL CUCI]' 
    : 'LUNAS (CASH/QRIS)';

  receiptContainer.innerHTML = `
    <div class="receipt-paper animate-print p-5 rounded-t-lg max-w-sm mx-auto text-xs font-mono">
      <div class="text-center border-b border-zinc-300 pb-3 mb-3">
        <div class="font-extrabold text-sm tracking-wider uppercase text-zinc-950">${sectorData.title}</div>
        <div class="text-[10px] text-zinc-600 font-semibold">Sistem Kasir Mobile Balanjo POS</div>
        <div class="inline-flex items-center gap-1 text-[10px] text-emerald-800 font-bold mt-1 bg-emerald-100 px-2 py-0.5 rounded">
          <span>● THERMAL 58MM BLUETOOTH READY</span>
        </div>
      </div>
      
      <div class="text-[10px] text-zinc-600 border-b border-zinc-300 pb-2 mb-2 space-y-1">
        <div class="flex justify-between">
          <span>NO: ${trxId}</span>
          <span>${timeStr}</span>
        </div>
        <div class="flex justify-between">
          <span>TGL: ${dateStr}</span>
          <span class="text-zinc-900 font-bold">${orderLabel}</span>
        </div>
      </div>

      <div class="space-y-1.5 border-b border-zinc-300 pb-3 mb-3">
        ${itemsHtml}
      </div>

      <div class="space-y-1 text-xs pb-3 mb-3 border-b-2 border-zinc-900">
        <div class="flex justify-between font-black text-sm text-zinc-950">
          <span>TOTAL BAYAR:</span>
          <span>${formatRupiah(total)}</span>
        </div>
        <div class="flex justify-between text-zinc-600 text-[11px] pt-1">
          <span>STATUS:</span>
          <span class="font-bold text-zinc-900">${statusLabel}</span>
        </div>
      </div>

      <!-- Barcode simulation -->
      <div class="text-center pt-1 pb-2">
        <div class="font-mono text-base tracking-[0.25em] font-black text-zinc-800 select-none">
          ||| | |||| | || ||||| | |||
        </div>
        <div class="text-[9px] text-zinc-500 font-mono tracking-widest mt-0.5">${trxId}</div>
      </div>

      <div class="text-center text-[10px] text-zinc-600 pt-1 border-t border-zinc-200">
        *** TERIMA KASIH ATAS KUNJUNGANNYA ***<br>
        <span class="text-zinc-500 text-[9px]">Sistem Kasir Lapangan oleh Lukmanisme</span>
      </div>
    </div>

    <!-- Success Toast Notification -->
    <div class="mt-3 text-center">
      <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-xs font-mono font-bold border border-emerald-500/30">
        <span>✓</span> Nota Berhasil Dicetak ke Printer Thermal
      </span>
    </div>
  `;

  // Scroll receipt smoothly into view
  setTimeout(() => {
    receiptContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
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
      
      const phone = '6281234567890'; // Placeholder - replace with actual number
      const waUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      
      window.open(waUrl, '_blank');
      dialog.close();
    });
  }
}
