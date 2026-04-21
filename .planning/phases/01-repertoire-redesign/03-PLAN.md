---
phase: 1
plan: 03
type: execute
wave: 2
depends_on: [01, 02]
files_modified:
  - frontend/src/app/components/website/repertoire/recommendations/recommendations.component.ts
  - frontend/src/app/components/website/repertoire/recommendations/recommendations.component.html
autonomous: true
requirements: [recommendations-page]
---

# Plan 03 — RecommendationsComponent

## Objective

Create the `/repertoire/recommendations` page as a full-screen standalone Angular component. Full-page layout (navbar + footer). Hero section. Carousel using `CarouselComponent`. Conversion-focused CTA below carousel linking to `#booking`.

## Architecture Context

- Routed page: `/repertoire/recommendations`
- Pattern reference: `frontend/src/app/components/website/gallery/full-gallery/full-gallery.component.ts` — uses `NavbarComponent` imported inline and `pt-32` for navbar offset
- `HomeComponent` includes `<app-navbar>` and `<app-footer>` — routed sub-pages should too
- Design: dark luxury, gold, glassmorphism — same visual language as gallery page
- `RepertoireImageService.recommendations` signal provides images
- Carousel: `app-carousel` from `CarouselComponent`
- `#booking` anchor links back to `/` home booking section (use `routerLink="/" fragment="booking"`)

## Tasks

### Task 3.1 — Create RecommendationsComponent TS

<read_first>
- frontend/src/app/core/services/repertoire-image.service.ts
- frontend/src/app/shared/components/carousel/carousel.component.ts
- frontend/src/app/components/website/gallery/full-gallery/full-gallery.component.ts
- frontend/src/app/components/website/navbar/navbar.component.ts (verify selector)
- frontend/src/app/components/website/footer/footer.component.ts (verify selector)
</read_first>

<action>
Create directory `frontend/src/app/components/website/repertoire/recommendations/`.

Create `frontend/src/app/components/website/repertoire/recommendations/recommendations.component.ts`:

```typescript
import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { CarouselComponent } from '../../../../shared/components/carousel/carousel.component';
import { RepertoireImageService } from '../../../../core/services/repertoire-image.service';
import { LanguageService } from '../../../../core/services/language.service';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent, CarouselComponent],
  templateUrl: './recommendations.component.html'
})
export class RecommendationsComponent implements OnInit {
  private imageService = inject(RepertoireImageService);
  private langService = inject(LanguageService);

  content = this.langService.content;
  images = this.imageService.recommendations;
  loading = this.imageService.loading;

  async ngOnInit(): Promise<void> {
    await this.imageService.loadRecommendations();
  }
}
```
</action>

<acceptance_criteria>
- File exists at `frontend/src/app/components/website/repertoire/recommendations/recommendations.component.ts`
- Imports `NavbarComponent`, `FooterComponent`, `CarouselComponent`, `RouterLink`
- `images = this.imageService.recommendations` (signal reference)
- `ngOnInit` calls `await this.imageService.loadRecommendations()`
- Decorator has `standalone: true`
</acceptance_criteria>

### Task 3.2 — Create RecommendationsComponent HTML

<read_first>
- frontend/src/app/components/website/repertoire/recommendations/recommendations.component.ts
- frontend/src/app/components/website/repertoire/repertoire.component.html (design patterns)
- frontend/src/app/components/website/gallery/full-gallery/full-gallery.component.html (page layout pattern)
</read_first>

<action>
Create `frontend/src/app/components/website/repertoire/recommendations/recommendations.component.html`:

```html
<app-navbar></app-navbar>

<main class="min-h-screen bg-luxury-black overflow-hidden">

  <!-- Background Glows -->
  <div class="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-gold/5 rounded-full blur-[180px] -translate-y-1/2"></div>
    <div class="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gold/3 rounded-full blur-[160px]"></div>
  </div>

  <!-- Hero Section -->
  <section class="pt-40 pb-20 px-4 sm:px-6 lg:px-8 relative z-10">
    <div class="max-w-7xl mx-auto">

      <!-- Back navigation -->
      <a routerLink="/" fragment="repertoire"
         class="inline-flex items-center gap-2 text-gold text-xs font-bold tracking-widest uppercase mb-12
                hover:text-white transition-colors group">
        <svg class="w-4 h-4 transform group-hover:-translate-x-1 transition-transform"
             fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
        Repertório
      </a>

      <!-- Title block -->
      <div class="text-center mb-20 animate-fade-up">
        <p class="text-gold text-xs font-bold tracking-[0.4em] uppercase mb-6">Our Repertoire</p>
        <h1 class="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
          Our <span class="italic text-gold">Recommendations</span>
        </h1>
        <p class="text-gray-400 font-sans font-light text-xl max-w-2xl mx-auto leading-relaxed">
          A curated selection of songs we love to perform — the soundtrack to unforgettable moments.
        </p>
        <div class="w-16 h-px bg-gold/40 mx-auto mt-8"></div>
      </div>

      <!-- Carousel -->
      <div class="max-w-5xl mx-auto animate-fade-up">
        @if (loading()) {
        <div class="flex flex-col items-center justify-center py-32">
          <div class="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
          <p class="text-gold font-sans font-bold text-xs tracking-widest uppercase">Loading...</p>
        </div>
        } @else {
        <app-carousel [images]="images()" [autoplayDelay]="5000"></app-carousel>
        }
      </div>
    </div>
  </section>

  <!-- Conversion CTA Section -->
  <section class="py-28 px-4 sm:px-6 lg:px-8 relative z-10">
    <div class="max-w-4xl mx-auto">
      <div class="relative glass-dark rounded-[40px] border border-gold/20 p-12 md:p-16 text-center overflow-hidden
                  hover:border-gold/40 transition-all duration-700 group">

        <!-- Inner glow -->
        <div class="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/3 rounded-[40px]
                    opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"></div>

        <div class="relative z-10">
          <p class="text-gold text-xs font-bold tracking-[0.4em] uppercase mb-6">Feel the Energy</p>
          <h2 class="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
            Like this <span class="italic text-gold">vibe?</span>
          </h2>
          <p class="text-gray-300 font-sans font-light text-lg max-w-xl mx-auto mb-12 leading-relaxed">
            We can bring this exact energy to your event.<br>
            <span class="text-gray-500 text-base">Every set is crafted for the room — curated, live, unforgettable.</span>
          </p>

          <a routerLink="/" fragment="booking"
             class="inline-flex items-center gap-3 px-12 py-5
                    bg-gold text-black font-sans font-bold text-xs tracking-[0.3em] uppercase
                    rounded-2xl hover:bg-white transition-all duration-300
                    shadow-[0_0_40px_rgba(212,175,55,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.2)]
                    group/btn">
            Book Us Now
            <svg class="w-4 h-4 group-hover/btn:translate-x-1 transition-transform"
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </a>
        </div>
      </div>
    </div>
  </section>

</main>

<app-footer></app-footer>
```
</action>

<acceptance_criteria>
- File exists at `frontend/src/app/components/website/repertoire/recommendations/recommendations.component.html`
- Contains `<app-navbar>` and `<app-footer>`
- Contains `<app-carousel [images]="images()" [autoplayDelay]="5000">`
- Contains `routerLink="/" fragment="booking"` on CTA button
- Contains `routerLink="/" fragment="repertoire"` on back button
- Contains loading spinner `@if (loading())`
- Contains `class="animate-fade-up"` on hero elements
- CTA section has `class` containing `glass-dark`, `rounded-[40px]`, `border-gold/20`
</acceptance_criteria>

## Verification

```bash
test -f frontend/src/app/components/website/repertoire/recommendations/recommendations.component.ts && echo "TS OK"
test -f frontend/src/app/components/website/repertoire/recommendations/recommendations.component.html && echo "HTML OK"
grep "app-carousel" frontend/src/app/components/website/repertoire/recommendations/recommendations.component.html
grep 'fragment="booking"' frontend/src/app/components/website/repertoire/recommendations/recommendations.component.html
grep "standalone: true" frontend/src/app/components/website/repertoire/recommendations/recommendations.component.ts
```

## Success Criteria

- [ ] Both TS and HTML files exist in `repertoire/recommendations/`
- [ ] Standalone component with `NavbarComponent`, `FooterComponent`, `CarouselComponent` imported
- [ ] `images` signal wired to `imageService.recommendations`
- [ ] CTA button links to `routerLink="/" fragment="booking"`
- [ ] Loading state shown while `imageService.loading()` is true
