# Agrovia Landing Page — Design System & Architecture Specification (`design.md`)

> **Single Source of Truth** for the visual identity, design tokens, color palette, typography, micro-animations, component hierarchy, and responsive layout standards for the Agrovia ecosystem and landing page.

---

## 1. Design Philosophy & Aesthetic Vision

The Agrovia visual identity combines **high-end modern SaaS minimalism** with **earthy agricultural luxury**. Rather than generic harsh greens or dated portals, Agrovia employs:
- **Pristine Warm Canvas**: Soft ivory / warm alabaster surfaces (`#FCFCFA` / `#F4F4F2`) that eliminate eye strain.
- **Deep Botanical Contrast**: Rich dark forest tones (`#0B2D1B` & `#06180E`) providing crisp readability and editorial authority.
- **High-Energy Neon Lime Accent**: Vibrant electric lime (`#C8F52F` / `#B8E624`) used sparingly for interactive focus, badges, and primary action highlights.
- **Soft Faded Green Accents**: Gentle mint and sage washes (`#E8F5E9` / `#ECFDF5` / `#F0FDF4`) for status pills, capacity progress indicators, and card highlights.
- **Fluid Micro-Animations**: Smooth marquee rails, floating bobbing badges, soft scale pulses, and Lenis inertia scrolling.

---

## 2. Core Design Tokens & CSS Variables

### 2.1 Color Palette

```css
@theme {
  /* Typography & Core Surfaces */
  --color-agri-dark: #0B2D1B;          /* Primary dark headings & text */
  --color-agri-darker: #06180E;        /* Deepest obsidian forest background */
  --color-agri-warm: #FCFCFA;          /* Primary warm canvas background */
  --color-agri-surface: #F4F4F2;       /* Secondary neutral surface & pill backdrops */
  --color-agri-gray: #5A6C5F;          /* Neutral body copy & subtitles */
  --color-agri-gray-dark: #23382B;     /* High-contrast secondary text */

  /* Electric & Faded Accents */
  --color-agri-lime: #C8F52F;          /* Electric lime primary CTA & badge highlight */
  --color-agri-lime-hover: #B8E624;    /* Active button hover */
  --color-agri-fade-green: #ECFDF5;   /* Soft sage background tint */
  --color-agri-emerald: #10B981;       /* Operational active/verified status */
  --color-agri-emerald-dark: #059669;  /* Verified text & icons */

  /* Structural Borders & Shadows */
  --border-light: #E8EAEC;             /* Standard 1px card boundary */
  --border-subtle: #E2E5E9;            /* Input & nested card boundary */
}
```

### 2.2 Color Mapping Reference

| Token Name | Hex Code | Purpose | Usage Example |
| :--- | :--- | :--- | :--- |
| **Canvas Warm** | `#FCFCFA` | Page background | Primary canvas backdrop |
| **Dark Forest** | `#0B2D1B` | Typography / Primary CTAs | Heading-1, Dark pill buttons |
| **Electric Lime** | `#C8F52F` | High-impact accent | Primary icon highlights, active badges |
| **Soft Sage** | `#ECFDF5` | Status pill background | Gate Verified & Open badges |
| **Emerald Green** | `#059669` | Success / Positive delta | `+14% vs MSP`, Verified checkmarks |
| **Subtle Gray** | `#5A6C5F` | Secondary copy | Metric labels, subheaders |
| **Card Border** | `#E8EAEC` | Component elevation | Rounded card boundaries |

---

## 3. Typography System

The typography pairs an **ultra-clean grotesque sans-serif** with an **editorial italic serif** for storytelling accents.

### 3.1 Font Families
- **Primary Sans**: `var(--font-sans), ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
  - *Weights*: `400` (Regular), `500` (Medium), `600` (SemiBold), `700` (Bold)
- **Editorial Serif (Accent)**: `var(--font-serif), "Instrument Serif", "Newsreader", Georgia, serif`
  - *Class*: `.font-editorial` (`font-style: italic`)

### 3.2 Type Hierarchy

```text
Display-1    48px - 64px   Leading: 1.08   Weight: Bold / Editorial Italic
Heading-1    32px - 40px   Leading: 1.15   Weight: Bold
Heading-2    24px - 28px   Leading: 1.25   Weight: SemiBold / Bold
Heading-3    18px - 20px   Leading: 1.35   Weight: SemiBold
Body Large   15px - 16px   Leading: 1.60   Weight: Regular / Medium
Body Small   13px - 14px   Leading: 1.50   Weight: Regular / Medium
Caption      11px - 12px   Leading: 1.40   Weight: SemiBold / Bold (Uppercase)
```

---

## 4. Component Structure & Hierarchy

```text
Landing Page Layout:
├── 1. Navbar (Sticky floating pill with backdrop blur)
├── 2. Hero Section (Headline, editorial italics, dual CTA, floating KPI badges)
├── 3. Trust Marquee (Animated partner & APMC Mandi scroll)
├── 4. Platform Intro (High-level value proposition with icon grid)
├── 5. Solutions Accordion (Interactive capability breakdown for Farmers & Mandis)
├── 6. Smart Solutions Carousel (Visual showcases of slot booking, token scanner, weighbridge sync)
├── 7. Statistics & Impact Grid (Key operational KPIs: quintals moved, time saved, payout turnaround)
├── 8. Testimonials (Farmer & APMC operator verified quotes)
├── 9. FAQ Section (Accordion FAQ covering slot booking, e-slips, KYC)
└── 10. Footer (Navigation columns, statutory compliance, copyright)
```

---

## 5. Animation & Interaction Specifications

### 5.1 CSS Keyframes
- **Marquee Reel (`animate-marquee`)**:
  - `animation: marquee 24s linear infinite;`
  - Pauses smoothly on `:hover`.
- **Bobbing Badge (`animate-bobbing`)**:
  - `animation: bobbing 2s ease-in-out infinite;` (`translateY(0px)` $\rightarrow$ `translateY(4px)`).
- **Soft Pulse (`animate-pulse-soft`)**:
  - `animation: pulseSoft 2s ease-in-out infinite;` (`scale(1)` $\rightarrow$ `scale(1.15)` with opacity fade).

### 5.2 Inertia Smooth Scrolling
- Powered by **Lenis** with `scroll-behavior: auto !important` on `html.lenis` and containment preventing iframe jitter.

---

## 6. Responsive Breakpoints

| Breakpoint | Prefix | Container Width | Target Devices |
| :--- | :--- | :--- | :--- |
| **Mobile** | Default | `100%` (px-4) | iPhone / Android phones (< 640px) |
| **Tablet** | `sm:` / `md:` | `max-w-3xl` | iPads / Tablets (640px – 1024px) |
| **Desktop** | `lg:` | `max-w-6xl` | Laptops / Desktops (1024px – 1440px) |
| **Widescreen** | `xl:` / `2xl:` | `max-w-7xl` | Large monitors (1440px+) |

---

## 7. Quality Checklist & Rules
- **No Harsh Generic Colors**: Always use tailored HSL / Hex values defined in the token table.
- **Consistent Radii**: Outer cards use `rounded-[26px]` to `rounded-[32px]`; inner buttons use `rounded-full` or `rounded-xl`.
- **Accessible Contrast**: Headings use `#0B2D1B` on `#FCFCFA` ($\text{CR} > 12:1$ AAA rating).
- **Zero Heavy Render Cost**: Pure functional React components with `memo` and targeted selectors.
