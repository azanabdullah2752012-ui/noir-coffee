/**
 * NOIR — Specialty Coffee Roasters
 * Interactions & Ritual Bag Engine
 */

const ROAST_CATALOG = {
  '01': {
    id: '01',
    name: 'The Original',
    subtitle: 'Signature House Blend',
    basePrice: 24,
    subPrice: 21,
    image: 'assets/noir-01-the-original-wide.jpg'
  },
  '02': {
    id: '02',
    name: 'After Hours',
    subtitle: 'Nocturnal Roast',
    basePrice: 25,
    subPrice: 22,
    image: 'assets/noir-02-after-hours-wide.jpg'
  },
  '03': {
    id: '03',
    name: 'First Light',
    subtitle: 'Luminous Light Roast',
    basePrice: 26,
    subPrice: 23,
    image: 'assets/noir-03-first-light-wide.jpg'
  }
};

let bag = loadBag();

document.addEventListener('DOMContentLoaded', () => {
  initRitualFinder();
  initGrindToggles();
  initOrderTypeToggles();
  initProfileDrawers();
  initBagEngine();
  initMobileNav();
  renderBag();
});

function loadBag() {
  try {
    const saved = localStorage.getItem('noir_bag');
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
}

function saveBag() {
  try {
    localStorage.setItem('noir_bag', JSON.stringify(bag));
  } catch (e) {}
}

/* 1. Interactive Ritual Finder Matching */
function initRitualFinder() {
  document.querySelectorAll('.ritual-option-card').forEach(card => {
    card.addEventListener('click', () => {
      const targetId = card.getAttribute('data-match');
      const targetEl = document.getElementById(targetId);
      if (!targetEl) return;

      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // Highlight card momentarily
      document.querySelectorAll('.roast-card-layout').forEach(c => c.classList.remove('highlight-card'));
      targetEl.classList.add('highlight-card');
      setTimeout(() => {
        targetEl.classList.remove('highlight-card');
      }, 2000);
    });
  });
}

/* 2. Format Toggles (Whole Bean / Ground) */
function initGrindToggles() {
  document.querySelectorAll('.grind-toggle-bar').forEach(bar => {
    const buttons = bar.querySelectorAll('.grind-opt-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  });
}

/* 3. Subscription vs One-Time Toggles */
function initOrderTypeToggles() {
  document.querySelectorAll('.order-type-bar').forEach(bar => {
    const buttons = bar.querySelectorAll('.order-type-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const card = btn.closest('.roast-card-layout');
        if (!card) return;

        const priceEl = card.querySelector('.roast-price-tag');
        const price = btn.getAttribute('data-price');
        if (priceEl && price) {
          priceEl.innerHTML = `$${price} <span>/ 250g</span>`;
        }
      });
    });
  });
}

/* 4. Expandable Profile & Brew Drawers */
function initProfileDrawers() {
  document.querySelectorAll('.roast-expand-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const drawerId = btn.getAttribute('data-toggle');
      const drawer = document.getElementById(drawerId);
      if (!drawer) return;

      const isOpen = drawer.classList.contains('open');
      if (isOpen) {
        drawer.classList.remove('open');
        btn.innerHTML = '<span>+ Origin, Profile & Brew Method</span>';
      } else {
        drawer.classList.add('open');
        btn.innerHTML = '<span>− Close Profile Guide</span>';
      }
    });
  });
}

/* 5. Bag / Drawer Engine */
function initBagEngine() {
  const bagBtn = document.getElementById('bagBtn');
  const closeBtn = document.getElementById('drawerCloseBtn');
  const backdrop = document.getElementById('drawerBackdrop');
  const checkoutBtn = document.getElementById('drawerCheckoutBtn');

  if (bagBtn) bagBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) {
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) closeDrawer();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDrawer();
  });

  // Bind Roast Add Buttons
  document.querySelectorAll('[data-action="add-roast"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const roastId = btn.getAttribute('data-roast-id');
      const roast = ROAST_CATALOG[roastId];
      if (!roast) return;

      const card = btn.closest('.roast-card-layout');
      const activeOpt = card ? card.querySelector('.grind-opt-btn.active') : null;
      const grind = activeOpt ? activeOpt.textContent.trim() : 'Whole Bean';

      const activeOrderType = card ? card.querySelector('.order-type-btn.active') : null;
      const freq = activeOrderType ? activeOrderType.getAttribute('data-freq') : 'once';
      const isSubscription = freq === 'sub';
      const unitPrice = isSubscription ? roast.subPrice : roast.basePrice;
      const planLabel = isSubscription ? 'Subscription (Every 4 weeks)' : 'One-time dispatch';

      addToBag({
        id: `roast-${roast.id}-${grind.toLowerCase().replace(/\s+/g, '-')}-${freq}`,
        name: `Roast ${roast.id} — ${roast.name}`,
        desc: `250g Spun Copper Canister · ${grind} · ${planLabel}`,
        price: unitPrice,
        image: roast.image
      });
      openDrawer();
    });
  });

  // Bind Trio Add Buttons
  document.querySelectorAll('[data-action="add-trio"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      addToBag({
        id: 'edition-01-trio',
        name: 'The Edition 01 Trio',
        desc: 'All three signature roasts (3 × 250g) + copper scoop',
        price: 58,
        image: 'assets/noir-trio-collection.jpg'
      });
      openDrawer();
    });
  });

  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      if (bag.length === 0) {
        alert('Your bag is currently empty.');
        return;
      }
      renderCheckoutView();
    });
  }
}

/* Interactive Checkout & Dispatch Flow */
function renderCheckoutView() {
  const itemsContainer = document.getElementById('drawerItems');
  const shippingMeter = document.getElementById('shippingMeter');
  const drawerFooter = document.querySelector('.drawer-footer');
  const drawerTitle = document.getElementById('drawerTitle');

  if (shippingMeter) shippingMeter.style.display = 'none';
  if (drawerFooter) drawerFooter.style.display = 'none';
  if (drawerTitle) drawerTitle.textContent = 'Checkout';

  const totalAmount = bag.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const isFreeShipping = totalAmount >= 50;

  if (!itemsContainer) return;

  itemsContainer.innerHTML = `
    <div class="checkout-view-wrap">
      <div class="checkout-demo-banner">
        <div class="demo-banner-dot" aria-hidden="true"></div>
        <div>
          <strong>Interactive Prototype Mode</strong>
          <span>This storefront is a design & engineering demonstration. Payment and order routing are simulated for evaluation; no actual charges will occur.</span>
        </div>
      </div>

      <div class="checkout-view-header">
        <button class="checkout-back-btn" id="checkoutBackToBagBtn" type="button">
          ← Back to Bag (${bag.reduce((sum, item) => sum + item.qty, 0)})
        </button>
        <span style="font-size: 0.75rem; color: var(--noir-copper); letter-spacing: 0.1em; text-transform: uppercase;">
          Step 1 of 2
        </span>
      </div>

      <!-- Express Checkout Simulation -->
      <button class="btn-apple-pay" id="applePayBtn" type="button">
        <span>Pay</span>
        <span style="font-size: 0.82rem; font-weight: 400; opacity: 0.85;">Simulated Demo Checkout</span>
      </button>

      <div class="checkout-or-divider">or enter shipping details</div>

      <!-- Delivery Address Form -->
      <form id="checkoutForm" onsubmit="event.preventDefault(); submitOrder();" style="display: flex; flex-direction: column; gap: 1rem;">
        <div class="checkout-field-row">
          <label class="checkout-field-label">Email for Roast Dispatch Updates</label>
          <input type="email" class="checkout-text-input" placeholder="e.g. yourname@domain.com" required>
        </div>

        <div class="checkout-field-row">
          <label class="checkout-field-label">Full Name</label>
          <input type="text" class="checkout-text-input" placeholder="e.g. Alexandre Laurent" required>
        </div>

        <div class="checkout-field-row">
          <label class="checkout-field-label">Delivery Street Address</label>
          <input type="text" class="checkout-text-input" placeholder="e.g. Keizersgracht 384, Apt 4" required>
        </div>

        <div class="checkout-split-fields">
          <div class="checkout-field-row">
            <label class="checkout-field-label">Postal Code</label>
            <input type="text" class="checkout-text-input" placeholder="e.g. 1016 GB" required>
          </div>
          <div class="checkout-field-row">
            <label class="checkout-field-label">City</label>
            <input type="text" class="checkout-text-input" placeholder="e.g. Amsterdam" required>
          </div>
        </div>

        <div style="background: rgba(18, 3, 6, 0.6); border: 1px solid var(--noir-border-subtle); padding: 0.85rem; border-radius: 2px; margin-top: 0.25rem;">
          <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 0.25rem;">
            <span style="color: var(--noir-ivory-dim);">Cold Courier Delivery:</span>
            <span style="color: var(--noir-copper-light); font-weight: 600;">${isFreeShipping ? 'COMPLIMENTARY' : '$5.00'}</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 0.95rem; font-weight: 600;">
            <span style="color: var(--noir-ivory);">Total to Authorize:</span>
            <span style="color: var(--noir-ivory); font-family: var(--font-serif); font-size: 1.25rem;">$${totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <button type="submit" class="btn-checkout" style="margin-top: 0.5rem;">
          Generate Demo Dispatch Docket · $${totalAmount.toFixed(2)}
        </button>
      </form>
    </div>
  `;

  document.getElementById('checkoutBackToBagBtn').addEventListener('click', () => {
    restoreBagView();
  });

  document.getElementById('applePayBtn').addEventListener('click', () => {
    submitOrder();
  });
}

function restoreBagView() {
  const shippingMeter = document.getElementById('shippingMeter');
  const drawerFooter = document.querySelector('.drawer-footer');
  const drawerTitle = document.getElementById('drawerTitle');

  if (shippingMeter) shippingMeter.style.display = '';
  if (drawerFooter) drawerFooter.style.display = '';
  if (drawerTitle) drawerTitle.textContent = 'Your Bag';

  renderBag();
}

function submitOrder() {
  const orderRef = `#NR-2026-${Math.floor(100 + Math.random() * 900)}`;
  const totalAmount = bag.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const purchasedItems = [...bag];

  renderDispatchDocket(orderRef, totalAmount, purchasedItems);
}

function renderDispatchDocket(orderRef, totalAmount, items) {
  const itemsContainer = document.getElementById('drawerItems');
  const drawerTitle = document.getElementById('drawerTitle');

  if (drawerTitle) drawerTitle.textContent = 'Simulated Dispatch';

  if (!itemsContainer) return;

  const now = new Date();
  const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  itemsContainer.innerHTML = `
    <div class="dispatch-docket">
      <div class="docket-demo-tag">
        Portfolio Prototype · Demonstration Order Only
      </div>

      <div class="docket-stamp">
        <div>
          <span class="docket-brand-mark">NOIR</span>
          <span style="display: block; font-size: 0.72rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--noir-copper); margin-top: 0.25rem;">
            Specialty Roasters BV
          </span>
        </div>
        <div>
          <span class="docket-ref-code">${orderRef}</span>
          <span style="display: block; font-size: 0.72rem; color: var(--noir-ivory-dim); text-align: right; margin-top: 0.25rem;">
            ${dateStr}
          </span>
        </div>
      </div>

      <div class="docket-status-badge">
        Queue Preview · Small-Batch Roasting Schedule
      </div>

      <div class="docket-meta-grid">
        <div class="docket-meta-item">
          <span class="docket-meta-key">Roastery Facility</span>
          <span class="docket-meta-val">Rotterdam Tasting Room</span>
        </div>
        <div class="docket-meta-item">
          <span class="docket-meta-key">Roasting Machine</span>
          <span class="docket-meta-val">Loring S35 Convection</span>
        </div>
        <div class="docket-meta-item">
          <span class="docket-meta-key">Packaging</span>
          <span class="docket-meta-val">Spun Copper · Compostable</span>
        </div>
        <div class="docket-meta-item">
          <span class="docket-meta-key">Estimated Courier</span>
          <span class="docket-meta-val">Within 48h (Degassed)</span>
        </div>
      </div>

      <div class="docket-items-list">
        ${items.map(item => `
          <div class="docket-item-line">
            <div>
              <span class="docket-item-title">${item.name}</span>
              <span class="docket-item-specs" style="display: block;">${item.desc} (×${item.qty})</span>
            </div>
            <div style="font-family: var(--font-serif); font-size: 1.05rem; color: var(--noir-ivory);">
              $${item.price * item.qty}
            </div>
          </div>
        `).join('')}
      </div>

      <div class="docket-total-line">
        <span style="font-size: 0.85rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--noir-ivory-dim);">Simulated Total</span>
        <span class="docket-total-val">$${totalAmount.toFixed(2)}</span>
      </div>

      <div class="docket-guarantee-note">
        This dispatch docket illustrates NOIR's small-batch roasting and degassing workflow. In production, this step triggers cold courier fulfillment via a verified payment gateway webhook.
      </div>

      <button id="docketCompleteBtn" class="btn-checkout" type="button" style="margin-top: 0.5rem;">
        Complete Demo & Clear Bag
      </button>
    </div>
  `;

  document.getElementById('docketCompleteBtn').addEventListener('click', () => {
    // Clear bag upon completed order
    bag = [];
    saveBag();
    restoreBagView();
    closeDrawer();
  });
}

function openDrawer() {
  const backdrop = document.getElementById('drawerBackdrop');
  if (backdrop) backdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDrawer() {
  const backdrop = document.getElementById('drawerBackdrop');
  if (backdrop) backdrop.classList.remove('open');
  document.body.style.overflow = '';
}

function addToBag(item) {
  const existing = bag.find(i => i.id === item.id);
  if (existing) {
    existing.qty += 1;
  } else {
    bag.push({ ...item, qty: 1 });
  }
  renderBag();
}

function updateItemQty(itemId, delta) {
  const item = bag.find(i => i.id === itemId);
  if (!item) return;

  item.qty += delta;
  if (item.qty <= 0) {
    bag = bag.filter(i => i.id !== itemId);
  }
  renderBag();
}

function removeItem(itemId) {
  bag = bag.filter(i => i.id !== itemId);
  renderBag();
}

function renderBag() {
  saveBag();
  const countEls = document.querySelectorAll('.bag-count');
  const itemsContainer = document.getElementById('drawerItems');
  const subtotalEl = document.getElementById('drawerSubtotal');
  const meterText = document.getElementById('shippingMeterText');
  const meterFill = document.getElementById('shippingMeterFill');

  const totalQty = bag.reduce((sum, item) => sum + item.qty, 0);
  const totalAmount = bag.reduce((sum, item) => sum + (item.price * item.qty), 0);

  countEls.forEach(el => el.textContent = `(${totalQty})`);

  if (subtotalEl) {
    subtotalEl.textContent = `$${totalAmount.toFixed(2)}`;
  }

  // Update Free Shipping Meter ($50 threshold)
  if (meterText && meterFill) {
    const threshold = 50;
    const progress = Math.min(100, (totalAmount / threshold) * 100);
    meterFill.style.width = `${progress}%`;

    if (totalAmount >= threshold) {
      meterText.textContent = '✓ Complimentary courier delivery unlocked';
      meterText.classList.add('unlocked');
    } else {
      const remaining = (threshold - totalAmount).toFixed(2);
      meterText.textContent = `Add $${remaining} for complimentary courier delivery`;
      meterText.classList.remove('unlocked');
    }
  }

  if (!itemsContainer) return;

  if (bag.length === 0) {
    itemsContainer.innerHTML = `
      <div style="padding: 3.5rem 1rem; text-align: center; color: var(--noir-ivory-dim); font-size: 0.9rem; line-height: 1.6;">
        Your bag is empty.<br>
        <button id="emptyExploreBtn" style="margin-top: 1.25rem; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.12em; color: var(--noir-copper-light); border-bottom: 1px solid var(--noir-copper); padding-bottom: 2px;">
          Explore the Roasts ↓
        </button>
      </div>
    `;

    const exploreBtn = document.getElementById('emptyExploreBtn');
    if (exploreBtn) {
      exploreBtn.addEventListener('click', () => {
        closeDrawer();
        const roastsEl = document.getElementById('roasts');
        if (roastsEl) roastsEl.scrollIntoView({ behavior: 'smooth' });
      });
    }
    return;
  }

  itemsContainer.innerHTML = bag.map(item => `
    <div class="drawer-item-row" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" class="drawer-item-thumb">
      <div class="drawer-item-info">
        <h4>${item.name}</h4>
        <p>${item.desc}</p>
        <div class="drawer-qty-stepper">
          <button class="stepper-btn" onclick="updateItemQty('${item.id}', -1)" aria-label="Decrease quantity">−</button>
          <span class="stepper-val">${item.qty}</span>
          <button class="stepper-btn" onclick="updateItemQty('${item.id}', 1)" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <div class="drawer-item-right">
        <div class="drawer-item-price">$${item.price * item.qty}</div>
        <button class="drawer-item-remove" onclick="removeItem('${item.id}')">Remove</button>
      </div>
    </div>
  `).join('');
}

/* 6. Mobile Navigation Drawer Engine */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggleBtn');
  const drawer = document.getElementById('mobileNavDrawer');
  const closeBtn = document.getElementById('mobileNavCloseBtn');

  if (!drawer) return;

  function openMobileNav() {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileNav() {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openMobileNav();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMobileNav);
  }

  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) closeMobileNav();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeMobileNav();
    }
  });

  drawer.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', closeMobileNav);
  });
}
