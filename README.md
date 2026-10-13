# NOIR — Specialty Coffee Roasters

> An independent luxury specialty coffee roastery web experience built with intentional restraint and anti-slop craft.

[![Live Repository](https://img.shields.io/badge/GitHub-noir--coffee-c67d5a?style=flat-square&logo=github)](https://github.com/azanabdullah2752012-ui/noir-coffee)
[![Design Standards](https://img.shields.io/badge/Design-Anti--Slop_Pols.dev-120306?style=flat-square)](file:///Users/azanabdullah/Documents/antigravity/busy-nobel/css/noir.css)

---

## ☕ Overview

**NOIR** is a direct-to-consumer digital flagship store for an artisanal coffee roastery operating out of Rotterdam and Tokyo. The project showcases three debut single-origin / signature house roasts alongside a collector's discovery set, paired with tactile digital e-commerce mechanics.

### The Collection
* **01 — The Original**: Signature House Blend (Yirgacheffe & Antigua). Smooth dark chocolate, toasted hazelnut, and dried fig.
* **02 — After Hours**: Nocturnal Roast (Gayo Mountain & Huila). Low-acidity evening roast with molten caramel, Dutch cocoa, and bourbon oak.
* **03 — First Light**: Luminous Light Roast (Sidama Bensa & Nyeri). High-altitude clarity with bergamot citrus, wild jasmine, and white peach.
* **The Edition 01 Trio**: Curated discovery gift box featuring all 3 coffees in full 250g spun copper canisters + hand-hammered 15g solid copper measuring scoop + letterpress tasting dossier ($58).

---

## ✨ Features & Architecture

* **Multi-Page Product Architecture**:
  * `index.html`: Continuous vertical landing experience with interactive roast matcher and quick-add trays.
  * `original.html`: Dedicated PDP with harvest terroir specs, sensory balance meters, and interactive 4-method brew calculator (Espresso, V60, French Press, AeroPress).
  * `after-hours.html`: Dedicated PDP for Roast 02 with extraction ratios for Moka pot, French press, and espresso.
  * `first-light.html`: Dedicated PDP for Roast 03 with light-roast pour-over dial-in guidelines.
  * `trio.html`: Unboxing gift experience with dual gallery view, unboxing journey breakdown, and complimentary handwritten note card customization.
  * `story.html`: Brand craft editorial exploring Loring S35 convection air-roasting science, reusable spun copper canisters, and tasting room spaces.
* **Persistent Cart & Checkout Engine (`js/noir.js`)**:
  * Cross-page bag persistence powered by `localStorage`.
  * Dynamic Free Courier progress meter ($50 threshold).
  * Two-step courier checkout modal with express Apple Pay simulation and printable digital **Dispatch Docket**.
* **Ergonomic Mobile Navigation**:
  * Persistent masthead Bag access on small viewports.
  * Full-featured mobile directory drawer (`#mobileNavDrawer`) for seamless cross-page jumping on mobile phones and tablets.

---

## 🎨 Design System (`css/noir.css`)

Strict adherence to the **pols.dev Anti-Slop Design Guidelines**:
* **Atmospheric Palette**: Deep obsidian burgundy (`#120306`), elevated charcoal (`#1a060a`), and hand-spun copper accents (`#c67d5a`, `#df9774`).
* **Micrograin Substrate**: Subtle inline SVG fractal turbulence overlay providing analog paper texture.
* **Typography**: Paired serif display (*Sentient*) with clean, legible sans (*Switzer*).
* **Restraint**: Zero generic blue-purple gradients, zero floating pastel blobs, zero hover jump boops (`translateY` banned), and WCAG AAA contrast compliance.

---

## 🚀 Running Locally

No frameworks or build steps required. Serve with any static web server:

```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx serve .
```

Open `http://localhost:8000` in your browser.

---

## 📜 License

© 2026 NOIR Specialty Roasters BV. All rights reserved.
