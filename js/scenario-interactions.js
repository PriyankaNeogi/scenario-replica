/**
 * SCENARIO AI — EXACT REPLICA CLIENT INTERACTION ENGINE
 * Powers smooth scrolling, carousel sliders, tab switchers,
 * pricing toggles, and mobile navigation.
 */

document.addEventListener("DOMContentLoaded", () => {
  // ── 1. Smooth Scrolling for Anchor Links ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const targetId = this.getAttribute("href").slice(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    });
  });

  // ── 2. Testimonial Carousel (Homepage) ──
  const activeQuoteContainer = document.querySelector("#customers blockquote")?.parentElement;
  const measurementCards = document.querySelectorAll('[data-testid="testimonial-measurement-card"]');
  const dotButtons = document.querySelectorAll('[aria-label^="Go to testimonial"]');
  const prevBtn = document.querySelector('[aria-label="Previous testimonial"]');
  const nextBtn = document.querySelector('[aria-label="Next testimonial"]');

  if (activeQuoteContainer && measurementCards.length > 0) {
    let currentIndex = 0;

    function renderTestimonial(idx) {
      currentIndex = (idx + measurementCards.length) % measurementCards.length;
      
      // Smooth fade transition
      activeQuoteContainer.style.opacity = "0";
      activeQuoteContainer.style.transition = "opacity 0.2s ease-in-out";
      
      setTimeout(() => {
        activeQuoteContainer.innerHTML = measurementCards[currentIndex].innerHTML;
        activeQuoteContainer.style.opacity = "1";
      }, 200);

      // Update dot styles
      dotButtons.forEach((dot, i) => {
        if (i === currentIndex) {
          dot.className = "h-2 w-2 rounded-full transition-all duration-300 bg-ember w-6";
          dot.setAttribute("aria-current", "true");
        } else {
          dot.className = "h-2 w-2 rounded-full transition-all duration-300 bg-muted-foreground/30 hover:bg-muted-foreground/50";
          dot.removeAttribute("aria-current");
        }
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener("click", (e) => {
        e.preventDefault();
        renderTestimonial(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener("click", (e) => {
        e.preventDefault();
        renderTestimonial(currentIndex + 1);
      });
    }

    dotButtons.forEach((dot, idx) => {
      dot.addEventListener("click", (e) => {
        e.preventDefault();
        renderTestimonial(idx);
      });
    });
  }

  // ── 3. Platform Workflow Surface Tabs (Homepage) ──
  const platformSection = document.getElementById("platform");
  if (platformSection) {
    const mainTabs = Array.from(platformSection.querySelectorAll("button")).filter(b => 
      ["Creative App", "Nodes", "Agents", "MCP & API", "Integrations"].includes(b.textContent.trim())
    );

    mainTabs.forEach(tab => {
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        mainTabs.forEach(t => {
          t.className = "focus-visible:outline-ember-ink shrink-0 cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 text-muted-foreground hover:text-foreground max-sm:bg-card max-sm:ring-1 max-sm:ring-border/40";
        });
        tab.className = "focus-visible:outline-ember-ink shrink-0 cursor-pointer rounded-full px-5 py-2.5 text-sm font-medium whitespace-nowrap transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 bg-[oklch(0.14_0.008_60)] text-white";
      });
    });

    const subTabs = Array.from(platformSection.querySelectorAll("button")).filter(b => 
      ["Image", "Video", "3D", "Audio"].includes(b.textContent.trim())
    );

    subTabs.forEach(tab => {
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        subTabs.forEach(t => {
          t.className = "relative flex h-11 w-full cursor-pointer items-center gap-3 overflow-hidden rounded-xl px-3.5 text-left text-[15px] font-medium ring-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white bg-white/[0.035] text-white/70 ring-white/10 hover:bg-white/[0.08] hover:text-white";
        });
        tab.className = "relative flex h-11 w-full cursor-pointer items-center gap-3 overflow-hidden rounded-xl px-3.5 text-left text-[15px] font-medium ring-1 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white bg-white/[0.09] text-white ring-white/20";
      });
    });
  }

  // ── 4. Pricing Billing Switcher (Pricing Page) ──
  const monthlyBtn = Array.from(document.querySelectorAll("button")).find(b => b.textContent.trim() === "Monthly");
  const annualBtn = Array.from(document.querySelectorAll("button")).find(b => b.textContent.trim().startsWith("Annual"));

  if (monthlyBtn && annualBtn) {
    const priceElements = Array.from(document.querySelectorAll("div, span, p")).filter(el => {
      const text = el.textContent.trim();
      return (text === "$15" || text === "$45" || text === "$75" || text === "$10" || text === "$30" || text === "$50") && el.children.length === 0;
    });

    monthlyBtn.addEventListener("click", () => {
      monthlyBtn.className = "rounded-full px-5 py-2 text-sm font-medium transition-colors bg-primary text-primary-foreground";
      annualBtn.className = "rounded-full px-5 py-2 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground";
      if (priceElements.length >= 3) {
        priceElements[0].textContent = "$15";
        priceElements[1].textContent = "$45";
        priceElements[2].textContent = "$75";
      }
    });

    annualBtn.addEventListener("click", () => {
      annualBtn.className = "rounded-full px-5 py-2 text-sm font-medium transition-colors bg-primary text-primary-foreground";
      monthlyBtn.className = "rounded-full px-5 py-2 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground";
      if (priceElements.length >= 3) {
        priceElements[0].textContent = "$10";
        priceElements[1].textContent = "$30";
        priceElements[2].textContent = "$50";
      }
    });
  }

  // ── 5. Mobile Menu Toggle ──
  const toggleBtn = document.querySelector('button[aria-label="Toggle menu"]');
  const header = document.querySelector("header");

  if (toggleBtn && header) {
    let mobileDrawer = document.getElementById("replica-mobile-drawer");
    if (!mobileDrawer) {
      mobileDrawer = document.createElement("div");
      mobileDrawer.id = "replica-mobile-drawer";
      mobileDrawer.className = "lg:hidden border-b border-border/40 bg-background/95 backdrop-blur-xl px-6 py-6 transition-all duration-300";
      mobileDrawer.style.display = "none";
      
      const isSub = window.location.pathname.includes("/pages/");
      const p = isSub ? "" : "pages/";
      const root = isSub ? "../index.html" : "index.html";

      mobileDrawer.innerHTML = `
        <div class="flex flex-col gap-4 text-base font-medium">
          <a href="${root}#platform" class="text-foreground hover:text-ember transition-colors py-1">Platform</a>
          <a href="${root}#models" class="text-foreground hover:text-ember transition-colors py-1">Models</a>
          <a href="${p}industries.html" class="text-foreground hover:text-ember transition-colors py-1">Industries</a>
          <a href="${root}#customers" class="text-foreground hover:text-ember transition-colors py-1">Customers</a>
          <a href="${p}enterprise.html" class="text-foreground hover:text-ember transition-colors py-1">Enterprise</a>
          <a href="${root}#pricing" class="text-foreground hover:text-ember transition-colors py-1">Pricing</a>
          <hr class="border-border/30 my-2" />
          <div class="flex items-center gap-3">
            <a href="https://app.scenario.com/login" class="text-sm font-medium text-muted-foreground hover:text-foreground">Sign In</a>
            <a href="https://app.scenario.com" class="rounded-full bg-foreground text-background px-4 py-2 text-sm font-medium">Get Started</a>
          </div>
        </div>
      `;
      header.parentNode.insertBefore(mobileDrawer, header.nextSibling);
    }

    toggleBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = mobileDrawer.style.display !== "none";
      mobileDrawer.style.display = isOpen ? "none" : "block";
    });
  }

  // ── 6. Auto-start background videos ──
  document.querySelectorAll("video").forEach(v => {
    v.muted = true;
    v.setAttribute("playsinline", "");
    v.setAttribute("loop", "");
    v.play().catch(() => {});
  });
});
