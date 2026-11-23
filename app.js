/* ==========================================================================
   TEGHI — LUXURY FABRICS & TEXTILES
   Client Application Logic & Dynamic Showroom Engine
   Mobile-First | LocalStorage Synced | Zero External Dependencies
   ========================================================================== */

(function () {
  'use strict';

  // Default Fabric Catalog
  const DEFAULT_FABRICS = [
    {
      id: 'heavy-worked-net',
      name: 'Imported Heavy Worked Net',
      category: 'Net',
      image: 'images/heavy-worked-net.jpg',
      perMetrePrice: 2450,
      hasDressSet: true,
      dressSetPrice: 6800,
      dressSetIncludes: 'Heavy Worked Net (2.5m) + Matching Embroidered Dupatta + Soft Cotton Astar (Lining) + Shantoon Salwar (2.5m)',
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
      description: 'Pure mulberry raw silk crafted with distinctive natural slub texture and authentic royal luster. Structured, breathable, and timeless for festive kurtas, sarees, and couture.',
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
      description: 'Finest long-staple combed cotton woven in a high-density sateen weave. Combines the feather-light comfort of organic cotton with the silky sheen of satin.',
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
      description: 'Ultra-fluid Japanese imported satin featuring high-reflection liquid gloss and featherweight drape. Ideal for dupattas, evening wear, gowns, and designer accents.',
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
      description: '100% natural organic cotton fabric with artisanal slub texture. Superbly breathable, soft against skin, and ideal for daily suits, kurtis, and summer occasion wear.',
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
      description: 'Silky smooth, high-density Japanese butter crepe with zero cling and natural fluid drape. Excellent for premium inner astar (lining), breezy anarkalis, and flowy dupattas.',
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

  // State Management
  let fabrics = [];
  let currentFilter = 'All';
  let activeFabric = null;
  let activeMode = 'metre'; // 'metre' or 'dress_set'
  let activeMetres = 2.5;
  let activeSets = 1;
  let activeSwatch = null;

  // LocalStorage Keys
  const LS_FABRICS_KEY = 'teghi_fabrics_v1';
  const LS_WHATSAPP_KEY = 'teghi_whatsapp_phone';
  const LS_VISITORS_KEY = 'teghi_monthly_visitors';
  const LS_ENQUIRIES_KEY = 'teghi_monthly_enquiries';

  // Initialize Data
  function initData() {
    const savedFabrics = localStorage.getItem(LS_FABRICS_KEY);
    if (savedFabrics) {
      try {
        fabrics = JSON.parse(savedFabrics);
      } catch (e) {
        fabrics = DEFAULT_FABRICS;
      }
    } else {
      fabrics = DEFAULT_FABRICS;
      localStorage.setItem(LS_FABRICS_KEY, JSON.stringify(DEFAULT_FABRICS));
    }

    // Default WhatsApp Phone (if not set by admin, defaults to test number)
    if (!localStorage.getItem(LS_WHATSAPP_KEY)) {
      localStorage.setItem(LS_WHATSAPP_KEY, '919876543210');
    }

    // Visitor Tracking (Realistic base + live increment)
    trackVisitor();
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
          <button class="btn-card-inspect">Explore & Enquire ✦</button>
        </div>
      </div>
    `).join('');
  }

  // Filter Buttons Interaction
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

  // Fabric Inspection Drawer Modal
  function openInspection(fabricId) {
    const item = fabrics.find(f => f.id === fabricId);
    if (!item) return;

    activeFabric = item;
    activeMode = 'metre';
    activeMetres = 2.5;
    activeSets = 1;
    activeSwatch = item.swatches[0] || { name: 'Standard Natural', hex: '#FFFFFF' };

    // Update Modal DOM
    document.getElementById('modal-category').textContent = item.category;
    document.getElementById('modal-title').textContent = item.name;
    document.getElementById('modal-hero-img').src = item.image;
    document.getElementById('modal-hero-img').alt = item.name;
    document.getElementById('modal-description').textContent = item.description;

    // Toggle Mode visibility
    const modeWrap = document.getElementById('purchase-mode-wrapper');
    const setNote = document.getElementById('set-inclusion-note');
    if (item.hasDressSet) {
      modeWrap.style.display = 'flex';
      setNote.innerHTML = `<strong>Dress Set Includes:</strong> ${item.dressSetIncludes}`;
    } else {
      modeWrap.style.display = 'none';
      setNote.style.display = 'none';
    }

    updatePurchaseModeUI();
    renderSwatches();
    updatePriceEstimate();

    // Show Modal
    const backdrop = document.getElementById('modal-backdrop');
    backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeInspection() {
    const backdrop = document.getElementById('modal-backdrop');
    backdrop.classList.remove('active');
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
    nameLabel.textContent = activeSwatch ? activeSwatch.name : 'Choose a shade';

    container.innerHTML = activeFabric.swatches.map((s, idx) => `
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

    // Update WhatsApp Link
    updateWhatsAppLink(total);
  }

  function updateWhatsAppLink(totalAmount) {
    const phone = getWhatsAppNumber();
    const modeText = activeMode === 'metre' 
      ? `Per Metre (${activeMetres} metres)` 
      : `Complete Dress Set (${activeSets} Set with Dupatta, Astar & Salwar)`;

    const msg = `Namaste TEGHI Fabrics! 🙏
Main showroom website par yeh fabric dekh raha/rahi hoon:

✦ Product: ${activeFabric.name}
✦ Category: ${activeFabric.category}
✦ Selection: ${modeText}
✦ Selected Shade: ${activeSwatch ? activeSwatch.name : 'Standard'}
✦ Estimated Price: ₹${totalAmount.toLocaleString('en-IN')}

Kripya iski availability confirm karein aur is fabric ki real video/close-up photos WhatsApp par share karein. Dhanyawad!`;

    const encoded = encodeURIComponent(msg);
    const waUrl = `https://wa.me/${phone}?text=${encoded}`;
    
    const waBtn = document.getElementById('btn-whatsapp-submit');
    if (waBtn) {
      waBtn.href = waUrl;
      waBtn.onclick = () => {
        trackWhatsAppEnquiry();
      };
    }
  }

  // Setup General WhatsApp Link for Header / Floating
  function setupGeneralWhatsAppLinks() {
    const phone = getWhatsAppNumber();
    const defaultMsg = encodeURIComponent("Namaste TEGHI Fabrics! Main aapki website explore kar raha/rahi hoon aur luxury fabrics ke baare mein enquire karna chahta/chahti hoon.");
    const waUrl = `https://wa.me/${phone}?text=${defaultMsg}`;

    const headerWa = document.getElementById('btn-header-wa');
    if (headerWa) {
      headerWa.href = waUrl;
      headerWa.onclick = () => trackWhatsAppEnquiry();
    }
  }

  // Event Listeners Initialization
  function initListeners() {
    // Backdrop click close
    const backdrop = document.getElementById('modal-backdrop');
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) {
        closeInspection();
      }
    });

    // Close button
    const closeBtn = document.getElementById('modal-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeInspection);

    // Purchase mode buttons
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

    // Stepper buttons
    const stepMinus = document.getElementById('stepper-minus');
    const stepPlus = document.getElementById('stepper-plus');
    if (stepMinus) stepMinus.addEventListener('click', () => changeQuantity(-1));
    if (stepPlus) stepPlus.addEventListener('click', () => changeQuantity(1));
  }

  // Document Ready
  document.addEventListener('DOMContentLoaded', () => {
    initData();
    initFilters();
    renderProducts();
    initListeners();
    setupGeneralWhatsAppLinks();
  });

  // Export to Window for inline attributes
  window.TeghiApp = {
    openInspection,
    closeInspection,
    selectSwatch,
    trackWhatsAppEnquiry
  };

})();
