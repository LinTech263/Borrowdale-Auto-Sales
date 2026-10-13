# Borrowdale Auto Sales – Web Platform & Dealer Portal

The premier digital address and dealership portal for **Borrowdale Auto Sales (Pvt) Ltd**, located along Borrowdale Road (opposite Sam Levy's Village), Harare, Zimbabwe.

---

## 💎 Brand & Architecture Overview

* **Aesthetic**: Tough, precise, quietly wealthy. Brushed steel, obsidian darkness, and Zimbabwean brass/green/orange brand accents.
* **Colors**: Obsidian (`#0A0A0B`), Graphite (`#16181B`), Gunmetal (`#23272C`), Steel (`#9AA0A8`), Ivory (`#F5F2EB`), Brass (`#C6A15B`), Zimbabwe Racing Green (`#0E7A33`), Ember (`#EA580C`).
* **Mobile & WhatsApp First**: Direct click-to-WhatsApp links (`wa.me`) with prefilled vehicles and offer context; click-to-call integrations for Zimbabwean phone formats (`+263`).
* **Strict Privacy & Cost Protection**: Cost price, markup percentage, margin calculations, and private VIN chassis numbers are physically partitioned and never delivered in any public response or payload.
* **Fact Authenticity**: No invented awards, fake customer reviews, or synthetic business history. All contact items (`[PHONE]`, `[WHATSAPP]`, `[EMAIL]`, `[ADDRESS]`, `[HOURS]`) and reviews are strictly admin-managed.

---

## 🚀 Features & Modules

### 1. Public Website
* **Home Page**: 16 conversion sections in strict order:
  1. Dark cinematic hero with inline vehicle search (Condition, Make, Body, Budget)
  2. Trust bar (4 proof points)
  3. Featured stock cards
  4. Browse by body type (live vehicle counts)
  5. Shop by budget bands
  6. Recently added arrivals
  7. Why Borrowdale Auto Sales (4 pillars)
  8. How buying works (4 steps)
  9. Make an Offer explainer
  10. Trade-in valuation CTA band
  11. Recently Sold turnover showcase
  12. Real client reviews (hidden when empty)
  13. Buying guides teaser
  14. Interactive FAQ accordion with `FAQPage` JSON-LD schema
  15. Location map & Borrowdale showroom directions
  16. Final appointment CTA band
* **Inventory (`/inventory`)**: Left drawer filters, zero-count filtering suppression, budget chips, URL query sync, and vehicle sourcing fallback form.
* **Vehicle Detail (`/vehicle/[slug]`)**: Full gallery lightbox, key specs grid, grouped features checklist, inline quick offer form, illustrative finance estimator, printable PDF spec sheet, similar vehicles, and `Car` + `Offer` schema.
* **Sell Your Car (`/sell-your-car`)**: Vehicle valuation & trade-in submission form.
* **Finance (`/finance`)**: 3-step bank facility guidance & loan repayment calculator.
* **About (`/about`) & Contact (`/contact`)**: Showroom directions, hours, callback booking.
* **Guides Engine (`/guides`, `/guides/[slug]`)**: 4 in-depth articles on used car inspections, SUV vs double cabs, trade-ins, and ZIMRA paperwork checklists.
* **Compare (`/compare`)**: Side-by-side spec comparison table for up to 3 cars.
* **Favourites (`/favourites`)**: Saved shortlist stored in persistent localStorage.
* **Local SEO Landing Pages**: `/used-cars-borrowdale-harare`, `/luxury-cars-for-sale-harare`, `/suvs-for-sale-harare`, `/double-cabs-for-sale-zimbabwe`, `/mercedes-benz-for-sale-zimbabwe`.

### 2. Dealer Admin Portal (`/admin`)
* **Role-Based Access**:
  * **Dealership Principal / Owner**: Full access to wholesale cost prices, profit margins, pricing panel, and site brand settings.
  * **Sales Staff**: Access to vehicles, leads CRM, and viewing schedules (private costs strictly hidden).
* **Private Pricing Engine**: Calculates selling price based on cost + percentage or fixed markup with rounding rules (nearest $50, $100, $500) and price history audit log.
* **Leads CRM**: 6-stage Kanban pipeline (`New` > `Contacted` > `Negotiating` > `Viewing Booked` > `Won` > `Lost`), asking-vs-offer difference calculation, counter-offer tracking, 1-click WhatsApp reply templates, and CSV export.
* **Content & Settings**: Live editing of hero copy A/B tests, Zimbabwe contact details, optional secondary ZiG exchange rate toggle, brand colors, and analytics tags.

---

## 🛠 Local Development & Setup

### Prerequisites
* Node.js 18+ or 20+

### Installation
```bash
# Clone repository
git clone <repo-url>
cd borrowdale-auto-sales

# Install dependencies
npm install

# Start local development server
npm run dev
```

Visit `http://localhost:3000` in your browser.
To access the admin portal, navigate to `http://localhost:3000/admin/login` and choose **Owner** or **Sales Staff**.

---

## 🚢 Deployment Guide

### Option 1: Vercel
1. Push code to your GitHub / GitLab repository.
2. In Vercel, click **Add New Project** and select this repository.
3. Framework Preset: **Vite**.
4. Build Command: `npm run build`.
5. Output Directory: `dist`.
6. Add Environment Variable:
   * `VITE_GEMINI_API_KEY`: (Optional) for AI-assisted listing copywriting.

### Option 2: Netlify
1. Create a `_redirects` file in `public/`:
   ```
   /*    /index.html   200
   ```
2. Build command: `npm run build`.
3. Publish directory: `dist`.

### Option 3: Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Set public directory to "dist"
# Configure as a single-page app: Yes
npm run build
firebase deploy --only hosting
```
