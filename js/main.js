/**
 * main.js — Scenario AI Game Asset Platform
 * Primary JS controller for all interactive features.
 * ─────────────────────────────────────────────
 * Features:
 *  1. Sticky navbar with scroll behaviour
 *  2. Command Palette (Cmd/Ctrl+K)
 *  3. Scroll-triggered animations (IntersectionObserver)
 *  4. Hero typewriter + parallax
 *  5. Tabs & Accordions
 *  6. Pricing monthly/annual toggle
 *  7. Toast notification system
 *  8. Image comparison slider + 3D card tilt
 *  9. Form validation (login + multi-step signup)
 * 10. Lazy image loading
 * 11. Debounced scroll handler
 */

'use strict';

/* ═══════════════════════════════════════════════
   UTILITY HELPERS
═══════════════════════════════════════════════ */

/**
 * Debounce — limits how often a function fires.
 * @param {Function} fn   - function to debounce
 * @param {number}   wait - delay in ms
 */
function debounce(fn, wait = 100) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), wait);
  };
}

/**
 * Throttle — ensures a function fires at most once per interval.
 * @param {Function} fn       - function to throttle
 * @param {number}   interval - ms between allowed calls
 */
function throttle(fn, interval = 100) {
  let lastTime = 0;
  return (...args) => {
    const now = Date.now();
    if (now - lastTime >= interval) {
      lastTime = now;
      fn.apply(this, args);
    }
  };
}

/** Query shorthand */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ═══════════════════════════════════════════════
   1. STICKY NAVBAR
═══════════════════════════════════════════════ */

function initNavbar() {
  const navbar = $('#navbar');
  if (!navbar) return;

  const SCROLL_THRESHOLD = 20;

  const handleScroll = throttle(() => {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, 50);

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load

  // ── Mega dropdown menus ──────────────────────
  const dropdownTriggers = $$('.nav-dropdown-trigger');

  dropdownTriggers.forEach(trigger => {
    let openTimer, closeTimer;
    const dropdown = trigger.nextElementSibling;
    if (!dropdown) return;

    const show = () => {
      clearTimeout(closeTimer);
      openTimer = setTimeout(() => {
        // Close all others first
        $$('.nav-dropdown.open').forEach(d => {
          if (d !== dropdown) {
            d.classList.remove('open');
            d.previousElementSibling?.setAttribute('aria-expanded', 'false');
          }
        });
        dropdown.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
      }, 80);
    };

    const hide = () => {
      clearTimeout(openTimer);
      closeTimer = setTimeout(() => {
        dropdown.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
      }, 180);
    };

    trigger.addEventListener('mouseenter', show);
    trigger.addEventListener('mouseleave', hide);
    dropdown.addEventListener('mouseenter', () => clearTimeout(closeTimer));
    dropdown.addEventListener('mouseleave', hide);

    // Keyboard support
    trigger.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isOpen = dropdown.classList.toggle('open');
        trigger.setAttribute('aria-expanded', String(isOpen));
      }
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', e => {
    if (!e.target.closest('.nav-dropdown-wrapper')) {
      $$('.nav-dropdown.open').forEach(d => {
        d.classList.remove('open');
        d.previousElementSibling?.setAttribute('aria-expanded', 'false');
      });
    }
  });
}

/* ═══════════════════════════════════════════════
   MOBILE HAMBURGER MENU
═══════════════════════════════════════════════ */

function initMobileMenu() {
  const hamburger = $('#hamburger-btn');
  const mobileDrawer = $('#mobile-drawer');
  const mobileOverlay = $('#mobile-overlay');
  const mobileClose = $('#mobile-close-btn');

  if (!hamburger || !mobileDrawer) return;

  const open = () => {
    mobileDrawer.classList.add('open');
    mobileOverlay?.classList.add('visible');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  };

  const close = () => {
    mobileDrawer.classList.remove('open');
    mobileOverlay?.classList.remove('visible');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', open);
  mobileClose?.addEventListener('click', close);
  mobileOverlay?.addEventListener('click', close);

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') close();
  });

  // Mobile accordion for sub-menus in drawer
  $$('.mobile-nav-group-toggle').forEach(toggle => {
    toggle.addEventListener('click', () => {
      const group = toggle.closest('.mobile-nav-group');
      const sub = group?.querySelector('.mobile-nav-sub');
      if (!sub) return;
      const isOpen = sub.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(isOpen));
      sub.style.maxHeight = isOpen ? sub.scrollHeight + 'px' : '0';
    });
  });
}

/* ═══════════════════════════════════════════════
   ACTIVE LINK HIGHLIGHTING
═══════════════════════════════════════════════ */

function initActiveLinks() {
  const current = window.location.pathname.replace(/\/$/, '') || '/';
  $$('.nav-link, .mobile-nav-link').forEach(link => {
    const href = link.getAttribute('href')?.replace(/\/$/, '') || '';
    if (href && current.endsWith(href)) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'page');
    }
  });
}

/* ═══════════════════════════════════════════════
   2. COMMAND PALETTE (Cmd+K / Ctrl+K)
═══════════════════════════════════════════════ */

const PALETTE_ITEMS = [
  // Pages
  { category: 'Pages', label: 'Home', icon: '🏠', href: 'index.html', keywords: 'home main landing' },
  { category: 'Pages', label: 'Platform', icon: '⚙️', href: 'platform.html', keywords: 'platform features tools' },
  { category: 'Pages', label: 'AI Models', icon: '🤖', href: 'models.html', keywords: 'models ai generate' },
  { category: 'Pages', label: 'Pricing', icon: '💳', href: 'pricing.html', keywords: 'pricing plans cost' },
  { category: 'Pages', label: 'Enterprise', icon: '🏢', href: 'enterprise.html', keywords: 'enterprise business team' },
  { category: 'Pages', label: 'Resources', icon: '📚', href: 'resources.html', keywords: 'resources docs learn' },
  // Actions
  { category: 'Actions', label: 'Sign In', icon: '🔑', href: 'login.html', keywords: 'login signin' },
  { category: 'Actions', label: 'Get Started Free', icon: '🚀', href: 'signup.html', keywords: 'signup register start free' },
  { category: 'Actions', label: 'Open Documentation', icon: '📖', href: '#', keywords: 'docs documentation api' },
  { category: 'Actions', label: 'Contact Sales', icon: '💬', href: '#contact', keywords: 'sales contact enterprise' },
  // Features
  { category: 'Features', label: 'Image Generation', icon: '🎨', href: 'platform.html#image-gen', keywords: 'image generate art texture' },
  { category: 'Features', label: 'Model Training', icon: '🧠', href: 'models.html#training', keywords: 'train model finetune' },
  { category: 'Features', label: 'Asset Pipeline', icon: '🔗', href: 'platform.html#pipeline', keywords: 'pipeline workflow asset' },
  { category: 'Features', label: 'Team Collaboration', icon: '👥', href: 'enterprise.html#team', keywords: 'team collaborate workspace' },
];

function initCommandPalette() {
  const palette = $('#command-palette');
  const input = $('#command-palette-input');
  const resultsList = $('#command-palette-results');
  const overlay = $('#command-palette-overlay');

  if (!palette || !input || !resultsList) return;

  let filteredItems = [...PALETTE_ITEMS];
  let selectedIndex = -1;

  // ── Open / Close ─────────────────────────────
  const openPalette = () => {
    palette.classList.add('open');
    overlay?.classList.add('visible');
    document.body.style.overflow = 'hidden';
    input.value = '';
    selectedIndex = -1;
    renderResults(PALETTE_ITEMS);
    requestAnimationFrame(() => input.focus());
  };

  const closePalette = () => {
    palette.classList.remove('open');
    overlay?.classList.remove('visible');
    document.body.style.overflow = '';
  };

  // ── Keyboard shortcut ─────────────────────────
  document.addEventListener('keydown', e => {
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    const modKey = isMac ? e.metaKey : e.ctrlKey;
    if (modKey && e.key === 'k') {
      e.preventDefault();
      palette.classList.contains('open') ? closePalette() : openPalette();
    }
    if (e.key === 'Escape') closePalette();
  });

  // Palette trigger buttons in UI
  $$('[data-command-palette-trigger]').forEach(btn => {
    btn.addEventListener('click', openPalette);
  });

  overlay?.addEventListener('click', closePalette);

  // ── Search / Filter ───────────────────────────
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    filteredItems = q
      ? PALETTE_ITEMS.filter(item =>
          item.label.toLowerCase().includes(q) ||
          item.keywords.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
        )
      : [...PALETTE_ITEMS];
    selectedIndex = -1;
    renderResults(filteredItems);
  });

  // ── Keyboard navigation inside palette ───────
  input.addEventListener('keydown', e => {
    const items = $$('.palette-result-item', palette);
    if (!items.length) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedIndex = Math.min(selectedIndex + 1, items.length - 1);
      highlightItem(items, selectedIndex);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedIndex = Math.max(selectedIndex - 1, 0);
      highlightItem(items, selectedIndex);
    } else if (e.key === 'Enter') {
      if (selectedIndex >= 0 && items[selectedIndex]) {
        items[selectedIndex].click();
      }
    }
  });

  // ── Render results ────────────────────────────
  function renderResults(items) {
    resultsList.innerHTML = '';
    if (!items.length) {
      resultsList.innerHTML = '<li class="palette-empty">No results found</li>';
      return;
    }

    // Group by category
    const groups = items.reduce((acc, item) => {
      (acc[item.category] = acc[item.category] || []).push(item);
      return acc;
    }, {});

    Object.entries(groups).forEach(([category, groupItems]) => {
      const header = document.createElement('li');
      header.className = 'palette-category';
      header.textContent = category;
      resultsList.appendChild(header);

      groupItems.forEach(item => {
        const li = document.createElement('li');
        li.className = 'palette-result-item';
        li.setAttribute('role', 'option');
        li.innerHTML = `
          <span class="palette-item-icon">${item.icon}</span>
          <span class="palette-item-label">${item.label}</span>
          <span class="palette-item-category">${item.category}</span>
        `;
        li.addEventListener('click', () => {
          closePalette();
          if (item.href.startsWith('#')) {
            const target = $(item.href);
            target?.scrollIntoView({ behavior: 'smooth' });
          } else {
            window.location.href = item.href;
          }
        });
        li.addEventListener('mouseenter', () => {
          const allItems = $$('.palette-result-item', palette);
          selectedIndex = allItems.indexOf(li);
          highlightItem(allItems, selectedIndex);
        });
        resultsList.appendChild(li);
      });
    });
  }

  function highlightItem(items, idx) {
    items.forEach((item, i) => {
      item.classList.toggle('selected', i === idx);
      if (i === idx) item.scrollIntoView({ block: 'nearest' });
    });
  }
}

/* ═══════════════════════════════════════════════
   3. SCROLL ANIMATIONS (IntersectionObserver)
═══════════════════════════════════════════════ */

function initScrollAnimations() {
  const animEls = $$('.animate-on-scroll');
  if (!animEls.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // fire once
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  animEls.forEach(el => {
    // Assign stagger delays to grid children automatically
    const parent = el.closest('.stagger-parent');
    if (parent) {
      const siblings = $$('.animate-on-scroll', parent);
      siblings.forEach((s, i) => {
        s.style.transitionDelay = `${i * 90}ms`;
      });
    }
    observer.observe(el);
  });
}

/* ═══════════════════════════════════════════════
   COUNTER ANIMATION (stats section)
═══════════════════════════════════════════════ */

function initCounters() {
  const counters = $$('[data-count-to]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.countTo);
      const suffix = el.dataset.countSuffix || '';
      const duration = parseInt(el.dataset.countDuration || '2000', 10);
      const decimals = (el.dataset.countTo.split('.')[1] || '').length;
      let start = null;

      const step = timestamp => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current = eased * target;
        el.textContent = current.toFixed(decimals) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* ═══════════════════════════════════════════════
   4. HERO SECTION — Typewriter + Parallax
═══════════════════════════════════════════════ */

function initTypewriter() {
  const el = $('#typewriter-target');
  if (!el) return;

  const words = el.dataset.words
    ? JSON.parse(el.dataset.words)
    : ['Game Assets', 'Concept Art', 'Textures', 'Sprites', 'Environments'];

  let wordIdx = 0;
  let charIdx = 0;
  let deleting = false;
  let pause = false;

  const TYPING_SPEED = 85;
  const DELETE_SPEED = 45;
  const PAUSE_AFTER  = 1800;
  const PAUSE_BEFORE = 400;

  const type = () => {
    const current = words[wordIdx];

    if (deleting) {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        setTimeout(type, PAUSE_BEFORE);
        return;
      }
      setTimeout(type, DELETE_SPEED);
    } else {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        if (pause) return;
        pause = true;
        setTimeout(() => {
          pause = false;
          deleting = true;
          type();
        }, PAUSE_AFTER);
        return;
      }
      setTimeout(type, TYPING_SPEED);
    }
  };

  type();
}

function initHeroParallax() {
  const heroContent = $('.hero-content');
  const heroBg = $('.hero-bg-mesh');
  if (!heroContent && !heroBg) return;

  const onScroll = throttle(() => {
    const scrollY = window.scrollY;
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrollY * 0.25}px)`;
      heroContent.style.opacity = Math.max(0, 1 - scrollY / 500);
    }
    if (heroBg) {
      heroBg.style.transform = `translateY(${scrollY * 0.4}px)`;
    }
  }, 16);

  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ═══════════════════════════════════════════════
   5. TABS & ACCORDIONS
═══════════════════════════════════════════════ */

function initTabs() {
  $$('.tab-group').forEach(group => {
    const triggers = $$('.tab-btn', group);
    const panels   = $$('.tab-panel', group);

    const activate = (index) => {
      triggers.forEach((t, i) => {
        const active = i === index;
        t.classList.toggle('active', active);
        t.setAttribute('aria-selected', String(active));
      });
      panels.forEach((p, i) => {
        p.classList.toggle('active', i === index);
        p.setAttribute('hidden', i !== index ? '' : null);
        if (i === index) p.removeAttribute('hidden');
      });
    };

    triggers.forEach((btn, i) => {
      btn.addEventListener('click', () => activate(i));
      // Keyboard: left/right arrows
      btn.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') activate((i + 1) % triggers.length);
        if (e.key === 'ArrowLeft')  activate((i - 1 + triggers.length) % triggers.length);
      });
    });
  });
}

function initAccordions() {
  $$('.accordion-item').forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const content = item.querySelector('.accordion-content');
    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.toggle('open');
      trigger.setAttribute('aria-expanded', String(isOpen));
      content.style.maxHeight = isOpen ? content.scrollHeight + 'px' : '0';
    });
  });
}

/* ═══════════════════════════════════════════════
   6. PRICING TOGGLE (Monthly / Annual)
═══════════════════════════════════════════════ */

const PRICING_DATA = {
  monthly: {
    starter:    { price: 0,   label: 'Free forever' },
    pro:        { price: 49,  label: '/month' },
    studio:     { price: 149, label: '/month' },
    enterprise: { price: null, label: 'Custom' },
  },
  annual: {
    starter:    { price: 0,   label: 'Free forever' },
    pro:        { price: 39,  label: '/month, billed annually' },
    studio:     { price: 119, label: '/month, billed annually' },
    enterprise: { price: null, label: 'Custom' },
  },
};

function initPricingToggle() {
  const toggle = $('#pricing-toggle');
  const badge  = $('#pricing-save-badge');
  if (!toggle) return;

  const applyPricing = (period) => {
    const data = PRICING_DATA[period];
    $$('[data-plan]').forEach(card => {
      const plan = card.dataset.plan;
      if (!data[plan]) return;
      const { price, label } = data[plan];
      const priceEl = card.querySelector('[data-price]');
      const labelEl = card.querySelector('[data-price-label]');
      if (priceEl) {
        priceEl.textContent = price === null ? 'Custom' : price === 0 ? '$0' : `$${price}`;
      }
      if (labelEl) labelEl.textContent = label;
    });

    // Show/hide save badge
    if (badge) {
      badge.style.opacity = period === 'annual' ? '1' : '0';
      badge.style.transform = period === 'annual' ? 'scale(1)' : 'scale(0.8)';
    }
  };

  toggle.addEventListener('change', () => {
    applyPricing(toggle.checked ? 'annual' : 'monthly');
  });

  // ── Label click shortcut ──
  $$('[data-pricing-period]').forEach(label => {
    label.addEventListener('click', () => {
      const period = label.dataset.pricingPeriod;
      toggle.checked = period === 'annual';
      applyPricing(period);
    });
  });

  applyPricing('monthly'); // init
}

/* ═══════════════════════════════════════════════
   7. TOAST NOTIFICATIONS
═══════════════════════════════════════════════ */

const ToastManager = (() => {
  let container;

  const getContainer = () => {
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-atomic', 'false');
      document.body.appendChild(container);
    }
    return container;
  };

  const ICONS = {
    success: '✓',
    error:   '✕',
    info:    'ℹ',
    warning: '⚠',
  };

  const show = (message, type = 'info', duration = 4000) => {
    const c = getContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <span class="toast-icon">${ICONS[type] || ICONS.info}</span>
      <span class="toast-message">${message}</span>
      <button class="toast-dismiss" aria-label="Dismiss">✕</button>
    `;

    const dismiss = () => {
      toast.classList.add('toast-exit');
      toast.addEventListener('animationend', () => toast.remove(), { once: true });
    };

    toast.querySelector('.toast-dismiss').addEventListener('click', dismiss);
    c.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('toast-enter'));
    if (duration > 0) setTimeout(dismiss, duration);
    return { dismiss };
  };

  return { show, success: m => show(m, 'success'), error: m => show(m, 'error'), info: m => show(m, 'info'), warning: m => show(m, 'warning') };
})();

// Expose globally
window.Toast = ToastManager;

/* ═══════════════════════════════════════════════
   8. IMAGE COMPARISON SLIDER (Before / After)
═══════════════════════════════════════════════ */

function initImageComparison() {
  $$('.image-compare').forEach(wrapper => {
    const handle = wrapper.querySelector('.compare-handle');
    const overlay = wrapper.querySelector('.compare-overlay');
    if (!handle || !overlay) return;

    let dragging = false;

    const setPosition = (x) => {
      const rect = wrapper.getBoundingClientRect();
      const pct = Math.min(100, Math.max(0, ((x - rect.left) / rect.width) * 100));
      overlay.style.width = pct + '%';
      handle.style.left = pct + '%';
    };

    handle.addEventListener('mousedown', () => (dragging = true));
    document.addEventListener('mousemove', e => { if (dragging) setPosition(e.clientX); });
    document.addEventListener('mouseup',   () => (dragging = false));

    // Touch
    handle.addEventListener('touchstart', () => (dragging = true), { passive: true });
    document.addEventListener('touchmove', e => {
      if (dragging) setPosition(e.touches[0].clientX);
    }, { passive: true });
    document.addEventListener('touchend', () => (dragging = false));

    setPosition(wrapper.getBoundingClientRect().left + wrapper.offsetWidth / 2);
  });
}

/* ═══════════════════════════════════════════════
   3D CARD TILT EFFECT
═══════════════════════════════════════════════ */

function init3DTilt() {
  $$('.tilt-card').forEach(card => {
    const MAX_TILT = 12; // degrees

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const rotateY = ((x - cx) / cx) * MAX_TILT;
      const rotateX = -((y - cy) / cy) * MAX_TILT;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.03, 1.03, 1.03)`;
      // Glare position
      const glare = card.querySelector('.card-glare');
      if (glare) {
        glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.12) 0%, transparent 70%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale3d(1,1,1)';
      const glare = card.querySelector('.card-glare');
      if (glare) glare.style.background = 'none';
    });
  });
}

/* ═══════════════════════════════════════════════
   SMOOTH SCROLL ANCHOR LINKS
═══════════════════════════════════════════════ */

function initSmoothScroll() {
  $$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const id = link.getAttribute('href').slice(1);
      if (!id) return;
      const target = document.getElementById(id);
      if (target) {
        e.preventDefault();
        const navH = $('#navbar')?.offsetHeight || 0;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ═══════════════════════════════════════════════
   9. FORM VALIDATION
═══════════════════════════════════════════════ */

function initLoginForm() {
  const form = $('#login-form');
  if (!form) return;

  const emailEl = form.querySelector('[name="email"]');
  const passEl  = form.querySelector('[name="password"]');

  const showError = (input, msg) => {
    const group = input.closest('.form-group');
    group?.querySelector('.form-error')?.remove();
    input.classList.add('invalid');
    const err = document.createElement('span');
    err.className = 'form-error';
    err.textContent = msg;
    group?.appendChild(err);
  };

  const clearError = input => {
    const group = input.closest('.form-group');
    group?.querySelector('.form-error')?.remove();
    input.classList.remove('invalid');
  };

  const validateEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  emailEl?.addEventListener('blur', () => {
    if (!validateEmail(emailEl.value)) {
      showError(emailEl, 'Please enter a valid email address.');
    } else {
      clearError(emailEl);
    }
  });

  passEl?.addEventListener('blur', () => {
    if (passEl.value.length < 8) {
      showError(passEl, 'Password must be at least 8 characters.');
    } else {
      clearError(passEl);
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    if (!validateEmail(emailEl?.value)) { showError(emailEl, 'Valid email required.'); valid = false; }
    if ((passEl?.value || '').length < 8) { showError(passEl, 'Min 8 characters.'); valid = false; }
    if (valid) {
      ToastManager.info('Signing you in…');
      setTimeout(() => { window.location.href = 'index.html'; }, 1200);
    }
  });
}

/* ─── Multi-step Signup Form ──────────────────── */

function initSignupForm() {
  const form = $('#signup-form');
  if (!form) return;

  const steps = $$('.signup-step', form);
  const progressBar = $('#signup-progress');
  let currentStep = 0;

  const VALIDATORS = [
    // Step 0: account info
    () => {
      const email = form.querySelector('[name="signup-email"]');
      const pass  = form.querySelector('[name="signup-password"]');
      let ok = true;
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email?.value || '')) {
        showSignupError(email, 'Valid email required.'); ok = false;
      }
      if ((pass?.value || '').length < 8) {
        showSignupError(pass, 'Min 8 characters.'); ok = false;
      }
      return ok;
    },
    // Step 1: profile
    () => {
      const name = form.querySelector('[name="signup-name"]');
      if (!name?.value.trim()) {
        showSignupError(name, 'Name is required.'); return false;
      }
      return true;
    },
    // Step 2: plan selection — always valid
    () => true,
  ];

  const showSignupError = (input, msg) => {
    if (!input) return;
    const old = input.parentNode.querySelector('.form-error');
    old?.remove();
    input.classList.add('invalid');
    const err = document.createElement('span');
    err.className = 'form-error';
    err.textContent = msg;
    input.parentNode.appendChild(err);
  };

  const goTo = (index) => {
    steps[currentStep].classList.remove('active');
    steps[index].classList.add('active');
    currentStep = index;
    if (progressBar) {
      progressBar.style.width = `${((currentStep) / (steps.length - 1)) * 100}%`;
    }
    form.querySelector(`[data-step-label]`)?.setAttribute('data-step-label', `Step ${currentStep + 1} of ${steps.length}`);
  };

  $$('[data-signup-next]', form).forEach(btn => {
    btn.addEventListener('click', () => {
      if (VALIDATORS[currentStep]?.()) {
        if (currentStep < steps.length - 1) goTo(currentStep + 1);
      }
    });
  });

  $$('[data-signup-back]', form).forEach(btn => {
    btn.addEventListener('click', () => {
      if (currentStep > 0) goTo(currentStep - 1);
    });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (VALIDATORS[currentStep]?.()) {
      ToastManager.success('Account created! Redirecting…');
      setTimeout(() => { window.location.href = 'index.html'; }, 1500);
    }
  });
}

/* ═══════════════════════════════════════════════
   10. DARK MODE ENFORCEMENT
═══════════════════════════════════════════════ */

function enforceDarkMode() {
  document.documentElement.setAttribute('data-theme', 'dark');
  document.documentElement.classList.add('dark');
  // Persist so no flash on next load
  localStorage.setItem('theme', 'dark');
}

/* ═══════════════════════════════════════════════
   11. LAZY IMAGE LOADING
═══════════════════════════════════════════════ */

function initLazyImages() {
  if ('loading' in HTMLImageElement.prototype) {
    // Native lazy loading already set via HTML attribute
    return;
  }
  // Polyfill with IntersectionObserver
  const lazyImgs = $$('img[data-src]');
  if (!lazyImgs.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        if (img.dataset.srcset) img.srcset = img.dataset.srcset;
        img.removeAttribute('data-src');
        observer.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  lazyImgs.forEach(img => observer.observe(img));
}

/* ═══════════════════════════════════════════════
   HERO GRADIENT MESH ANIMATION (CSS-driven)
═══════════════════════════════════════════════ */

function initGradientMesh() {
  const canvas = $('#hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  const resize = () => {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };
  resize();
  window.addEventListener('resize', debounce(resize, 200));

  // Animated gradient orbs
  const orbs = [
    { x: 0.2, y: 0.3, r: 0.45, color: 'rgba(99, 57, 255, 0.35)', dx: 0.0003, dy: 0.0002 },
    { x: 0.7, y: 0.6, r: 0.40, color: 'rgba(0, 212, 255, 0.25)',  dx: -0.0002, dy: 0.0003 },
    { x: 0.5, y: 0.1, r: 0.35, color: 'rgba(255, 62, 138, 0.2)',  dx: 0.0001, dy: -0.0002 },
  ];

  const draw = () => {
    const W = canvas.width;
    const H = canvas.height;
    ctx.clearRect(0, 0, W, H);

    orbs.forEach(orb => {
      orb.x += orb.dx;
      orb.y += orb.dy;
      // Bounce
      if (orb.x < 0 || orb.x > 1) orb.dx *= -1;
      if (orb.y < 0 || orb.y > 1) orb.dy *= -1;

      const grad = ctx.createRadialGradient(orb.x * W, orb.y * H, 0, orb.x * W, orb.y * H, orb.r * W);
      grad.addColorStop(0, orb.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);
    });

    requestAnimationFrame(draw);
  };
  draw();
}

/* ═══════════════════════════════════════════════
   INIT — Run everything on DOMContentLoaded
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  enforceDarkMode();
  initNavbar();
  initMobileMenu();
  initActiveLinks();
  initCommandPalette();
  initScrollAnimations();
  initCounters();
  initTypewriter();
  initHeroParallax();
  initTabs();
  initAccordions();
  initPricingToggle();
  initImageComparison();
  init3DTilt();
  initSmoothScroll();
  initLoginForm();
  initSignupForm();
  initLazyImages();
  initGradientMesh();

  console.log('%c Scenario AI Platform — JS loaded ✓', 'color:#6339ff;font-weight:bold;font-size:14px;');
});

/* ═══════════════════════════════════════════════
   EXPORT (for module bundlers / ES Modules)
═══════════════════════════════════════════════ */

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ToastManager, PRICING_DATA, PALETTE_ITEMS };
}
