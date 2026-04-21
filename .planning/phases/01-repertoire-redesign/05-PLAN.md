---
phase: 1
plan: 05
type: execute
wave: 3
depends_on: [03, 04]
files_modified:
  - frontend/src/app/components/website/repertoire/repertoire.component.ts
  - frontend/src/app/components/website/repertoire/repertoire.component.html
autonomous: true
requirements: [repertoire-landing]
---

# Plan 05 — RepertoireLandingComponent (Homepage Section Redesign)

## Objective

Redesign the existing `RepertoireComponent` (embedded section in homepage) from a table-based UI to a premium hero section with two CTA cards. Remove all table, search, filter, and pagination logic. Keep the section embedded in `HomeComponent` as `<app-repertoire id="repertoire">`.

## Architecture Context

- Component stays as `app-repertoire` selector (no rename) — `HomeComponent` already uses it
- Current template: table with search/filter/pagination
- New template: hero title + description + two glass CTA cards
- CTA 1: "See Our Recommendations" → `routerLink="/repertoire/recommendations"`
- CTA 2: "Browse Full Repertoire" → `routerLink="/repertoire/library"`
- Both cards: glassmorphism (glass-card / glass-dark), border-gold/20, hover glow, scale effect
- Remove from TS: `filteredRepertoire`, `paginatedRepertoire`, `totalPages`, `categories`, `currentPage`, `pageSize`, `searchQuery`, `selectedCategory`, `onSearchChange`, `onCategoryChange`, `goToPage`, `nextPage`, `previousPage`, `totalSongsText`, `filterAllLabel`, `pageOfText`
- Remove from TS imports: `FormsModule`
- Keep: `LanguageService` inject (still uses `content()` for some labels if needed) — OR simplify to no i18n keys since we're using hardcoded English strings for premium feel. Use hardcoded strings for this redesign.
- Remove: `SupabaseService` inject (no longer needed in landing)

## Tasks

### Task 5.1 — Replace RepertoireComponent TS

<read_first>
- frontend/src/app/components/website/repertoire/repertoire.component.ts
- frontend/src/app/app.routes.ts (ensure RouterLink is available)
</read_first>

<action>
Overwrite `frontend/src/app/components/website/repertoire/repertoire.component.ts` with:

```typescript
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-repertoire',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './repertoire.component.html'
})
export class RepertoireComponent {}
```
</action>

<acceptance_criteria>
- File at `frontend/src/app/components/website/repertoire/repertoire.component.ts` contains only `RouterLink` import
- No `FormsModule` import
- No `SupabaseService` inject
- No `signal()` or `computed()` calls
- Class body is empty (`RepertoireComponent {}`)
- `imports: [RouterLink]` in decorator
</acceptance_criteria>

### Task 5.2 — Replace RepertoireComponent HTML

<read_first>
- frontend/src/app/components/website/repertoire/repertoire.component.html
- frontend/src/app/components/website/repertoire/repertoire.component.ts
</read_first>

<action>
Overwrite `frontend/src/app/components/website/repertoire/repertoire.component.html` with:

```html
<section id="repertoire" class="py-28 bg-luxury-black relative overflow-hidden">

  <!-- Background glows -->
  <div class="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
    <div class="absolute top-1/4 -left-20 w-96 h-96 bg-gold/10 rounded-full blur-[120px]"></div>
    <div class="absolute bottom-1/4 -right-20 w-96 h-96 bg-gold/5 rounded-full blur-[120px]"></div>
  </div>

  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

    <!-- Section Header -->
    <div class="text-center mb-20 animate-fade-up">
      <p class="text-gold text-xs font-bold tracking-[0.4em] uppercase mb-6">What We Play</p>
      <h2 class="text-4xl md:text-6xl font-serif font-bold text-white mb-8 leading-tight">
        Our <span class="italic text-gold">Repertoire</span>
      </h2>
      <p class="text-gray-400 font-sans font-light text-lg max-w-2xl mx-auto leading-relaxed">
        From timeless classics to contemporary hits — every song chosen to move people.<br>
        <span class="text-gray-500 text-base">Explore our curated sets or browse the full library by era.</span>
      </p>
      <div class="w-16 h-px bg-gold/40 mx-auto mt-8"></div>
    </div>

    <!-- CTA Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto animate-fade-up">

      <!-- CTA 1: Recommendations -->
      <a routerLink="/repertoire/recommendations"
         class="group relative glass-dark rounded-[32px] border border-white/10 p-10 overflow-hidden
                hover:border-gold/40 transition-all duration-500 cursor-pointer block
                hover:shadow-[0_0_60px_rgba(212,175,55,0.12)]">

        <!-- Hover gradient -->
        <div class="absolute inset-0 bg-gradient-to-br from-gold/8 via-transparent to-transparent
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[32px]"></div>
        <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div class="relative z-10">
          <!-- Icon -->
          <div class="w-14 h-14 bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center mb-8
                      group-hover:bg-gold/20 group-hover:border-gold/40 transition-all duration-500">
            <svg class="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M5 3l14 9-14 9V3z"/>
            </svg>
          </div>

          <p class="text-gold text-[10px] font-bold tracking-[0.35em] uppercase mb-3">Curated Selection</p>
          <h3 class="text-2xl md:text-3xl font-serif font-bold text-white mb-4 leading-tight
                     group-hover:text-gold transition-colors duration-300">
            See Our Recommendations
          </h3>
          <p class="text-gray-500 font-sans font-light text-sm leading-relaxed mb-8">
            Our hand-picked favourites — the songs we love to perform most and that always get the crowd going.
          </p>

          <div class="flex items-center gap-2 text-gold text-xs font-bold tracking-widest uppercase
                      group-hover:gap-4 transition-all duration-300">
            Explore
            <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </div>
        </div>
      </a>

      <!-- CTA 2: Full Library -->
      <a routerLink="/repertoire/library"
         class="group relative glass-dark rounded-[32px] border border-white/10 p-10 overflow-hidden
                hover:border-gold/40 transition-all duration-500 cursor-pointer block
                hover:shadow-[0_0_60px_rgba(212,175,55,0.12)]">

        <!-- Hover gradient -->
        <div class="absolute inset-0 bg-gradient-to-br from-gold/8 via-transparent to-transparent
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[32px]"></div>
        <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div class="relative z-10">
          <!-- Icon -->
          <div class="w-14 h-14 bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center mb-8
                      group-hover:bg-gold/20 group-hover:border-gold/40 transition-all duration-500">
            <svg class="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/>
            </svg>
          </div>

          <p class="text-gold text-[10px] font-bold tracking-[0.35em] uppercase mb-3">By Era</p>
          <h3 class="text-2xl md:text-3xl font-serif font-bold text-white mb-4 leading-tight
                     group-hover:text-gold transition-colors duration-300">
            Browse Full Repertoire
          </h3>
          <p class="text-gray-500 font-sans font-light text-sm leading-relaxed mb-8">
            Explore the complete library — 70s classics, 2000s anthems, 2010s hits — organised by decade.
          </p>

          <div class="flex items-center gap-2 text-gold text-xs font-bold tracking-widest uppercase
                      group-hover:gap-4 transition-all duration-300">
            Browse
            <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </div>
        </div>
      </a>

    </div>
  </div>
</section>
```
</action>

<acceptance_criteria>
- File at `frontend/src/app/components/website/repertoire/repertoire.component.html` no longer contains `<table`, `<thead`, `<tbody`, `<tr`, `<td`
- No `[ngModel]` or search/filter inputs
- No pagination buttons
- Contains `routerLink="/repertoire/recommendations"` on first card
- Contains `routerLink="/repertoire/library"` on second card
- Both cards have `class` containing `glass-dark`, `rounded-[32px]`, `border-white/10`
- Contains section heading `Our Repertoire` and `Our Recommendations`  
- `id="repertoire"` preserved on `<section>`
</acceptance_criteria>

## Verification

```bash
# No table elements
grep -c "<table\|<thead\|<tbody\|<td" frontend/src/app/components/website/repertoire/repertoire.component.html || echo "0"

# Has routerLinks
grep 'routerLink="/repertoire/recommendations"' frontend/src/app/components/website/repertoire/repertoire.component.html
grep 'routerLink="/repertoire/library"' frontend/src/app/components/website/repertoire/repertoire.component.html

# Section id preserved
grep 'id="repertoire"' frontend/src/app/components/website/repertoire/repertoire.component.html

# TS is minimal
grep -c "signal\|computed\|FormsModule" frontend/src/app/components/website/repertoire/repertoire.component.ts || echo "0"
```

## Success Criteria

- [ ] No table/search/filter/pagination HTML in repertoire.component.html
- [ ] Two glass CTA cards with correct `routerLink` paths
- [ ] `repertoire.component.ts` is minimal — only `RouterLink` import, empty class
- [ ] `id="repertoire"` preserved so homepage anchor `#repertoire` still works
- [ ] Both cards have glassmorphism styling consistent with design system
