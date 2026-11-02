/**
 * navigation.js — Scenario AI Game Asset Platform
 * Complete navigation system: data, mega menus, mobile drawer,
 * breadcrumbs, and keyboard-accessible interactions.
 * ─────────────────────────────────────────────────────────────
 */

'use strict';

/* ═══════════════════════════════════════════════
   NAV LINK DATA  (single source of truth)
═══════════════════════════════════════════════ */

const NAV_LINKS = [
  {
    label: 'Platform',
    href: 'platform.html',
    hasMega: true,
    megaKey: 'platform',
  },
  {
    label: 'Models',
    href: 'models.html',
    hasMega: true,
    megaKey: 'models',
  },
  {
    label: 'Pricing',
    href: 'pricing.html',
    hasMega: false,
  },
  {
    label: 'Enterprise',
    href: 'enterprise.html',
    hasMega: false,
  },
  {
    label: 'Resources',
    href: 'resources.html',
    hasMega: true,
    megaKey: 'resources',
  },
];

/* ═══════════════════════════════════════════════
   MEGA MENU DATA
═══════════════════════════════════════════════ */

const MEGA_MENUS = {
  platform: {
    sections: [
      {
        heading: 'Create',
        items: [
          {
            icon: '🎨',
            label: 'Image Generation',
            desc: 'Generate stunning game art in seconds',
            href: 'platform.html#image-gen',
            badge: null,
          },
          {
            icon: '🗺️',
            label: 'Tilemap Creator',
            desc: 'Design seamless tile-based environments',
            href: 'platform.html#tilemap',
            badge: null,
          },
          {
            icon: '🧩',
            label: 'Sprite Sheet Builder',
            desc: 'Pack animations into optimised sheets',
            href: 'platform.html#sprites',
            badge: 'New',
          },
          {
            icon: '🌄',
            label: 'Background Generator',
            desc: 'Parallax-ready scene backgrounds',
            href: 'platform.html#backgrounds',
            badge: null,
          },
        ],
      },
      {
        heading: 'Manage',
        items: [
          {
            icon: '📦',
            label: 'Asset Pipeline',
            desc: 'Automate your art production workflow',
            href: 'platform.html#pipeline',
            badge: null,
          },
          {
            icon: '🗂️',
            label: 'Project Library',
            desc: 'Organise and tag all your assets',
            href: 'platform.html#library',
            badge: null,
          },
          {
            icon: '🔗',
            label: 'API & Integrations',
            desc: 'Connect Scenario to your game engine',
            href: 'platform.html#api',
            badge: 'Beta',
          },
        ],
      },
      {
        heading: 'Collaborate',
        items: [
          {
            icon: '👥',
            label: 'Team Workspace',
            desc: 'Real-time collaboration for your art team',
            href: 'platform.html#teams',
            badge: null,
          },
          {
            icon: '💬',
            label: 'Review & Approval',
            desc: 'Streamlined feedback loops',
            href: 'platform.html#review',
            badge: null,
          },
        ],
      },
    ],
    featured: {
      label: 'See it in action',
      desc: 'Watch how studios ship 10× faster with Scenario',
      href: 'platform.html#demo',
      img: 'assets/images/mega-featured-platform.webp',
    },
  },

  models: {
    sections: [
      {
        heading: 'Foundation Models',
        items: [
          {
            icon: '✨',
            label: 'Scenario Base',
            desc: 'Our flagship game-optimised diffusion model',
            href: 'models.html#base',
            badge: null,
          },
          {
            icon: '🖌️',
            label: 'Pixel Perfect',
            desc: 'High-fidelity pixel-art specialist',
            href: 'models.html#pixel',
            badge: null,
          },
          {
            icon: '🏰',
            label: 'Fantasy Epic',
            desc: 'High-fantasy illustration style',
            href: 'models.html#fantasy',
            badge: null,
          },
          {
            icon: '🚀',
            label: 'Sci-Fi Forge',
            desc: 'Futuristic environments & characters',
            href: 'models.html#scifi',
            badge: 'New',
          },
        ],
      },
      {
        heading: 'Custom Training',
        items: [
          {
            icon: '🧠',
            label: 'Train Your Own',
            desc: 'Fine-tune on your studio's art style',
            href: 'models.html#training',
            badge: null,
          },
          {
            icon: '📊',
            label: 'Model Analytics',
            desc: 'Monitor quality, usage & performance',
            href: 'models.html#analytics',
            badge: null,
          },
          {
            icon: '🔒',
            label: 'Private Models',
            desc: 'Keep IP secure in your own environment',
            href: 'models.html#private',
            badge: 'Enterprise',
          },
        ],
      },
    ],
    featured: {
      label: 'Model Gallery',
      desc: 'Explore 50+ community and official models',
      href: 'models.html#gallery',
      img: 'assets/images/mega-featured-models.webp',
    },
  },

  resources: {
    sections: [
      {
        heading: 'Learn',
        items: [
          {
            icon: '📖',
            label: 'Documentation',
            desc: 'Full API & SDK reference',
            href: 'resources.html#docs',
            badge: null,
          },
          {
            icon: '🎓',
            label: 'Tutorials',
            desc: 'Step-by-step guides for every skill level',
            href: 'resources.html#tutorials',
            badge: null,
          },
          {
            icon: '🎥',
            label: 'Video Courses',
            desc: 'In-depth walkthroughs from pros',
            href: 'resources.html#videos',
            badge: null,
          },
          {
            icon: '📝',
            label: 'Blog',
            desc: 'News, tips and case studies',
            href: 'resources.html#blog',
            badge: null,
          },
        ],
      },
      {
        heading: 'Community',
        items: [
          {
            icon: '💬',
            label: 'Discord',
            desc: 'Join 40,000+ game creators',
            href: 'https://discord.gg/scenario',
            badge: null,
          },
          {
            icon: '🏆',
            label: 'Showcase',
            desc: 'Games built with Scenario',
            href: 'resources.html#showcase',
            badge: null,
          },
          {
            icon: '🐞',
            label: 'Status & Support',
            desc: 'System status and help desk',
            href: 'resources.html#support',
            badge: null,
          },
        ],
      },
    ],
    featured: {
      label: 'Latest Tutorial',
      desc: 'Building a complete RPG asset pack in 30 minutes',
      href: 'resources.html#latest',
      img: 'assets/images/mega-featured-resources.webp',
    },
  },
};

/* ═══════════════════════════════════════════════
   MEGA MENU HTML BUILDER
═══════════════════════════════════════════════ */

/**
 * Renders a mega-menu dropdown element from data.
 * @param {string} key - Key into MEGA_MENUS
 * @returns {HTMLElement} The dropdown element
 */
function buildMegaMenu(key) {
  const data = MEGA_MENUS[key];
  if (!data) return null;

  const dropdown = document.createElement('div');
  dropdown.className = 'nav-dropdown mega-dropdown';
  dropdown.setAttribute('role', 'menu');

  // Sections
  const grid = document.createElement('div');
  grid.className = 'mega-grid';

  data.sections.forEach(section => {
    const col = document.createElement('div');
    col.className = 'mega-col';

    const heading = document.createElement('p');
    heading.className = 'mega-col-heading';
    heading.textContent = section.heading;
    col.appendChild(heading);

    section.items.forEach(item => {
      const a = document.createElement('a');
      a.href = item.href;
      a.className = 'mega-item';
      a.setAttribute('role', 'menuitem');
      a.innerHTML = `
        <span class="mega-item-icon">${item.icon}</span>
        <span class="mega-item-body">
          <span class="mega-item-label">
            ${item.label}
            ${item.badge ? `<span class="mega-badge">${item.badge}</span>` : ''}
          </span>
          <span class="mega-item-desc">${item.desc}</span>
        </span>
      `;
      col.appendChild(a);
    });

    grid.appendChild(col);
  });

  dropdown.appendChild(grid);

  // Featured card
  if (data.featured) {
    const feat = document.createElement('a');
    feat.href = data.featured.href;
    feat.className = 'mega-featured';
    feat.setAttribute('role', 'menuitem');
    feat.innerHTML = `
      <div class="mega-featured-img-wrap">
        <img src="${data.featured.img}" alt="${data.featured.label}" class="mega-featured-img" loading="lazy" onerror="this.parentNode.style.display='none'">
        <div class="mega-featured-overlay">
          <span class="mega-featured-cta">Explore →</span>
        </div>
      </div>
      <div class="mega-featured-body">
        <span class="mega-featured-label">${data.featured.label}</span>
        <span class="mega-featured-desc">${data.featured.desc}</span>
      </div>
    `;
    dropdown.appendChild(feat);
  }

  return dropdown;
}

/* ═══════════════════════════════════════════════
   DESKTOP NAVBAR BUILDER
═══════════════════════════════════════════════ */

/**
 * Builds and injects the full desktop nav into #navbar .nav-links-container.
 * Falls back gracefully if element doesn't exist (static HTML used instead).
 */
function buildDesktopNav() {
  const container = document.querySelector('.nav-links-container');
  if (!container) return;

  NAV_LINKS.forEach(link => {
    if (link.hasMega) {
      const wrapper = document.createElement('div');
      wrapper.className = 'nav-dropdown-wrapper';

      const trigger = document.createElement('button');
      trigger.className = 'nav-link nav-dropdown-trigger';
      trigger.setAttribute('aria-expanded', 'false');
      trigger.setAttribute('aria-haspopup', 'true');
      trigger.innerHTML = `${link.label} <span class="nav-chevron" aria-hidden="true">▾</span>`;
      wrapper.appendChild(trigger);

      const menu = buildMegaMenu(link.megaKey);
      if (menu) wrapper.appendChild(menu);

      container.appendChild(wrapper);
    } else {
      const a = document.createElement('a');
      a.href = link.href;
      a.className = 'nav-link';
      a.textContent = link.label;
      container.appendChild(a);
    }
  });
}

/* ═══════════════════════════════════════════════
   MOBILE DRAWER BUILDER
═══════════════════════════════════════════════ */

/**
 * Builds the mobile drawer nav from NAV_LINKS + MEGA_MENUS data.
 */
function buildMobileNav() {
  const mobileNav = document.querySelector('.mobile-nav-list');
  if (!mobileNav) return;

  NAV_LINKS.forEach(link => {
    const li = document.createElement('li');
    li.className = 'mobile-nav-item';

    if (link.hasMega) {
      const data = MEGA_MENUS[link.megaKey];
      li.className += ' mobile-nav-group';
      li.innerHTML = `
        <button class="mobile-nav-link mobile-nav-group-toggle" aria-expanded="false">
          ${link.label}
          <span class="mobile-nav-chevron" aria-hidden="true">▾</span>
        </button>
        <ul class="mobile-nav-sub" aria-label="${link.label} submenu">
          ${data.sections.flatMap(s => s.items).map(item => `
            <li>
              <a href="${item.href}" class="mobile-nav-sub-link">
                <span class="mobile-nav-sub-icon">${item.icon}</span>
                ${item.label}
              </a>
            </li>
          `).join('')}
        </ul>
      `;
    } else {
      li.innerHTML = `<a href="${link.href}" class="mobile-nav-link">${link.label}</a>`;
    }

    mobileNav.appendChild(li);
  });
}

/* ═══════════════════════════════════════════════
   BREADCRUMB GENERATOR
═══════════════════════════════════════════════ */

/**
 * Page metadata used to generate breadcrumb labels.
 */
const PAGE_META = {
  'index.html': { label: 'Home', icon: '🏠' },
  'platform.html': { label: 'Platform', icon: '⚙️' },
  'models.html': { label: 'AI Models', icon: '🤖' },
  'pricing.html': { label: 'Pricing', icon: '💳' },
  'enterprise.html': { label: 'Enterprise', icon: '🏢' },
  'resources.html': { label: 'Resources', icon: '📚' },
  'login.html': { label: 'Sign In', icon: '🔑' },
  'signup.html': { label: 'Get Started', icon: '🚀' },
};

/**
 * Injects a <nav aria-label="breadcrumb"> into [data-breadcrumb-target].
 */
function initBreadcrumbs() {
  const target = document.querySelector('[data-breadcrumb-target]');
  if (!target) return;

  const path = window.location.pathname;
  const filename = path.split('/').pop() || 'index.html';
  const meta = PAGE_META[filename];

  if (!meta || filename === 'index.html') return; // No breadcrumb on home

  const nav = document.createElement('nav');
  nav.setAttribute('aria-label', 'breadcrumb');
  nav.className = 'breadcrumb';

  nav.innerHTML = `
    <ol class="breadcrumb-list" role="list">
      <li class="breadcrumb-item">
        <a href="index.html" class="breadcrumb-link">
          <span aria-hidden="true">🏠</span>
          Home
        </a>
      </li>
      <li class="breadcrumb-sep" aria-hidden="true">/</li>
      <li class="breadcrumb-item breadcrumb-current" aria-current="page">
        <span aria-hidden="true">${meta.icon}</span>
        ${meta.label}
      </li>
    </ol>
  `;

  target.appendChild(nav);
}

/* ═══════════════════════════════════════════════
   MEGA MENU — HOVER + KEYBOARD LOGIC
   (extends the event listeners in main.js for
    dynamically injected menus)
═══════════════════════════════════════════════ */

function initMegaMenuA11y() {
  // Trap focus within open mega menus with Tab
  document.addEventListener('keydown', e => {
    const openMenu = document.querySelector('.nav-dropdown.open');
    if (!openMenu) return;

    if (e.key === 'Tab') {
      const focusable = [...openMenu.querySelectorAll('a, button, [tabindex]')];
      if (!focusable.length) return;
      const first = focusable[0];
      const last  = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        openMenu.classList.remove('open');
        // Return focus to trigger
        openMenu.previousElementSibling?.focus();
      }
    }

    if (e.key === 'Escape') {
      openMenu.classList.remove('open');
      openMenu.previousElementSibling?.focus();
    }
  });
}

/* ═══════════════════════════════════════════════
   SCROLL PROGRESS INDICATOR
═══════════════════════════════════════════════ */

function initScrollProgress() {
  const bar = document.getElementById('scroll-progress-bar');
  if (!bar) return;

  const update = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    bar.style.width = pct + '%';
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ═══════════════════════════════════════════════
   BACK-TO-TOP BUTTON
═══════════════════════════════════════════════ */

function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  const show = () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  };

  window.addEventListener('scroll', show, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ═══════════════════════════════════════════════
   ACTIVE SECTION HIGHLIGHT (Scrollspy)
═══════════════════════════════════════════════ */

function initScrollSpy() {
  const sections = [...document.querySelectorAll('section[id]')];
  const navLinks = [...document.querySelectorAll('.nav-link[href*="#"]')];
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          const match = link.getAttribute('href').endsWith(`#${id}`);
          link.classList.toggle('spy-active', match);
        });
      }
    });
  }, {
    rootMargin: '-30% 0px -60% 0px',
    threshold: 0,
  });

  sections.forEach(s => observer.observe(s));
}

/* ═══════════════════════════════════════════════
   EXTERNAL LINK SAFETY (noopener / noreferrer)
═══════════════════════════════════════════════ */

function secureExternalLinks() {
  document.querySelectorAll('a[href^="http"]').forEach(link => {
    const isSameOrigin = link.hostname === window.location.hostname;
    if (!isSameOrigin) {
      link.setAttribute('rel', 'noopener noreferrer');
      if (!link.hasAttribute('target')) {
        link.setAttribute('target', '_blank');
      }
    }
  });
}

/* ═══════════════════════════════════════════════
   INIT
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  buildDesktopNav();
  buildMobileNav();
  initBreadcrumbs();
  initMegaMenuA11y();
  initScrollProgress();
  initBackToTop();
  initScrollSpy();
  secureExternalLinks();
});

/* ═══════════════════════════════════════════════
   EXPORTS
═══════════════════════════════════════════════ */

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    NAV_LINKS,
    MEGA_MENUS,
    PAGE_META,
    buildMegaMenu,
    buildDesktopNav,
    buildMobileNav,
  };
}
