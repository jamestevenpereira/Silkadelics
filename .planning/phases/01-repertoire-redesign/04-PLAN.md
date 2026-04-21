---
phase: 1
plan: 04
type: execute
wave: 2
depends_on: [01, 02]
files_modified:
  - frontend/src/app/components/website/repertoire/library/library.component.ts
  - frontend/src/app/components/website/repertoire/library/library.component.html
autonomous: true
requirements: [library-page]
---

# Plan 04 — LibraryComponent

## Objective

Create the `/repertoire/library` page as a full standalone Angular component. Full-page layout (navbar + footer). Three era tabs ("70s–90s", "2000+", "2010+") each containing a `CarouselComponent`. Tabs have animated underline. Smooth transitions between eras. Accessibility compliant (ARIA roles).

## Architecture Context

- Routed page: `/repertoire/library`
- Era tabs map to Supabase folders: `70-90`, `2000+`, `2010+`
- Signal for active tab: `activeEra = signal<RepertoireEra>('70-90')`
- `RepertoireImageService` signals: `library70s90s`, `library2000s`, `library2010s`
- Tab change triggers lazy loading of that era if not already loaded (use `loadLibraryEra()`)
- Carousel reused per tab: `<app-carousel [images]="activeImages()">`
- `activeImages` is a `computed()` that returns the right signal based on `activeEra()`

## Tasks

### Task 4.1 — Create LibraryComponent TS

<read_first>
- frontend/src/app/core/services/repertoire-image.service.ts
- frontend/src/app/shared/components/carousel/carousel.component.ts
- frontend/src/app/components/website/repertoire/recommendations/recommendations.component.ts
</read_first>

<action>
Create directory `frontend/src/app/components/website/repertoire/library/`.

Create `frontend/src/app/components/website/repertoire/library/library.component.ts`:

```typescript
import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { CarouselComponent } from '../../../../shared/components/carousel/carousel.component';
import { RepertoireImageService, RepertoireEra } from '../../../../core/services/repertoire-image.service';
import { LanguageService } from '../../../../core/services/language.service';

interface EraTab {
  id: RepertoireEra;
  label: string;
}

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent, CarouselComponent],
  templateUrl: './library.component.html'
})
export class LibraryComponent implements OnInit {
  private imageService = inject(RepertoireImageService);
  private langService = inject(LanguageService);

  content = this.langService.content;
  loading = this.imageService.loading;

  activeEra = signal<RepertoireEra>('70-90');

  tabs: EraTab[] = [
    { id: '70-90', label: '70s – 90s' },
    { id: '2000+', label: '2000+' },
    { id: '2010+', label: '2010+' },
  ];

  activeImages = computed(() => {
    const era = this.activeEra();
    if (era === '70-90') return this.imageService.library70s90s();
    if (era === '2000+') return this.imageService.library2000s();
    return this.imageService.library2010s();
  });

  loadedEras = signal<Set<RepertoireEra>>(new Set(['70-90']));

  async ngOnInit(): Promise<void> {
    await this.imageService.loadLibraryEra('70-90');
    this.loadedEras.update(s => new Set([...s, '70-90']));
  }

  async selectEra(era: RepertoireEra): Promise<void> {
    this.activeEra.set(era);
    if (!this.loadedEras().has(era)) {
      await this.imageService.loadLibraryEra(era);
      this.loadedEras.update(s => new Set([...s, era]));
    }
  }

  isActive(era: RepertoireEra): boolean {
    return this.activeEra() === era;
  }
}
```
</action>

<acceptance_criteria>
- File exists at `frontend/src/app/components/website/repertoire/library/library.component.ts`
- Contains `activeEra = signal<RepertoireEra>('70-90')`
- Contains `tabs: EraTab[]` array with 3 entries: `70-90`, `2000+`, `2010+`
- Contains `activeImages = computed(...)` that switches based on `activeEra()`
- `selectEra()` sets `activeEra` and calls `loadLibraryEra()` only if era not yet loaded
- `loadedEras` signal tracks which eras have been fetched
- Decorator has `standalone: true`
</acceptance_criteria>

### Task 4.2 — Create LibraryComponent HTML

<read_first>
- frontend/src/app/components/website/repertoire/library/library.component.ts
- frontend/src/app/components/website/repertoire/recommendations/recommendations.component.html
</read_first>

<action>
Create `frontend/src/app/components/website/repertoire/library/library.component.html`:

```html
<app-navbar></app-navbar>

<main class="min-h-screen bg-luxury-black overflow-hidden">

  <!-- Background Glows -->
  <div class="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[900px] bg-gold/5 rounded-full blur-[180px] -translate-y-1/2"></div>
    <div class="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gold/3 rounded-full blur-[160px]"></div>
  </div>

  <!-- Hero Section -->
  <section class="pt-40 pb-16 px-4 sm:px-6 lg:px-8 relative z-10">
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
      <div class="text-center mb-16 animate-fade-up">
        <p class="text-gold text-xs font-bold tracking-[0.4em] uppercase mb-6">Our Repertoire</p>
        <h1 class="text-5xl md:text-7xl font-serif font-bold text-white mb-6 leading-tight">
          Full <span class="italic text-gold">Library</span>
        </h1>
        <p class="text-gray-400 font-sans font-light text-xl max-w-2xl mx-auto leading-relaxed">
          Explore our full repertoire across eras — from timeless classics to modern hits.
        </p>
        <div class="w-16 h-px bg-gold/40 mx-auto mt-8"></div>
      </div>

      <!-- Era Tabs -->
      <div class="max-w-5xl mx-auto">
        <div class="flex items-center justify-center gap-0 mb-16 border-b border-white/10"
             role="tablist" aria-label="Repertoire eras">
          @for (tab of tabs; track tab.id) {
          <button
            (click)="selectEra(tab.id)"
            [attr.aria-selected]="isActive(tab.id)"
            [attr.aria-controls]="'era-' + tab.id"
            role="tab"
            class="relative px-10 py-5 font-sans font-bold text-xs tracking-[0.3em] uppercase
                   transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-gold/30
                   group"
            [class.text-gold]="isActive(tab.id)"
            [class.text-gray-500]="!isActive(tab.id)"
            [class.hover:text-gray-300]="!isActive(tab.id)">
            {{ tab.label }}
            <!-- Animated underline -->
            <span class="absolute bottom-0 left-0 right-0 h-[2px] bg-gold transition-all duration-400 ease-out origin-center"
                  [class.scale-x-100]="isActive(tab.id)"
                  [class.opacity-100]="isActive(tab.id)"
                  [class.scale-x-0]="!isActive(tab.id)"
                  [class.opacity-0]="!isActive(tab.id)"></span>
          </button>
          }
        </div>

        <!-- Carousel panel -->
        <div class="animate-fade-up"
             [attr.id]="'era-' + activeEra()"
             role="tabpanel"
             [attr.aria-label]="activeEra() + ' repertoire'">
          @if (activeImages().length === 0) {
          <div class="flex flex-col items-center justify-center py-32">
            <div class="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
            <p class="text-gold font-sans font-bold text-xs tracking-widest uppercase">Loading...</p>
          </div>
          } @else {
          <app-carousel [images]="activeImages()" [autoplayDelay]="5000"></app-carousel>
          }
        </div>
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section class="py-24 px-4 sm:px-6 lg:px-8 relative z-10">
    <div class="max-w-4xl mx-auto">
      <div class="relative glass-dark rounded-[40px] border border-gold/20 p-12 md:p-16 text-center overflow-hidden
                  hover:border-gold/40 transition-all duration-700 group">
        <div class="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-gold/3 rounded-[40px]
                    opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent"></div>

        <div class="relative z-10">
          <p class="text-gold text-xs font-bold tracking-[0.4em] uppercase mb-6">Sound Like You?</p>
          <h2 class="text-4xl md:text-5xl font-serif font-bold text-white mb-6 leading-tight">
            Ready to set the <span class="italic text-gold">stage?</span>
          </h2>
          <p class="text-gray-300 font-sans font-light text-lg max-w-xl mx-auto mb-12 leading-relaxed">
            Whatever the era, whatever the vibe — we'll match it.<br>
            <span class="text-gray-500 text-base">Tell us about your event and let's build the perfect setlist.</span>
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
- File exists at `frontend/src/app/components/website/repertoire/library/library.component.html`
- Contains `<app-navbar>` and `<app-footer>`
- Contains `role="tablist"` on tabs wrapper and `role="tab"` on each button
- Contains `role="tabpanel"` on content panel
- Tab underline span has `[class.scale-x-100]="isActive(tab.id)"` and `[class.scale-x-0]="!isActive(tab.id)"`
- Contains `<app-carousel [images]="activeImages()" [autoplayDelay]="5000">`
- Contains `routerLink="/" fragment="booking"` on CTA
- Loading spinner shown when `activeImages().length === 0`
</acceptance_criteria>

## Verification

```bash
test -f frontend/src/app/components/website/repertoire/library/library.component.ts && echo "TS OK"
test -f frontend/src/app/components/website/repertoire/library/library.component.html && echo "HTML OK"
grep "role=\"tablist\"" frontend/src/app/components/website/repertoire/library/library.component.html
grep "app-carousel" frontend/src/app/components/website/repertoire/library/library.component.html
grep "selectEra" frontend/src/app/components/website/repertoire/library/library.component.ts
```

## Success Criteria

- [ ] Both TS and HTML files exist in `repertoire/library/`
- [ ] `activeEra` signal drives `activeImages` computed
- [ ] Tabs have full ARIA (tablist, tab, tabpanel, aria-selected, aria-controls)
- [ ] Tab underline animates via scale-x transform
- [ ] Era images lazy-loaded (only fetched when tab first selected)
- [ ] CTA links to `routerLink="/" fragment="booking"`
