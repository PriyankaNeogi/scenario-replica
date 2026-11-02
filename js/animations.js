/**
 * animations.js — Scenario AI Game Asset Platform
 * Advanced animation utilities:
 *  • GSAP-inspired scroll timeline (pure JS)
 *  • Number counter animations
 *  • Text scramble effect
 *  • Canvas particle background
 *  • Loading / splash screen
 *  • Smooth page transitions
 *  • Magnetic button effect
 *  • Reveal text (word-by-word)
 * ────────────────────────────────────────────────
 */

'use strict';

/* ═══════════════════════════════════════════════
   EASING FUNCTIONS
═══════════════════════════════════════════════ */

const Easing = {
  linear:      t => t,
  easeInQuad:  t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  easeOutCubic:  t => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
  easeOutExpo:   t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  easeOutElastic: t => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  easeOutBounce: t => {
    const n1 = 7.5625, d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },
};

/* ═══════════════════════════════════════════════
   MINI TWEEN ENGINE  (GSAP-like, pure JS)
═══════════════════════════════════════════════ */

/**
 * Lightweight keyframe tween for CSS properties.
 *
 * @param {HTMLElement|HTMLElement[]} targets - DOM node(s) to animate
 * @param {Object} fromProps  - starting CSS property values  { opacity: 0, y: 40 }
 * @param {Object} toProps    - ending CSS property values    { opacity: 1, y: 0 }
 * @param {Object} options    - { duration, delay, ease, onComplete }
 * @returns {{ cancel: Function }} handle to cancel animation
 */
function tween(targets, fromProps, toProps, options = {}) {
  const {
    duration = 600,
    delay    = 0,
    ease     = 'easeOutCubic',
    onComplete,
  } = options;

  const easeFn   = Easing[ease] || Easing.easeOutCubic;
  const els      = Array.isArray(targets) ? targets : [targets];
  let   startTS  = null;
  let   rafId    = null;
  let   cancelled = false;

  // Map shorthand props (x, y, scale) to actual CSS transforms
  const parseProps = props => {
    const css = {};
    const transform = {};
    Object.entries(props).forEach(([k, v]) => {
      if (k === 'x')       transform.translateX = v;
      else if (k === 'y')  transform.translateY = v;
      else if (k === 'scale') transform.scale   = v;
      else if (k === 'rotate') transform.rotate  = v;
      else                 css[k] = v;
    });
    if (Object.keys(transform).length) css._transform = transform;
    return css;
  };

  const buildTransformString = (t) =>
    Object.entries(t).map(([fn, val]) => {
      if (fn === 'translateX' || fn === 'translateY') return `${fn}(${val}px)`;
      if (fn === 'scale')    return `scale(${val})`;
      if (fn === 'rotate')   return `rotate(${val}deg)`;
      return '';
    }).join(' ');

  const fromParsed = parseProps(fromProps);
  const toParsed   = parseProps(toProps);

  // Apply initial state immediately
  els.forEach(el => {
    Object.entries(fromParsed).forEach(([k, v]) => {
      if (k === '_transform') {
        el.style.transform = buildTransformString(v);
      } else {
        el.style[k] = typeof v === 'number' && k !== 'opacity' ? `${v}px` : v;
      }
    });
  });

  const step = timestamp => {
    if (cancelled) return;
    if (!startTS) startTS = timestamp;
    const elapsed  = timestamp - startTS;
    const progress = Math.min(elapsed / duration, 1);
    const eased    = easeFn(progress);

    els.forEach(el => {
      // Interpolate plain CSS props
      Object.keys(toParsed).forEach(k => {
        if (k === '_transform') return;
        const from = typeof fromParsed[k] === 'number' ? fromParsed[k] : parseFloat(fromParsed[k]) || 0;
        const to   = typeof toParsed[k]   === 'number' ? toParsed[k]   : parseFloat(toParsed[k])   || 0;
        const val  = from + (to - from) * eased;
        el.style[k] = (k === 'opacity') ? val : `${val}px`;
      });

      // Interpolate transforms
      if (toParsed._transform) {
        const fromT = fromParsed._transform || {};
        const toT   = toParsed._transform;
        const interp = {};
        Object.keys(toT).forEach(fn => {
          const f = fromT[fn] !== undefined ? fromT[fn] : (fn === 'scale' ? 1 : 0);
          const t = toT[fn];
          interp[fn] = f + (t - f) * eased;
        });
        el.style.transform = buildTransformString(interp);
      }
    });

    if (progress < 1) {
      rafId = requestAnimationFrame(step);
    } else {
      onComplete?.();
    }
  };

  setTimeout(() => {
    if (!cancelled) rafId = requestAnimationFrame(step);
  }, delay);

  return {
    cancel: () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    },
  };
}

/* ═══════════════════════════════════════════════
   SCROLL TIMELINE  (trigger tweens on scroll)
═══════════════════════════════════════════════ */

class ScrollTimeline {
  /**
   * @param {Array<{selector, from, to, options, trigger?}>} timeline
   * trigger is a CSS selector; if omitted the element itself is the trigger.
   */
  constructor(timeline = []) {
    this._entries = timeline;
    this._tweens  = [];
    this._observer = null;
    this.init();
  }

  init() {
    this._observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const data = entry.target._scrollTimelineData;
        if (!data) return;

        const targets = data.selector
          ? [...document.querySelectorAll(data.selector)]
          : [entry.target];

        tween(targets, data.from, data.to, data.options);
        this._observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

    this._entries.forEach(entry => {
      const triggerEl = entry.trigger
        ? document.querySelector(entry.trigger)
        : document.querySelector(entry.selector);

      if (!triggerEl) return;
      triggerEl._scrollTimelineData = entry;
      this._observer.observe(triggerEl);
    });
  }

  destroy() {
    this._observer?.disconnect();
    this._tweens.forEach(t => t.cancel());
  }
}

/* ═══════════════════════════════════════════════
   TEXT SCRAMBLE EFFECT
═══════════════════════════════════════════════ */

class TextScramble {
  /**
   * @param {HTMLElement} el - Target element
   */
  constructor(el) {
    this.el = el;
    this.chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*';
    this.resolve = null;
    this.frameRequest = null;
    this.frame = 0;
    this.queue = [];
  }

  /**
   * Scramble into newText.
   * @param {string} newText
   * @returns {Promise}
   */
  setText(newText) {
    const oldText = this.el.innerText;
    const length  = Math.max(oldText.length, newText.length);
    return new Promise(resolve => {
      this.resolve = resolve;
      this.queue = [];
      for (let i = 0; i < length; i++) {
        const from = oldText[i] || '';
        const to   = newText[i] || '';
        const start  = Math.floor(Math.random() * 20);
        const end    = start + Math.floor(Math.random() * 20);
        this.queue.push({ from, to, start, end, char: '' });
      }
      cancelAnimationFrame(this.frameRequest);
      this.frame = 0;
      this._update();
    });
  }

  _update() {
    let output = '';
    let complete = 0;
    this.queue.forEach((item, i) => {
      const { from, to, start, end } = item;
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!item.char || Math.random() < 0.28) {
          item.char = this._randomChar();
        }
        output += `<span class="scramble-char" aria-hidden="true">${item.char}</span>`;
      } else {
        output += from;
      }
    });

    this.el.innerHTML = output;
    if (complete !== this.queue.length) {
      this.frameRequest = requestAnimationFrame(() => {
        this.frame++;
        this._update();
      });
    } else {
      this.resolve();
    }
  }

  _randomChar() {
    return this.chars[Math.floor(Math.random() * this.chars.length)];
  }
}

/**
 * Auto-initialise all [data-scramble] elements.
 * Scrambles on hover (desktop) or IntersectionObserver (first view).
 */
function initTextScramble() {
  document.querySelectorAll('[data-scramble]').forEach(el => {
    const original = el.dataset.scramble || el.textContent;
    const fx = new TextScramble(el);

    // Scramble on first scroll into view
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          fx.setText(original);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    observer.observe(el);

    // Re-scramble on hover
    el.addEventListener('mouseenter', () => fx.setText(original));
  });
}

/* ═══════════════════════════════════════════════
   PARTICLE BACKGROUND  (Canvas)
═══════════════════════════════════════════════ */

class ParticleBackground {
  /**
   * @param {string} canvasId - ID of <canvas> element
   * @param {Object} config   - customisation options
   */
  constructor(canvasId, config = {}) {
    this.canvas  = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx     = this.canvas.getContext('2d');
    this.cfg = Object.assign({
      count:        80,
      color:        '139, 92, 246',   // RGB, will wrap in rgba()
      minRadius:    1,
      maxRadius:    3,
      minSpeed:     0.1,
      maxSpeed:     0.4,
      connectDist:  140,
      connectOpacity: 0.12,
      mouseInfluence: 120,
    }, config);

    this.particles = [];
    this.mouse = { x: null, y: null };
    this.raf   = null;

    this._resize();
    this._spawn();
    this._bindEvents();
    this._draw();
  }

  _resize() {
    this.canvas.width  = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.W = this.canvas.width;
    this.H = this.canvas.height;
  }

  _spawn() {
    this.particles = [];
    for (let i = 0; i < this.cfg.count; i++) {
      this.particles.push({
        x:  Math.random() * this.W,
        y:  Math.random() * this.H,
        vx: (Math.random() - 0.5) * this.cfg.maxSpeed * 2,
        vy: (Math.random() - 0.5) * this.cfg.maxSpeed * 2,
        r:  this.cfg.minRadius + Math.random() * (this.cfg.maxRadius - this.cfg.minRadius),
        opacity: 0.3 + Math.random() * 0.5,
      });
    }
  }

  _bindEvents() {
    window.addEventListener('resize', () => {
      this._resize();
      this._spawn();
    });
    this.canvas.addEventListener('mousemove', e => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });
    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }

  _draw() {
    const { ctx, W, H, cfg, particles, mouse } = this;
    ctx.clearRect(0, 0, W, H);

    particles.forEach((p, i) => {
      // Mouse repulsion
      if (mouse.x !== null) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < cfg.mouseInfluence) {
          const force = (cfg.mouseInfluence - dist) / cfg.mouseInfluence * 0.8;
          p.vx += (dx / dist) * force * 0.5;
          p.vy += (dy / dist) * force * 0.5;
        }
      }

      // Limit speed
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > cfg.maxSpeed) {
        p.vx = (p.vx / speed) * cfg.maxSpeed;
        p.vy = (p.vy / speed) * cfg.maxSpeed;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${cfg.color}, ${p.opacity})`;
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < cfg.connectDist) {
          const alpha = (1 - d / cfg.connectDist) * cfg.connectOpacity;
          ctx.beginPath();
          ctx.strokeStyle = `rgba(${cfg.color}, ${alpha})`;
          ctx.lineWidth   = 0.8;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.stroke();
        }
      }
    });

    this.raf = requestAnimationFrame(() => this._draw());
  }

  destroy() {
    cancelAnimationFrame(this.raf);
    this.ctx.clearRect(0, 0, this.W, this.H);
  }
}

/* ═══════════════════════════════════════════════
   LOADING / SPLASH SCREEN
═══════════════════════════════════════════════ */

function initLoadingScreen() {
  const loader = document.getElementById('loading-screen');
  if (!loader) return;

  // Progress simulation
  const bar  = loader.querySelector('.loader-bar-fill');
  const pct  = loader.querySelector('.loader-pct');
  let progress = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 5;
    if (progress > 95) { progress = 95; clearInterval(interval); }
    if (bar) bar.style.width = progress + '%';
    if (pct) pct.textContent = Math.floor(progress) + '%';
  }, 120);

  const dismiss = () => {
    clearInterval(interval);
    if (bar)  bar.style.width = '100%';
    if (pct)  pct.textContent = '100%';

    setTimeout(() => {
      loader.style.opacity = '0';
      loader.style.pointerEvents = 'none';
      setTimeout(() => {
        loader.style.display = 'none';
        document.body.style.overflow = '';
      }, 600);
    }, 300);
  };

  // Hide on load
  if (document.readyState === 'complete') {
    setTimeout(dismiss, 500);
  } else {
    window.addEventListener('load', () => setTimeout(dismiss, 400));
    // Fail-safe
    setTimeout(dismiss, 5000);
  }
}

/* ═══════════════════════════════════════════════
   SMOOTH PAGE TRANSITIONS
═══════════════════════════════════════════════ */

function initPageTransitions() {
  const overlay = document.getElementById('page-transition-overlay');
  if (!overlay) return;

  // Fade-in on arrival
  overlay.classList.add('transition-out');
  requestAnimationFrame(() => {
    overlay.style.transition = 'opacity 0.45s ease';
    overlay.style.opacity = '0';
    setTimeout(() => overlay.classList.remove('transition-out'), 500);
  });

  // Fade-out on link click (same-origin)
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto')) return;

    link.addEventListener('click', e => {
      if (e.ctrlKey || e.metaKey || e.shiftKey) return;
      e.preventDefault();

      overlay.style.transition = 'opacity 0.3s ease';
      overlay.style.opacity = '1';
      overlay.classList.add('transition-out');

      setTimeout(() => {
        window.location.href = href;
      }, 320);
    });
  });
}

/* ═══════════════════════════════════════════════
   WORD-BY-WORD TEXT REVEAL
═══════════════════════════════════════════════ */

function initWordReveal() {
  document.querySelectorAll('[data-word-reveal]').forEach(el => {
    const text   = el.textContent;
    const words  = text.split(' ');
    const delay  = parseInt(el.dataset.wordRevealDelay || '0', 10);
    const stagger = parseInt(el.dataset.wordRevealStagger || '60', 10);

    el.innerHTML = words.map((w, i) =>
      `<span class="word-reveal-item" style="transition-delay:${delay + i * stagger}ms">${w}</span>`
    ).join(' ');

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.word-reveal-item').forEach(span => {
            span.classList.add('revealed');
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    observer.observe(el);
  });
}

/* ═══════════════════════════════════════════════
   MAGNETIC BUTTON EFFECT
═══════════════════════════════════════════════ */

function initMagneticButtons() {
  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    const strength = parseFloat(btn.dataset.magnetic || '0.35');

    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) * strength;
      const dy   = (e.clientY - cy) * strength;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transition = 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
      btn.style.transform  = 'translate(0, 0)';
      setTimeout(() => (btn.style.transition = ''), 400);
    });
  });
}

/* ═══════════════════════════════════════════════
   CURSOR GLOW  (optional ambient pointer)
═══════════════════════════════════════════════ */

function initCursorGlow() {
  const glow = document.getElementById('cursor-glow');
  if (!glow) return;

  let mx = window.innerWidth  / 2;
  let my = window.innerHeight / 2;
  let cx = mx;
  let cy = my;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  const render = () => {
    cx += (mx - cx) * 0.08;
    cy += (my - cy) * 0.08;
    glow.style.transform = `translate(${cx - 200}px, ${cy - 200}px)`;
    requestAnimationFrame(render);
  };
  render();

  // Scale up on hoverable elements
  document.querySelectorAll('a, button, [data-hover]').forEach(el => {
    el.addEventListener('mouseenter', () => glow.classList.add('enlarged'));
    el.addEventListener('mouseleave', () => glow.classList.remove('enlarged'));
  });
}

/* ═══════════════════════════════════════════════
   RIPPLE EFFECT on buttons
═══════════════════════════════════════════════ */

function initRipple() {
  document.querySelectorAll('.ripple-btn, .btn-primary, .btn-secondary').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      const size = Math.max(rect.width, rect.height) * 2;

      const ripple = document.createElement('span');
      ripple.className = 'ripple-wave';
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        width:  ${size}px;
        height: ${size}px;
        left:   ${x - size / 2}px;
        top:    ${y - size / 2}px;
        background: rgba(255,255,255,0.25);
        transform: scale(0);
        animation: ripple-anim 0.6s linear;
        pointer-events: none;
      `;

      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });

  // Inject the keyframe if not present
  if (!document.getElementById('ripple-style')) {
    const style = document.createElement('style');
    style.id = 'ripple-style';
    style.textContent = `
      @keyframes ripple-anim {
        to { transform: scale(1); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }
}

/* ═══════════════════════════════════════════════
   FLOATING LABEL  (form inputs)
═══════════════════════════════════════════════ */

function initFloatingLabels() {
  document.querySelectorAll('.floating-label-group').forEach(group => {
    const input = group.querySelector('input, textarea');
    const label = group.querySelector('label');
    if (!input || !label) return;

    const check = () => {
      group.classList.toggle('has-value', !!input.value);
    };

    input.addEventListener('input',  check);
    input.addEventListener('focus',  () => group.classList.add('focused'));
    input.addEventListener('blur',   () => { group.classList.remove('focused'); check(); });

    check(); // initial state
  });
}

/* ═══════════════════════════════════════════════
   NUMBER TICKER  (alternative to main.js counter)
   Uses requestAnimationFrame for silky animation.
═══════════════════════════════════════════════ */

function animateNumber(el, from, to, duration = 2000, suffix = '') {
  const easeFn = Easing.easeOutExpo;
  let start = null;

  const step = ts => {
    if (!start) start = ts;
    const prog = Math.min((ts - start) / duration, 1);
    const val  = from + (to - from) * easeFn(prog);
    const decimals = (String(to).split('.')[1] || '').length;
    el.textContent = val.toFixed(decimals) + suffix;
    if (prog < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ═══════════════════════════════════════════════
   PARALLAX LAYERS  (multi-depth scroll parallax)
═══════════════════════════════════════════════ */

function initParallaxLayers() {
  const layers = [...document.querySelectorAll('[data-parallax]')];
  if (!layers.length) return;

  const onScroll = () => {
    const scrollY = window.scrollY;
    layers.forEach(layer => {
      const speed  = parseFloat(layer.dataset.parallax || '0.3');
      const offset = scrollY * speed;
      layer.style.transform = `translateY(${offset}px)`;
    });
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ═══════════════════════════════════════════════
   STAGGER REVEAL  (children fade in one by one)
═══════════════════════════════════════════════ */

function initStaggerReveal() {
  document.querySelectorAll('[data-stagger-parent]').forEach(parent => {
    const children = [...parent.children];
    const base  = parseInt(parent.dataset.staggerBase || '0', 10);
    const step  = parseInt(parent.dataset.staggerStep || '80', 10);

    children.forEach((child, i) => {
      child.classList.add('stagger-child');
      child.style.transitionDelay = `${base + i * step}ms`;
    });

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          children.forEach(child => child.classList.add('revealed'));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    observer.observe(parent);
  });
}

/* ═══════════════════════════════════════════════
   INIT — Run all animation modules
═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initLoadingScreen();
  initPageTransitions();
  initTextScramble();
  initWordReveal();
  initMagneticButtons();
  initCursorGlow();
  initRipple();
  initFloatingLabels();
  initParallaxLayers();
  initStaggerReveal();

  // Particle background on hero canvas (if present)
  if (document.getElementById('particles-canvas')) {
    window._particleBg = new ParticleBackground('particles-canvas', {
      count: 70,
      color: '99, 57, 255',
      connectDist: 120,
    });
  }

  // Default scroll timeline for common sections
  window._scrollTimeline = new ScrollTimeline([
    {
      selector: '.hero-badge',
      from: { opacity: 0, y: -20 },
      to:   { opacity: 1, y: 0 },
      options: { duration: 600, delay: 200, ease: 'easeOutCubic' },
    },
    {
      selector: '.hero-headline',
      from: { opacity: 0, y: 30 },
      to:   { opacity: 1, y: 0 },
      options: { duration: 700, delay: 350, ease: 'easeOutCubic' },
    },
    {
      selector: '.hero-sub',
      from: { opacity: 0, y: 20 },
      to:   { opacity: 1, y: 0 },
      options: { duration: 600, delay: 550, ease: 'easeOutCubic' },
    },
    {
      selector: '.hero-cta-group',
      from: { opacity: 0, y: 20 },
      to:   { opacity: 1, y: 0 },
      options: { duration: 600, delay: 700, ease: 'easeOutCubic' },
    },
    {
      selector: '.section-heading',
      from: { opacity: 0, y: 24 },
      to:   { opacity: 1, y: 0 },
      options: { duration: 600, ease: 'easeOutCubic' },
    },
    {
      selector: '.feature-card',
      from: { opacity: 0, y: 40 },
      to:   { opacity: 1, y: 0 },
      options: { duration: 700, ease: 'easeOutCubic' },
    },
  ]);

  console.log('%c Scenario AI Platform — Animations loaded ✓', 'color:#00d4ff;font-weight:bold;font-size:13px;');
});

/* ═══════════════════════════════════════════════
   EXPORTS
═══════════════════════════════════════════════ */

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    tween,
    Easing,
    ScrollTimeline,
    TextScramble,
    ParticleBackground,
    animateNumber,
  };
}
