# Scenario AI — Website Replica

A pixel-perfect, fully-functional replica of the Scenario.com AI game asset generation platform website. Built with pure HTML5, CSS3, and vanilla JavaScript — no frameworks, no dependencies, fully deployable on GitHub Pages for free.

## 🚀 Live Demo
**GitHub Pages:** `https://<your-username>.github.io/scenario-replica`

## 📁 Project Structure

```
scenario-replica/
├── index.html              # Homepage — hero, features, pricing preview, CTA
├── pages/
│   ├── platform.html       # Full platform features (Image, Video, 3D, Audio, Training)
│   ├── models.html         # Model library browser (Foundation, Community, Custom)
│   ├── pricing.html        # Pricing plans & feature comparison table
│   ├── enterprise.html     # Enterprise solutions & contact form
│   ├── resources.html      # Blog, docs, community, changelog, tutorials
│   ├── login.html          # Sign-in page (split-screen layout)
│   └── signup.html         # Multi-step registration with plan selection
├── css/
│   ├── main.css            # Core design system, components, layout
│   ├── animations.css      # All keyframe animations & scroll reveals
│   └── responsive.css      # Mobile-first responsive breakpoints
├── js/
│   ├── main.js             # Core interactivity (tabs, pricing toggle, counters)
│   ├── navigation.js       # Mega menus, mobile drawer, command palette
│   └── animations.js       # Scroll animations, parallax, canvas particle BG
├── assets/
│   └── icons/
│       └── favicon.svg     # Vector favicon
└── README.md
```

## ✨ Features Implemented

### Design
- 🎨 Dark-mode-first design with purple/blue gradient accent system
- 💎 Glassmorphism cards with backdrop-filter blur
- 🌈 Animated gradient mesh hero background (Canvas API)
- ✨ Gradient text headings and animated gradient borders
- 📱 Fully responsive across all screen sizes (320px → 1536px)

### Navigation
- 🔝 Sticky header with scroll-triggered glassmorphism effect
- 📋 Multi-column mega dropdown menus (Platform, Models, Industries, Resources)
- 📱 Mobile hamburger drawer with smooth slide animation
- ⌨️ **Command Palette (⌘K / Ctrl+K)** — searchable overlay with keyboard navigation
- 🔗 All internal page links fully wired up

### Homepage Sections
- Hero with animated typewriter effect and floating UI preview
- Company logo trust bar (infinite scroll animation)
- Feature tabs (Images / Video / 3D / Audio / Training) with panel switching
- AI Apps grid (12 use-case cards)
- Scenario Genie AI assistant showcase
- Developer API section with syntax-highlighted code block
- Testimonials carousel
- Pricing preview with monthly/annual billing toggle
- Final CTA with gradient background

### Pages
| Page | Highlights |
|------|-----------|
| **Platform** | Detailed sections for every feature, step-by-step training flow, 12-app grid |
| **Models** | Filterable model library, Foundation/Community/Custom tabs |
| **Pricing** | Full comparison table (20+ features × 5 plans), FAQ accordion |
| **Enterprise** | Industry solutions, security compliance, contact form |
| **Resources** | Blog grid, docs quickstart, changelog timeline, tutorial cards |
| **Login** | Split-screen, social auth buttons, form validation |
| **Signup** | 3-step wizard, role selection, plan picker, confetti success |

### JavaScript Features
- Scroll-triggered animations (IntersectionObserver)
- Animated stat counters (e.g., "500M+" counts up)
- Monthly/Annual pricing toggle (updates all prices)
- Feature tab switching with smooth transitions
- FAQ accordion expand/collapse
- 3D card tilt effect on hover
- Toast notification system
- Multi-step form with progress bar
- Password strength meter
- Canvas particle background
- Typewriter rotating text effect
- Lazy image loading
- Copy-to-clipboard for code blocks

## 🛠 Technology Stack

| Layer | Tech | Why |
|-------|------|-----|
| Markup | HTML5 | Semantic, accessible structure |
| Styles | CSS3 | Variables, Grid, Flexbox, animations, backdrop-filter |
| Scripts | Vanilla JS (ES6+) | Zero dependencies, fast load |
| Fonts | Google Fonts (Inter) | Same font used by Scenario |
| Deployment | GitHub Pages | 100% free, custom domain support |

## 🚀 Deployment

### Option 1: GitHub Pages (Free — Recommended)
1. Push this repo to GitHub
2. Go to **Settings → Pages**
3. Set Source: **Deploy from branch → main → / (root)**
4. Your site is live at `https://<username>.github.io/scenario-replica`

### Option 2: Netlify (Free)
1. Drag the `scenario-replica/` folder into [netlify.com/drop](https://app.netlify.com/drop)
2. Get an instant `*.netlify.app` URL — no account needed

### Option 3: Vercel (Free)
```bash
npm i -g vercel
vercel --prod
```

### Option 4: Cloudflare Pages (Free)
1. Connect GitHub repo at [pages.cloudflare.com](https://pages.cloudflare.com)
2. Build command: (none — static site)
3. Output directory: `/` (root)

## 💻 Local Development
```bash
# Clone the repo
git clone https://github.com/<username>/scenario-replica.git
cd scenario-replica

# Open with any static server
npx serve .              # Node.js
python3 -m http.server   # Python
php -S localhost:8080     # PHP
```
Or simply open `index.html` directly in your browser.

## 📜 License
This is an educational/portfolio replica project. All design inspiration is attributed to Scenario AI (scenario.com). No proprietary code, assets, or backend functionality has been copied.

---
Built with ❤️ using pure HTML, CSS & JavaScript.
