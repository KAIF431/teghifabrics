/* ==========================================================================
   TEGHI — LUXURY FABRICS & TEXTILES
   Showroom Owner Mobile Admin Logic
   Smart Auto-Crop Hero Banner Manager + Price Editor + Analytics
   ========================================================================== */

(function () {
  'use strict';

  const LS_FABRICS_KEY = 'teghi_fabrics_v1';
  const LS_SLIDES_KEY = 'teghi_hero_slides_v1';
  const LS_WHATSAPP_KEY = 'teghi_whatsapp_phone';
  const LS_VISITORS_KEY = 'teghi_monthly_visitors';
  const LS_ENQUIRIES_KEY = 'teghi_monthly_enquiries';
  const OWNER_PIN = '1234';

  let fabrics = [];
  let slides = [];

  const pinSection = document.getElementById('pin-section');
  const dashboardContent = document.getElementById('dashboard-content');
  const pinInput = document.getElementById('owner-pin');
  const pinBtn = document.getElementById('btn-unlock');
  const pinError = document.getElementById('pin-error');
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');

  function verifyPin() {
    const val = pinInput.value.trim();
    if (val === OWNER_PIN) {
      sessionStorage.setItem('teghi_owner_authenticated', 'true');
      pinError.style.display = 'none';
      showDashboard();
    } else {
      pinError.style.display = 'block';
      pinInput.value = '';
    }
  }

  function showDashboard() {
    pinSection.style.display = 'none';
    dashboardContent.style.display = 'block';
    loadMetrics();
    loadHeroSlides();
    loadStoreSettings();
    loadProductsList();
  }

  function showToast(message) {
    toastText.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  function loadMetrics() {
    const visitors = parseInt(localStorage.getItem(LS_VISITORS_KEY) || '1421', 10);
    const enquiries = parseInt(localStorage.getItem(LS_ENQUIRIES_KEY) || '185', 10);
    const convRate = visitors > 0 ? ((enquiries / visitors) * 100).toFixed(1) : '0.0';

    document.getElementById('stat-visitors').textContent = visitors.toLocaleString('en-IN');
    document.getElementById('stat-enquiries').textContent = enquiries.toLocaleString('en-IN');
    document.getElementById('stat-conversion').textContent = `${convRate}%`;
  }

  // ==========================================================================
  // SMART AUTO-ADJUST CANVAS CROP ENGINE
  // Center-crops and normalizes photos of ANY size/orientation without distortion
  // ==========================================================================
  function normalizeAndCompressImage(file, targetWidth, targetHeight, callback) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d');

        // Calculate aspect ratios for center crop (cover)
        const sourceAspect = img.width / img.height;
        const targetAspect = targetWidth / targetHeight;

        let renderWidth, renderHeight, offsetX, offsetY;

        if (sourceAspect > targetAspect) {
          // Image is wider than target
          renderHeight = img.height;
          renderWidth = img.height * targetAspect;
          offsetX = (img.width - renderWidth) / 2;
          offsetY = 0;
        } else {
          // Image is taller than target
          renderWidth = img.width;
          renderHeight = img.width / targetAspect;
          offsetX = 0;
          offsetY = (img.height - renderHeight) / 2;
        }

        // Draw center-cropped portion
        ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight, 0, 0, targetWidth, targetHeight);
        callback(canvas.toDataURL('image/jpeg', 0.82));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // ==========================================================================
  // HERO 3D COVERFLOW SLIDES MANAGER
  // ==========================================================================
  function loadHeroSlides() {
    const saved = localStorage.getItem(LS_SLIDES_KEY);
    if (saved) {
      try { slides = JSON.parse(saved); } catch (e) { slides = []; }
    } else {
      slides = [
        {
          id: 'slide-1',
          fabricId: 'heavy-worked-net',
          tag: 'Signature Showcase',
          title: 'Imported Worked Net',
          desc: 'Intricate zardozi embroidery & delicate pearls on sheer tulle.',
          image: 'images/heavy-worked-net.jpg',
          price: '₹2,450 / m'
        },
        {
          id: 'slide-2',
          fabricId: 'pure-silk',
          tag: 'Heritage Weave',
          title: 'Mulberry Raw Silk',
          desc: 'Natural artisanal slub weave with royal emerald sheen.',
          image: 'images/pure-silk.jpg',
          price: '₹1,650 / m'
        },
        {
          id: 'slide-3',
          fabricId: 'liquid-satin',
          tag: 'Fluid Drape',
          title: 'Liquid Champagne Satin',
          desc: 'Liquid gloss finish with featherweight bridal drape.',
          image: 'images/satin.jpg',
          price: '₹890 / m'
        }
      ];
    }
    renderAdminSlides();
  }

  function renderAdminSlides() {
    const container = document.getElementById('admin-slides-list');
    if (!container) return;

    container.innerHTML = slides.map((slide, idx) => `
      <div class="admin-slide-row">
        <img class="admin-slide-thumb" src="${slide.image}" alt="${slide.title}" onerror="this.src='images/heavy-worked-net.jpg'">
        <div class="admin-slide-info">
          <div class="admin-slide-title">Slide ${idx + 1}: ${slide.title}</div>
          <div class="admin-slide-meta">${slide.tag} · ${slide.price}</div>
          <label class="btn-slide-upload" style="margin-top: 0.35rem;">
            <span>📸 Change Photo from Phone</span>
            <input type="file" accept="image/*" style="display: none;" onchange="window.TeghiAdmin.uploadSlideImage(${idx}, this)">
          </label>
        </div>
      </div>
    `).join('');
  }

  function uploadSlideImage(slideIndex, inputElem) {
    if (inputElem.files && inputElem.files[0]) {
      const file = inputElem.files[0];
      // Target aspect ratio for coverflow cards: 440 x 520
      normalizeAndCompressImage(file, 440, 520, (dataUrl) => {
        slides[slideIndex].image = dataUrl;
        localStorage.setItem(LS_SLIDES_KEY, JSON.stringify(slides));
        renderAdminSlides();
        showToast(`Slide ${slideIndex + 1} photo auto-adjusted and updated!`);
      });
    }
  }

  // ==========================================================================
  // STORE SETTINGS (DYNAMIC WHATSAPP NUMBER)
  // ==========================================================================
  function loadStoreSettings() {
    const currentNumber = localStorage.getItem(LS_WHATSAPP_KEY) || '919876543210';
    const input = document.getElementById('input-wa-number');
    if (input) input.value = currentNumber;
  }

  function saveStoreSettings() {
    const input = document.getElementById('input-wa-number');
    let phone = input.value.replace(/[^0-9]/g, '');
    if (!phone || phone.length < 10) {
      alert('Please enter a valid 10-digit phone number with country code.');
      return;
    }
    if (phone.length === 10) {
      phone = '91' + phone;
    }
    localStorage.setItem(LS_WHATSAPP_KEY, phone);
    input.value = phone;
    showToast('WhatsApp number updated. Applied across all showroom inquiry buttons.');
  }

  // ==========================================================================
  // PRODUCT CATALOG & PRICE EDITOR
  // ==========================================================================
  function loadProductsList() {
    const saved = localStorage.getItem(LS_FABRICS_KEY);
    if (saved) {
      try { fabrics = JSON.parse(saved); } catch (e) { fabrics = []; }
    }
    renderAdminProducts();
  }

  function renderAdminProducts() {
    const list = document.getElementById('admin-product-list');
    if (!list) return;

    if (fabrics.length === 0) {
      list.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted); text-align: center; padding: 1rem;">No fabrics found in catalog.</p>`;
      return;
    }

    list.innerHTML = fabrics.map((f, idx) => `
      <div class="admin-product-item" data-id="${f.id}">
        <img class="admin-thumb" src="${f.image}" alt="${f.name}" onerror="this.src='images/heavy-worked-net.jpg'">
        <div class="admin-prod-info">
          <div class="admin-prod-title">${f.name}</div>
          <div class="admin-prod-rates">
            <span class="admin-rate-badge">₹${f.perMetrePrice}/m</span>
            ${f.hasDressSet ? `<span class="admin-rate-badge" style="color: var(--gold-dark);">Set: ₹${f.dressSetPrice}</span>` : ''}
          </div>
        </div>
        <div class="admin-prod-actions">
          <button class="btn-toggle-stock ${f.inStock !== false ? 'in-stock' : 'out-stock'}" 
                  onclick="window.TeghiAdmin.toggleStock(${idx})">
            ${f.inStock !== false ? '● In Stock' : '✕ Sold Out'}
          </button>
          <button class="btn-edit-inline" onclick="window.TeghiAdmin.editPrice(${idx})">
            Edit Rate
          </button>
        </div>
      </div>
    `).join('');
  }

  function toggleStock(index) {
    fabrics[index].inStock = fabrics[index].inStock === false ? true : false;
    saveFabricsToStorage();
    renderAdminProducts();
    showToast(`${fabrics[index].name} stock availability updated.`);
  }

  function editPrice(index) {
    const f = fabrics[index];
    const newPrice = prompt(`Enter new Per-Metre Rate for '${f.name}' (₹):`, f.perMetrePrice);
    if (newPrice !== null && !isNaN(newPrice) && newPrice.trim() !== '') {
      f.perMetrePrice = parseInt(newPrice, 10);
      
      if (f.hasDressSet) {
        const newSetPrice = prompt(`Enter new Complete Dress Set Rate for '${f.name}' (₹):`, f.dressSetPrice);
        if (newSetPrice !== null && !isNaN(newSetPrice) && newSetPrice.trim() !== '') {
          f.dressSetPrice = parseInt(newSetPrice, 10);
        }
      }

      saveFabricsToStorage();
      renderAdminProducts();
      showToast('New pricing applied successfully.');
    }
  }

  function saveFabricsToStorage() {
    localStorage.setItem(LS_FABRICS_KEY, JSON.stringify(fabrics));
  }

  function handleAddProduct() {
    const name = document.getElementById('new-name').value.trim();
    const category = document.getElementById('new-category').value;
    const priceMetre = parseInt(document.getElementById('new-price-metre').value, 10);
    const hasSet = document.getElementById('new-has-set').checked;
    const priceSet = hasSet ? parseInt(document.getElementById('new-price-set').value || '0', 10) : 0;
    const photoInput = document.getElementById('new-photo');

    if (!name || isNaN(priceMetre) || priceMetre <= 0) {
      alert('Please enter a valid fabric name and per-metre price.');
      return;
    }

    const saveItem = (imageData) => {
      const newFabric = {
        id: 'fabric-' + Date.now(),
        name: name,
        category: category,
        image: imageData || 'images/heavy-worked-net.jpg',
        perMetrePrice: priceMetre,
        hasDressSet: hasSet,
        dressSetPrice: priceSet,
        dressSetIncludes: hasSet ? 'Complete Coordinated Dress Set + Dupatta + Astar + Salwar Fabric' : '',
        badge: 'New Arrival',
        description: `Premium handpicked ${category} textile curated at TEGHI Luxury Fabrics.`,
        swatches: [
          { name: 'Champagne Ivory', hex: '#F3EDE2' },
          { name: 'Rose Gold', hex: '#B76E79' },
          { name: 'Royal Emerald', hex: '#1B4D3E' }
        ],
        inStock: true
      };

      fabrics.unshift(newFabric);
      saveFabricsToStorage();
      renderAdminProducts();

      document.getElementById('new-name').value = '';
      document.getElementById('new-price-metre').value = '';
      document.getElementById('new-price-set').value = '';
      document.getElementById('new-has-set').checked = false;
      document.getElementById('set-price-group').style.display = 'none';
      photoInput.value = '';

      showToast(`'${name}' published to showroom catalogue.`);
    };

    if (photoInput.files && photoInput.files[0]) {
      normalizeAndCompressImage(photoInput.files[0], 500, 500, saveItem);
    } else {
      saveItem(null);
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (sessionStorage.getItem('teghi_owner_authenticated') === 'true') {
      showDashboard();
    }

    pinBtn.addEventListener('click', verifyPin);
    pinInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') verifyPin();
    });

    document.getElementById('btn-save-phone').addEventListener('click', saveStoreSettings);

    const toggleAdd = document.getElementById('toggle-add-form');
    const addContainer = document.getElementById('add-product-container');
    const collapseIcon = document.getElementById('collapse-icon');
    toggleAdd.addEventListener('click', () => {
      const isOpen = addContainer.classList.contains('open');
      if (isOpen) {
        addContainer.classList.remove('open');
        collapseIcon.textContent = '▼';
      } else {
        addContainer.classList.add('open');
        collapseIcon.textContent = '▲';
      }
    });

    document.getElementById('new-has-set').addEventListener('change', (e) => {
      document.getElementById('set-price-group').style.display = e.target.checked ? 'block' : 'none';
    });

    document.getElementById('btn-save-new-fabric').addEventListener('click', handleAddProduct);

    document.getElementById('btn-reset-demo').addEventListener('click', () => {
      if (confirm('Are you sure you want to restore default demo fabrics and settings?')) {
        localStorage.removeItem(LS_FABRICS_KEY);
        localStorage.removeItem(LS_SLIDES_KEY);
        localStorage.removeItem(LS_WHATSAPP_KEY);
        loadProductsList();
        loadHeroSlides();
        loadStoreSettings();
        showToast('Default showroom settings restored.');
      }
    });
  });

  window.TeghiAdmin = {
    toggleStock,
    editPrice,
    uploadSlideImage
  };

})();
