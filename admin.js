/* ==========================================================================
   TEGHI — LUXURY FABRICS & TEXTILES
   Mobile-First Owner Admin Panel Logic
   Simple, Intuitive & No-Code Operations for Smartphone
   ========================================================================== */

(function () {
  'use strict';

  const LS_FABRICS_KEY = 'teghi_fabrics_v1';
  const LS_WHATSAPP_KEY = 'teghi_whatsapp_phone';
  const LS_VISITORS_KEY = 'teghi_monthly_visitors';
  const LS_ENQUIRIES_KEY = 'teghi_monthly_enquiries';
  const OWNER_PIN = '1234';

  let fabrics = [];

  // Elements
  const pinSection = document.getElementById('pin-section');
  const dashboardContent = document.getElementById('dashboard-content');
  const pinInput = document.getElementById('owner-pin');
  const pinBtn = document.getElementById('btn-unlock');
  const pinError = document.getElementById('pin-error');
  const toast = document.getElementById('toast');
  const toastText = document.getElementById('toast-text');

  // Verify PIN
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
    loadStoreSettings();
    loadProductsList();
  }

  // Toast Helper
  function showToast(message) {
    toastText.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // Metrics (Monthly Visitors, Enquiries, Conversion Rate)
  function loadMetrics() {
    const visitors = parseInt(localStorage.getItem(LS_VISITORS_KEY) || '1421', 10);
    const enquiries = parseInt(localStorage.getItem(LS_ENQUIRIES_KEY) || '185', 10);
    const convRate = visitors > 0 ? ((enquiries / visitors) * 100).toFixed(1) : '0.0';

    document.getElementById('stat-visitors').textContent = visitors.toLocaleString('en-IN');
    document.getElementById('stat-enquiries').textContent = enquiries.toLocaleString('en-IN');
    document.getElementById('stat-conversion').textContent = `${convRate}%`;
  }

  // Store Settings (Dynamic WhatsApp Number)
  function loadStoreSettings() {
    const currentNumber = localStorage.getItem(LS_WHATSAPP_KEY) || '919876543210';
    const input = document.getElementById('input-wa-number');
    if (input) input.value = currentNumber;
  }

  function saveStoreSettings() {
    const input = document.getElementById('input-wa-number');
    let phone = input.value.replace(/[^0-9]/g, '');
    if (!phone || phone.length < 10) {
      alert('Kripya valid 10-digit phone number enter karein.');
      return;
    }
    // Prefix 91 if user entered 10 digits
    if (phone.length === 10) {
      phone = '91' + phone;
    }
    localStorage.setItem(LS_WHATSAPP_KEY, phone);
    input.value = phone;
    showToast('WhatsApp Number Updated! Website par turant apply ho gaya.');
  }

  // Product List Management
  function loadProductsList() {
    const saved = localStorage.getItem(LS_FABRICS_KEY);
    if (saved) {
      try {
        fabrics = JSON.parse(saved);
      } catch (e) {
        fabrics = [];
      }
    }
    renderAdminProducts();
  }

  function renderAdminProducts() {
    const list = document.getElementById('admin-product-list');
    if (!list) return;

    if (fabrics.length === 0) {
      list.innerHTML = `<p style="font-size: 0.85rem; color: var(--text-muted); text-align: center; padding: 1rem;">Koi fabric nahi mila.</p>`;
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
            ${f.inStock !== false ? '● In Stock' : '✕ Out of Stock'}
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
    showToast(`${fabrics[index].name} stock status updated!`);
  }

  function editPrice(index) {
    const f = fabrics[index];
    const newPrice = prompt(`'${f.name}' ka naya Per Metre Rate enter karein (₹):`, f.perMetrePrice);
    if (newPrice !== null && !isNaN(newPrice) && newPrice.trim() !== '') {
      f.perMetrePrice = parseInt(newPrice, 10);
      
      if (f.hasDressSet) {
        const newSetPrice = prompt(`'${f.name}' ka Complete Dress Set Rate enter karein (₹):`, f.dressSetPrice);
        if (newSetPrice !== null && !isNaN(newSetPrice) && newSetPrice.trim() !== '') {
          f.dressSetPrice = parseInt(newSetPrice, 10);
        }
      }

      saveFabricsToStorage();
      renderAdminProducts();
      showToast('Naye rates website par update ho gaye!');
    }
  }

  function saveFabricsToStorage() {
    localStorage.setItem(LS_FABRICS_KEY, JSON.stringify(fabrics));
  }

  // Compress image on mobile client
  function compressImage(file, callback) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement('canvas');
        const maxDim = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxDim) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          }
        } else {
          if (height > maxDim) {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        callback(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  // Add New Product
  function handleAddProduct() {
    const name = document.getElementById('new-name').value.trim();
    const category = document.getElementById('new-category').value;
    const priceMetre = parseInt(document.getElementById('new-price-metre').value, 10);
    const hasSet = document.getElementById('new-has-set').checked;
    const priceSet = hasSet ? parseInt(document.getElementById('new-price-set').value || '0', 10) : 0;
    const photoInput = document.getElementById('new-photo');

    if (!name || isNaN(priceMetre) || priceMetre <= 0) {
      alert('Kripya fabric ka naam aur valid per metre price enter karein.');
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
        dressSetIncludes: hasSet ? 'Complete Matching Dress Set + Dupatta + Astar + Salwar' : '',
        badge: 'New Arrival',
        description: `Premium ${category} fabric curated exclusively at TEGHI Showroom.`,
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

      // Reset form
      document.getElementById('new-name').value = '';
      document.getElementById('new-price-metre').value = '';
      document.getElementById('new-price-set').value = '';
      document.getElementById('new-has-set').checked = false;
      document.getElementById('set-price-group').style.display = 'none';
      photoInput.value = '';

      showToast(`'${name}' website par add ho gaya!`);
    };

    if (photoInput.files && photoInput.files[0]) {
      compressImage(photoInput.files[0], saveItem);
    } else {
      saveItem(null);
    }
  }

  // Event Listeners
  document.addEventListener('DOMContentLoaded', () => {
    // Check if already authenticated this session
    if (sessionStorage.getItem('teghi_owner_authenticated') === 'true') {
      showDashboard();
    }

    pinBtn.addEventListener('click', verifyPin);
    pinInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') verifyPin();
    });

    document.getElementById('btn-save-phone').addEventListener('click', saveStoreSettings);

    // Toggle Add form
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

    // Toggle Dress set price input
    document.getElementById('new-has-set').addEventListener('change', (e) => {
      document.getElementById('set-price-group').style.display = e.target.checked ? 'block' : 'none';
    });

    // Save New Fabric
    document.getElementById('btn-save-new-fabric').addEventListener('click', handleAddProduct);

    // Reset Factory Demo
    document.getElementById('btn-reset-demo').addEventListener('click', () => {
      if (confirm('Kya aap saare demo fabrics aur WhatsApp settings ko default par reset karna chahte hain?')) {
        localStorage.removeItem(LS_FABRICS_KEY);
        localStorage.removeItem(LS_WHATSAPP_KEY);
        loadProductsList();
        loadStoreSettings();
        showToast('Factory demo settings restored!');
      }
    });
  });

  // Global Export
  window.TeghiAdmin = {
    toggleStock,
    editPrice
  };

})();
