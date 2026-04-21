# Silkadelics — Design System

> Luxury nightlife/events brand. Dark backgrounds, neon accents, premium typography, smooth animations.
> Any frontend feature must adhere to all rules in this document.

---

## 1. Brand Identity

| Property | Value |
|----------|-------|
| Brand name | Silkadelics |
| Logo | `public/assets/images/logo.png` (standard) · `logo-4k.png` (high-res) |
| Logo size | `h-16 w-auto` |
| Logo glow | `drop-shadow-[0_0_8px_rgba(255,45,149,0.5)]` |
| Tone | Luxury · Premium · High-energy nightlife · Modern & sleek |

---

## 2. Color Palette

### CSS Custom Properties (`src/styles.css`)

```css
--color-primary:          #ff2d95   /* Neon pink — CTAs, highlights, hover states */
--color-secondary:        #00f3ff   /* Cyan neon — accents, secondary CTAs */
--color-accent:           #ff8d33   /* Orange — tertiary accent */
--color-purple-neon:      #9d00ff   /* Purple neon — gradient midpoint */
--color-luxury-black:     #05010d   /* Page background */
--color-luxury-charcoal:  #120422   /* Section backgrounds */
--color-luxury-white:     #f5f5f5   /* Body text */
```

### Usage Rules

| Context | Value |
|---------|-------|
| Page background | `bg-luxury-black` (#05010d) |
| Section background | `bg-luxury-charcoal` (#120422) |
| Body text | `text-luxury-white` / `text-gray-300` |
| Primary action / hover | `text-primary` / `bg-primary` (#ff2d95) |
| Borders (default) | `border-white/5` → `border-white/10` |
| Borders (hover) | `border-white/20` |
| Borders (active/focus) | `border-primary/30` |
| Glass overlay | `rgba(13, 2, 33, 0.7)` with `backdrop-blur` |

### Gradients

```
Gold gradient:  primary → secondary → primary  (135deg)
Silk gradient:  primary → purple-neon → secondary  (135deg)
```

Utility classes: `.text-gold-gradient`, `.bg-gold-gradient`, `.text-silk-gradient`, `.bg-silk-gradient`

---

## 3. Typography

### Font Families

| Family | Source | Weights | Usage |
|--------|--------|---------|-------|
| **Playfair Display** (serif) | `@fontsource/playfair-display` | 400, 700, 400-italic | All headings (h1–h6), large display text |
| **Montserrat** (sans-serif) | `@fontsource/montserrat` | 300, 400, 500, 700 | Body text, labels, nav, buttons |

CSS vars: `--font-serif`, `--font-sans`

### Heading Scale

| Tag | Classes |
|-----|---------|
| h1 (hero) | `text-5xl md:text-8xl font-serif font-bold` |
| h2 (section) | `text-4xl md:text-5xl font-serif font-bold` |
| h3 (sub-section) | `text-2xl md:text-4xl font-serif font-bold` |
| h4 (card/component) | `text-xl md:text-2xl font-serif font-bold` |
| Label / eyebrow | `text-xs font-sans font-bold uppercase tracking-[0.2em]` |

### Text Scale

`xs` 12px · `sm` 14px · `base` 16px · `lg` 18px · `xl` 20px · `2xl` 24px · `3xl` 30px · `4xl` 36px · `5xl` 48px · `6xl` 60px · `7xl` 72px · `8xl` 96px

---

## 4. Spacing & Layout

### Container Widths

| Class | Width | Usage |
|-------|-------|-------|
| `max-w-5xl` | 64rem | Forms, narrow content |
| `max-w-7xl` | 80rem | Primary content sections |
| `max-w-screen-2xl` | 96rem | Full-width band grid |

### Section Padding

```
Vertical:    py-28  (standard)
             pt-32 pb-28  (asymmetrical when needed)
Horizontal:  px-4 sm:px-6 lg:px-8
```

### Breakpoints (mobile-first)

| Prefix | Min-width | Notes |
|--------|-----------|-------|
| *(default)* | 0 | Mobile — single column |
| `sm:` | 640px | Wider padding |
| `md:` | 768px | Desktop nav visible, 2-col grids |
| `lg:` | 1024px | Full layouts, 3–6 col grids |

### Grid Patterns

```
Two-column:   grid-cols-1 md:grid-cols-2 gap-8
Three-column: grid-cols-1 md:grid-cols-3 gap-8
Members:      grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8
About split:  grid-cols-1 lg:grid-cols-2 gap-20 items-center
```

---

## 5. Components

### Navigation

```
Position:    fixed top-0 left-0 z-50
Height:      h-24
Effect:      glass + transition-all duration-500
Desktop nav: hidden md:flex space-x-10
Links:       text-xs font-bold tracking-widest uppercase
CTA button:  px-8 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-primary
Mobile menu: full-screen overlay with flex-col items
```

### Buttons

| Variant | Classes |
|---------|---------|
| Primary | `px-12 py-5 bg-primary text-white rounded-xl font-bold text-xs tracking-[0.3em] uppercase shadow-[0_0_20px_rgba(255,45,149,0.5)] hover:opacity-90 transition-all duration-300` |
| Secondary | `px-12 py-5 border border-secondary text-secondary rounded-xl font-bold text-xs tracking-[0.3em] uppercase hover:bg-secondary hover:text-black transition-all duration-300` |
| Ghost | `px-8 py-3 border border-white/10 rounded-xl font-bold text-xs tracking-widest uppercase hover:bg-white/10 transition-all duration-300` |

All buttons: `font-sans font-bold uppercase tracking-[0.2em]`

### Cards (Event / Pack)

```
Container:  p-12 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-sm
            group cursor-pointer transition-all duration-300
Hover:      border-primary/30 bg-white/10
Icon box:   w-16 h-16 rounded-2xl  (bg changes on hover)
Title:      text-xl font-serif font-bold
Body:       text-sm text-gray-400
Hidden CTA: opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0
```

### Band Member Cards

```
Container: rounded-3xl bg-luxury-black border border-white/5 overflow-hidden
Image:     aspect-[3/4] object-cover grayscale group-hover:grayscale-0 group-hover:scale-110
Overlay:   bg-gradient-to-t from-black via-black/20 to-transparent
Social:    w-10 h-10 rounded-full bg-primary/20 border border-primary/30
Name:      font-serif font-bold text-center group-hover:text-primary
Role:      text-xs font-sans uppercase tracking-widest text-gray-400
```

### Form Elements

```
Input/Select:  w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5
               text-luxury-white placeholder-gray-500
               focus:bg-white/10 focus:ring-2 focus:ring-primary/50 focus:outline-none
               transition-all duration-300
Error:         border-red-500/50 (input) · text-red-500 text-xs mt-1 (message)
Label:         text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-gray-400 mb-2
```

### Hero Section

```
Container:  relative h-screen overflow-hidden
Background: video or image with absolute inset-0 object-cover
Overlay:    absolute inset-0 bg-black/60
Content:    relative z-10 flex flex-col items-center justify-center text-center px-4
Headline:   neon-text (use .neon-text utility)
Sub-text:   text-lg md:text-2xl text-gray-300 font-sans font-light
CTAs:       flex gap-4 flex-wrap justify-center mt-8
```

### Footer

```
Wrapper:   bg-luxury-black text-luxury-white pt-32 pb-12
Grid:      grid-cols-1 md:grid-cols-4 gap-20
Brand col: md:col-span-2
Links:     space-y-6 hover:text-primary transition-colors duration-300
Bottom:    pt-12 border-t border-white/5 flex justify-between text-xs text-gray-500
```

### Section Dividers / Accent Lines

```
Horizontal accent:  w-12 h-[1px] bg-primary mx-auto (or ml-0 for left-aligned)
Vertical spacer:    mt-4 mb-8 (standard gap between accent and heading)
```

---

## 6. Glass Morphism

```css
.glass      { background: rgba(13,2,33,0.7);  backdrop-filter: blur(12px); border: 1px solid rgba(255,45,149,0.2); }
.glass-dark { background: rgba(5,1,13,0.85);  backdrop-filter: blur(16px); border: 1px solid rgba(0,243,255,0.1); }
.glass-card { background: rgba(13,2,33,0.6);  backdrop-filter: blur(10px); border: 1px solid rgba(255,45,149,0.15); }
```

Use Tailwind equivalents where possible: `bg-white/5 backdrop-blur-md border border-white/10`

---

## 7. Neon Effects

```css
.neon-text   { text-shadow: 0 0 5px var(--color-primary), 0 0 10px var(--color-primary); }
.neon-border { border-color: var(--color-primary);
               box-shadow: 0 0 10px var(--color-primary), inset 0 0 5px rgba(255,45,149,0.1); }
```

Glow on images/logos: `drop-shadow-[0_0_8px_rgba(255,45,149,0.5)]`

Large decorative blurs: `blur-[120px]` or `blur-[150px]` with `opacity-30` `pointer-events-none`

---

## 8. Animations & Transitions

### Keyframes (defined in `styles.css`)

| Name | Effect | Duration |
|------|--------|----------|
| `fadeUp` | opacity 0→1, translateY(30px)→0 | 0.8s ease-out |
| `scaleIn` | opacity 0→1, scale(0.95)→1 | 1.2s ease-out |
| `slideInRight` | opacity 0→1, translateX(50px)→0 | 0.8s ease-out |
| `slideInLeft` | opacity 0→1, translateX(-50px)→0 | 0.8s ease-out |
| `shine` | background-position shift | 3s linear infinite |
| `spinSlow` | rotate(360deg) | 20s linear infinite |

Utility classes: `.animate-fade-up`, `.animate-spin-slow`

### Transition Defaults

```
Standard:  transition-all duration-300
Navbar:    transition-all duration-500
Slow:      duration-700 · duration-1000
Delays:    delay-200 · delay-500 · delay-700
```

### Group Hover Patterns

```
Image zoom:        group-hover:scale-110 transition-transform duration-700
Content slide-up:  translate-y-4 opacity-0 → group-hover:translate-y-0 group-hover:opacity-100
Color shift:       group-hover:text-primary transition-colors duration-300
Grayscale toggle:  grayscale group-hover:grayscale-0 transition-all duration-500
```

### Reduced Motion

All animations respect `prefers-reduced-motion: reduce` — animation-duration collapses to `0.01ms`.

---

## 9. Z-Index Layers

| Layer | Value | Usage |
|-------|-------|-------|
| Background decorations | 0 | Blurred glow orbs |
| Content | 5–10 | Section content |
| Overlays | 20–30 | Image overlays, gradients |
| Navbar | 50 | Fixed navigation |
| Modals | 100 | Dialogs, drawers |
| Toast/notifications | 9999 | Alerts |

---

## 10. Scrollbar

```css
::-webkit-scrollbar        { width: 8px; }
::-webkit-scrollbar-track  { background: var(--color-luxury-charcoal); }
::-webkit-scrollbar-thumb  { background: var(--color-luxury-charcoal); border-radius: 4px; }
::-webkit-scrollbar-thumb:hover { background: var(--color-primary); }
```

---

## 11. Accessibility Rules

- All interactive elements must have visible focus states: `focus:ring-2 focus:ring-primary/50`
- ARIA labels required on icon-only buttons and media controls
- Color contrast: always white/light text on dark backgrounds
- Form errors must use both color (`text-red-500`) and text message
- Respect `prefers-reduced-motion` — all keyframe animations must have a reduced-motion fallback

---

## 12. Do's and Don'ts

| ✅ Do | ❌ Don't |
|-------|---------|
| Use `font-serif` (Playfair Display) for all headings | Use system fonts or other typefaces |
| Keep backgrounds dark (`luxury-black` / `luxury-charcoal`) | Use white or light backgrounds |
| Add neon glow to primary CTAs | Use flat solid colors without glow |
| Apply `rounded-2xl` / `rounded-3xl` to cards and inputs | Use sharp corners (`rounded` or `rounded-lg`) on major elements |
| Use `uppercase tracking-[0.2em]` for labels and nav links | Use sentence-case or unspaced uppercase labels |
| Animate with `transition-all duration-300` | Use abrupt instant state changes |
| Use `border-white/5` → `border-white/10` for subtle borders | Use fully opaque borders |
| Center hero content with `flex items-center justify-center` | Left-align hero content |
| Use Tailwind utility classes | Write raw inline styles |
