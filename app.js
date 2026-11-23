/* ==========================================================================
   TEGHI — LUXURY FABRICS & TEXTILES
   Clean, Ultra-Fast Client Showroom Application Logic
   ========================================================================== */

(function () {
  'use strict';

  // 1. Default Luxury Fabric Catalog
  const DEFAULT_FABRICS = [
    {
      id: 'heavy-worked-net',
      name: 'Imported Heavy Worked Net',
      category: 'Net',
      image: 'images/heavy-worked-net.jpg',
      perMetrePrice: 2450,
      hasDressSet: true,
      dressSetPrice: 6800,
      dressSetIncludes: 'Heavy Worked Net (2.5m) + Matching Embroidered Dupatta + Soft Cotton Astar (Lining) + Shantoon Salwar Fabric (2.5m)',
      badge: 'Signature Showcase',
      description: 'Imported sheer tulle net adorned with intricate hand-embroidered metallic zardozi, micro-sequins, and delicate pearl detailing. Perfect for couture bridal lehengas, festive anarkalis, and luxury suits.',
      swatches: [
        { name: 'Champagne Ivory', hex: '#F3EDE2' },
        { name: 'Rose Gold Zari', hex: '#B76E79' },
        { name: 'Royal Emerald', hex: '#1B4D3E' },
        { name: 'Midnight Navy', hex: '#1A2434' },
        { name: 'Ruby Crimson', hex: '#841B2D' },
        { name: 'Antique Copper', hex: '#8F5E3D' },
        { name: 'Pale Mint', hex: '#D8F3DC' },
        { name: 'Dusty Lilac', hex: '#C7B8D6' }
      ],
      inStock: true
    },
    {
      id: 'pure-silk',
      name: 'Pure Mulberry & Raw Silk',
      category: 'Silk',
      image: 'images/pure-silk.jpg',
      perMetrePrice: 1650,
      hasDressSet: false,
      badge: 'Heritage Weave',
      description: 'Pure mulberry raw silk crafted with distinctive natural slub texture and authentic royal luster. Exceptionally breathable, structured, and timeless for festive sherwanis, sarees, and couture drapes.',
      swatches: [
        { name: 'Peacock Green', hex: '#124E52' },
        { name: 'Mustard Gold', hex: '#DDA123' },
        { name: 'Imperial Wine', hex: '#5C1D38' },
        { name: 'Natural Ecru', hex: '#EBE3D5' },
        { name: 'Royal Rust', hex: '#A84C27' },
        { name: 'Powder Blue', hex: '#B0CBE2' }
      ],
      inStock: true
    },
    {
      id: 'cotton-satin',
      name: 'Lustrous Cotton Satin',
      category: 'Cotton Satin',
      image: 'images/cotton-satin.jpg',
      perMetrePrice: 750,
      hasDressSet: false,
      badge: 'Everyday Luxury',
      description: 'Finest long-staple combed cotton woven in a high-density sateen finish. Combines the feather-light breathability of pure cotton with the silky sheen of fine satin.',
      swatches: [
        { name: 'Blush Peach', hex: '#F7D6C8' },
        { name: 'Pistachio Sage', hex: '#C8D6AF' },
        { name: 'Ivory Pearl', hex: '#FAF5ED' },
        { name: 'Sky Azure', hex: '#C5D8EA' },
        { name: 'Warm Terracotta', hex: '#C86D51' }
      ],
      inStock: true
    },
    {
      id: 'liquid-satin',
      name: 'Liquid Gloss Luxury Satin',
      category: 'Satin',
      image: 'images/satin.jpg',
      perMetrePrice: 890,
      hasDressSet: false,
      badge: 'Fluid Drape',
      description: 'Ultra-fluid Japanese imported satin featuring high-reflection liquid gloss and featherweight drape. Favoured by couture designers for dupattas, evening gowns, and designer linings.',
      swatches: [
        { name: 'Champagne Gilt', hex: '#E8D3A2' },
        { name: 'Deep Scarlet', hex: '#900C3F' },
        { name: 'Silver Frost', hex: '#D9E2E8' },
        { name: 'Mocha Taupe', hex: '#7E685A' },
        { name: 'Emerald Glaze', hex: '#165B33' }
      ],
      inStock: true
    },
    {
      id: 'pure-cotton',
      name: 'Handloom Slub Cotton',
      category: 'Cotton',
      image: 'images/pure-cotton.jpg',
      perMetrePrice: 480,
      hasDressSet: false,
      badge: 'Pure Breathable',
      description: '100% natural organic cotton fabric with artisanal hand-spun slub texture. Superbly breathable, soft on skin, and ideal for summer couture, kurtis, and everyday elegance.',
      swatches: [
        { name: 'Natural Off-White', hex: '#F5F2EB' },
        { name: 'Indigo Blue', hex: '#2C3E50' },
        { name: 'Kashmiri Ochre', hex: '#C98E32' },
        { name: 'Earthy Olive', hex: '#606C38' },
        { name: 'Pastel Coral', hex: '#E78F81' }
      ],
      inStock: true
    },
    {
      id: 'butter-crepe',
      name: 'Japanese Butter Crepe',
      category: 'Butter Crepe',
      image: 'images/butter-crepe.jpg',
      perMetrePrice: 520,
      hasDressSet: false,
      badge: 'Wrinkle-Free',
      description: 'Silky smooth, high-density Japanese butter crepe with zero cling and natural fluid drape. Excellent for premium inner astar (lining), breezy anarkalis, and flowing dupattas.',
      swatches: [
        { name: 'Soft Almond', hex: '#EADCC9' },
        { name: 'Dusty Mauve', hex: '#AA8B98' },
        { name: 'Teal Twilight', hex: '#264653' },
        { name: 'Pearl Cream', hex: '#FFFDF6' },
        { name: 'Smoky Charcoal', hex: '#3A3837' }
      ],
      inStock: true
    }
  ];

  // State
  let fabrics = [];
  let currentFilter = 'All';

  let activeFabric = null;
  let activeMode = 'metre';
  let activeMetres = 2.5;
  let activeSets = 1;
  let activeSwatch = null;

  // LocalStorage Keys
  const LS_FABRICS_KEY = 'teghi_fabrics_v1';
  const LS_WHATSAPP_KEY = 'teghi_whatsapp_phone';
  const LS_VISITORS_KEY = 'teghi_monthly_visitors';
  const LS_ENQUIRIES_KEY = 'teghi_monthly_enquiries';

  function init() {
    loadFabrics();
    trackVisitor();
    initFilters();
    renderProducts();
    setupGeneralWhatsAppLinks();
    initModalEvents();
  }

  function loadFabrics() {
    const saved = localStorage.getItem(LS_FABRICS_KEY);
    if (saved) {
      try { fabrics = JSON.parse(saved); } catch (e) { fabrics = DEFAULT_FABRICS; }
    } else {
      fabrics = DEFAULT_FABRICS;
      localStorage.setItem(LS_FABRICS_KEY, JSON.stringify(DEFAULT_FABRICS));
    }
  }

  function getWhatsAppNumber() {
    return localStorage.getItem(LS_WHATSAPP_KEY) || '919876543210';
  }

  function trackVisitor() {
    const sessionVisited = sessionStorage.getItem('teghi_visited_session');
    let totalVisitors = parseInt(localStorage.getItem(LS_VISITORS_KEY) || '1420', 10);
    if (!sessionVisited) {
      totalVisitors += 1;
      localStorage.setItem(LS_VISITORS_KEY, totalVisitors.toString());
      sessionStorage.setItem('teghi_visited_session', 'true');
    }
  }

  function trackWhatsAppEnquiry() {
    let totalEnquiries = parseInt(localStorage.getItem(LS_ENQUIRIES_KEY) || '184', 10);
    totalEnquiries += 1;
    localStorage.setItem(LS_ENQUIRIES_KEY, totalEnquiries.toString());
  }

  // Render Product Grid
  function renderProducts() {
    const container = document.getElementById('products-grid');
    if (!container) return;

    const filtered = currentFilter === 'All' 
      ? fabrics 
      : fabrics.filter(f => f.category.toLowerCase().includes(currentFilter.toLowerCase()));

    container.innerHTML = filtered.map(item => `
      <div class="product-card" data-id="${item.id}" onclick="window.TeghiApp.openInspection('${item.id}')">
        <div class="product-thumb-wrap">
          <img class="product-thumb" src="${item.image}" alt="${item.name}" loading="lazy" onerror="this.src='images/heavy-worked-net.jpg'">
          <span class="badge-float">${item.badge || 'Luxury'}</span>
        </div>
        <div class="product-card-content">
          <span class="product-card-category">${item.category}</span>
          <h3 class="product-card-title">${item.name}</h3>
          <div class="product-card-rates">
            <span class="rate-per-metre">₹${item.perMetrePrice.toLocaleString('en-IN')} <span>/ metre</span></span>
            ${item.hasDressSet ? `<span class="rate-full-set">Dress Set: ₹${item.dressSetPrice.toLocaleString('en-IN')}</span>` : ''}
          </div>
          <div class="swatch-mini-preview">
            ${item.swatches.slice(0, 5).map(s => `
              <span class="swatch-circle" style="background-color: ${s.hex};" title="${s.name}"></span>
            `).join('')}
            <span class="swatch-count-tag">+${item.swatches.length} shades</span>
          </div>
          <button class="btn-card-inspect">Inspect & Inquire ✦</button>
        </div>
      </div>
    `).join('');
  }

  function initFilters() {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.category || 'All';
        renderProducts();
      });
    });
  }

  // Modal Fabric Inspection
  function openInspection(fabricId) {
    const item = fabrics.find(f => f.id === fabricId);
    if (!item) return;

    activeFabric = item;
    activeMode = 'metre';
    activeMetres = 2.5;
    activeSets = 1;
    activeSwatch = item.swatches[0] || { name: 'Standard Ivory', hex: '#FFFFFF' };

    document.getElementById('modal-category').textContent = item.category;
    document.getElementById('modal-title').textContent = item.name;
    document.getElementById('modal-hero-img').src = item.image;
    document.getElementById('modal-hero-img').alt = item.name;
    document.getElementById('modal-description').textContent = item.description;

    const modeWrap = document.getElementById('purchase-mode-wrapper');
    const setNote = document.getElementById('set-inclusion-note');
    if (item.hasDressSet) {
      modeWrap.style.display = 'flex';
      setNote.innerHTML = `<strong>Dress Set Inclusions:</strong> ${item.dressSetIncludes}`;
    } else {
      modeWrap.style.display = 'none';
      setNote.style.display = 'none';
    }

    updatePurchaseModeUI();
    renderSwatches();
    updatePriceEstimate();

    const backdrop = document.getElementById('modal-backdrop');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeInspection() {
    const backdrop = document.getElementById('modal-backdrop');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  function updatePurchaseModeUI() {
    const btnMetre = document.getElementById('btn-mode-metre');
    const btnSet = document.getElementById('btn-mode-set');
    const setNote = document.getElementById('set-inclusion-note');
    const labelTitle = document.getElementById('stepper-label-title');
    const labelRate = document.getElementById('stepper-rate-unit');

    if (activeMode === 'metre') {
      btnMetre.classList.add('active');
      btnSet.classList.remove('active');
      if (setNote) setNote.classList.remove('show');
      labelTitle.textContent = 'Required Length';
      labelRate.textContent = `(Rate: ₹${activeFabric.perMetrePrice.toLocaleString('en-IN')}/m)`;
      document.getElementById('stepper-val').textContent = `${activeMetres}m`;
    } else {
      btnSet.classList.add('active');
      btnMetre.classList.remove('active');
      if (setNote) setNote.classList.add('show');
      labelTitle.textContent = 'Number of Sets';
      labelRate.textContent = `(Rate: ₹${activeFabric.dressSetPrice.toLocaleString('en-IN')}/set)`;
      document.getElementById('stepper-val').textContent = `${activeSets} Set`;
    }
    updatePriceEstimate();
  }

  function renderSwatches() {
    const container = document.getElementById('swatches-grid');
    const nameLabel = document.getElementById('swatch-selected-name');
    nameLabel.textContent = activeSwatch ? activeSwatch.name : 'Select a variation';

    container.innerHTML = activeFabric.swatches.map((s) => `
      <div class="swatch-option ${s.name === activeSwatch.name ? 'active' : ''}" 
           style="background-color: ${s.hex};" 
           title="${s.name}" 
           onclick="window.TeghiApp.selectSwatch('${s.name}')">
      </div>
    `).join('');
  }

  function selectSwatch(swatchName) {
    const found = activeFabric.swatches.find(s => s.name === swatchName);
    if (found) {
      activeSwatch = found;
      renderSwatches();
      updatePriceEstimate();
    }
  }

  function changeQuantity(delta) {
    if (activeMode === 'metre') {
      let next = activeMetres + (delta * 0.5);
      if (next < 1) next = 1;
      if (next > 50) next = 50;
      activeMetres = next;
      document.getElementById('stepper-val').textContent = `${activeMetres}m`;
    } else {
      let next = activeSets + delta;
      if (next < 1) next = 1;
      if (next > 20) next = 20;
      activeSets = next;
      document.getElementById('stepper-val').textContent = `${activeSets} Set`;
    }
    updatePriceEstimate();
  }

  function updatePriceEstimate() {
    let total = 0;
    let calcNote = '';

    if (activeMode === 'metre') {
      total = Math.round(activeMetres * activeFabric.perMetrePrice);
      calcNote = `${activeMetres} metres × ₹${activeFabric.perMetrePrice.toLocaleString('en-IN')}`;
    } else {
      total = Math.round(activeSets * activeFabric.dressSetPrice);
      calcNote = `${activeSets} Complete Set × ₹${activeFabric.dressSetPrice.toLocaleString('en-IN')}`;
    }

    document.getElementById('estimate-calc-note').textContent = calcNote;
    document.getElementById('estimate-value').textContent = `₹${total.toLocaleString('en-IN')}`;

    updateWhatsAppLink(total);
  }

  function updateWhatsAppLink(totalAmount) {
    const phone = getWhatsAppNumber();
    const modeText = activeMode === 'metre' 
      ? `Per Metre (${activeMetres} metres)` 
      : `Complete Dress Set (${activeSets} Set with Matching Dupatta, Astar & Salwar)`;

    const msg = `Hello TEGHI Luxury Fabrics,

I am inquiring about the following textile from your showroom website:

✦ Fabric: ${activeFabric.name}
✦ Category: ${activeFabric.category}
✦ Selection Mode: ${modeText}
✦ Selected Shade: ${activeSwatch ? activeSwatch.name : 'Standard'}
✦ Estimated Total: ₹${totalAmount.toLocaleString('en-IN')}

Please confirm stock availability and share high-resolution video clips or fabric swatches via WhatsApp. Thank you!`;

    const waBtn = document.getElementById('btn-whatsapp-submit');
    if (waBtn) {
      waBtn.href = `https://wa.me/${phone}?text=${encodeURIComponent(msg)}`;
      waBtn.onclick = () => trackWhatsAppEnquiry();
    }
  }

  function setupGeneralWhatsAppLinks() {
    const phone = getWhatsAppNumber();
    const defaultMsg = encodeURIComponent("Hello TEGHI Luxury Fabrics, I am browsing your showroom website and would like to inquire about your curated luxury textile collections.");
    const headerWa = document.getElementById('btn-header-wa');
    if (headerWa) {
      headerWa.href = `https://wa.me/${phone}?text=${defaultMsg}`;
      headerWa.onclick = () => trackWhatsAppEnquiry();
    }
  }

  function initModalEvents() {
    const backdrop = document.getElementById('modal-backdrop');
    if (backdrop) {
      backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closeInspection();
      });
    }

    const btnMetre = document.getElementById('btn-mode-metre');
    const btnSet = document.getElementById('btn-mode-set');
    if (btnMetre) {
      btnMetre.addEventListener('click', () => {
        activeMode = 'metre';
        updatePurchaseModeUI();
      });
    }
    if (btnSet) {
      btnSet.addEventListener('click', () => {
        activeMode = 'dress_set';
        updatePurchaseModeUI();
      });
    }

    const stepMinus = document.getElementById('stepper-minus');
    const stepPlus = document.getElementById('stepper-plus');
    if (stepMinus) stepMinus.addEventListener('click', () => changeQuantity(-1));
    if (stepPlus) stepPlus.addEventListener('click', () => changeQuantity(1));
  }

  document.addEventListener('DOMContentLoaded', init);

  window.TeghiApp = {
    openInspection,
    closeInspection,
    selectSwatch
  };

})();
