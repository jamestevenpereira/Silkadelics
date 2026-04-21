---
phase: 1
plan: 02
type: execute
wave: 1
depends_on: []
files_modified:
  - frontend/src/app/shared/components/carousel/carousel.component.ts
  - frontend/src/app/shared/components/carousel/carousel.component.html
autonomous: true
requirements: [carousel-component]
---

# Plan 02 — CarouselComponent (Reusable)

## Objective

Create a premium, reusable standalone Angular carousel component. Accepts an array of `RepertoireImage` objects as input. Supports autoplay, pause-on-hover, navigation arrows, dot indicators, rounded corners with glow, and scale animation on slide hover.

## Architecture Context

- Design system: dark luxury, gold accents, glassmorphism
- Tailwind classes in use: `bg-luxury-black`, `bg-luxury-charcoal`, `text-gold`, `bg-gold`, `border-gold/20`, `glass-card`, `glass-dark`
- Angular signals pattern (`signal()`, `computed()`, `input()`)
- Standalone component
- No external carousel library — pure CSS transitions + Angular

## Tasks

### Task 2.1 — Create CarouselComponent TS

<read_first>
- frontend/src/app/core/services/repertoire-image.service.ts
- frontend/src/app/components/website/gallery/full-gallery/full-gallery.component.ts
</read_first>

<action>
Create `frontend/src/app/shared/components/carousel/carousel.component.ts`:

```typescript
import {
  Component, input, signal, computed,
  OnDestroy, ElementRef, viewChild, effect, NgZone
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RepertoireImage } from '../../../core/services/repertoire-image.service';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html'
})
export class CarouselComponent implements OnDestroy {
  images = input<RepertoireImage[]>([]);
  autoplayDelay = input<number>(4000);

  currentIndex = signal(0);
  isHovered = signal(false);
  isTransitioning = signal(false);

  total = computed(() => this.images().length);
  hasPrev = computed(() => this.currentIndex() > 0);
  hasNext = computed(() => this.currentIndex() < this.total() - 1);

  private autoplayTimer: ReturnType<typeof setInterval> | null = null;

  constructor(private ngZone: NgZone) {
    effect(() => {
      if (this.images().length > 0) this.startAutoplay();
    });
  }

  private startAutoplay(): void {
    this.stopAutoplay();
    this.ngZone.runOutsideAngular(() => {
      this.autoplayTimer = setInterval(() => {
        if (!this.isHovered()) {
          this.ngZone.run(() => this.goToNext());
        }
      }, this.autoplayDelay());
    });
  }

  private stopAutoplay(): void {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer);
      this.autoplayTimer = null;
    }
  }

  goTo(index: number): void {
    if (index === this.currentIndex() || this.isTransitioning()) return;
    this.isTransitioning.set(true);
    this.currentIndex.set(index);
    setTimeout(() => this.isTransitioning.set(false), 500);
  }

  goToPrev(): void {
    const prev = this.currentIndex() > 0
      ? this.currentIndex() - 1
      : this.total() - 1;
    this.goTo(prev);
  }

  goToNext(): void {
    const next = this.currentIndex() < this.total() - 1
      ? this.currentIndex() + 1
      : 0;
    this.goTo(next);
  }

  onMouseEnter(): void { this.isHovered.set(true); }
  onMouseLeave(): void { this.isHovered.set(false); }

  trackByIndex(index: number): number { return index; }

  ngOnDestroy(): void {
    this.stopAutoplay();
  }
}
```
</action>

<acceptance_criteria>
- File exists at `frontend/src/app/shared/components/carousel/carousel.component.ts`
- Contains `images = input<RepertoireImage[]>([])`
- Contains `autoplayDelay = input<number>(4000)`
- Contains `currentIndex = signal(0)`
- Contains `isHovered = signal(false)`
- Contains `ngZone.runOutsideAngular` for autoplay timer
- Contains `OnDestroy` with `stopAutoplay()` in `ngOnDestroy`
- `goToNext()` wraps around to index 0 when at last slide
- `goToPrev()` wraps around to last slide when at index 0
</acceptance_criteria>

### Task 2.2 — Create CarouselComponent HTML

<read_first>
- frontend/src/app/components/website/repertoire/repertoire.component.html (design patterns)
- frontend/src/app/shared/components/carousel/carousel.component.ts
</read_first>

<action>
Create `frontend/src/app/shared/components/carousel/carousel.component.html`:

```html
<div class="relative w-full" (mouseenter)="onMouseEnter()" (mouseleave)="onMouseLeave()">

  <!-- Slides container -->
  <div class="relative overflow-hidden rounded-3xl" style="aspect-ratio: 16/9;">

    @for (image of images(); track trackByIndex($index)) {
    <div
      class="absolute inset-0 transition-all duration-500 ease-in-out"
      [class.opacity-100]="currentIndex() === $index"
      [class.opacity-0]="currentIndex() !== $index"
      [class.scale-100]="currentIndex() === $index"
      [class.scale-105]="currentIndex() !== $index">

      <div class="w-full h-full group overflow-hidden rounded-3xl cursor-pointer
                  border border-white/10 hover:border-gold/30 transition-all duration-500">
        <img
          [src]="image.url"
          [alt]="image.alt"
          loading="lazy"
          class="w-full h-full object-cover transition-transform duration-700 ease-out
                 group-hover:scale-105
                 drop-shadow-[0_0_30px_rgba(212,175,55,0.15)]">
        <!-- Subtle gradient overlay on hover -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
      </div>
    </div>
    }

    <!-- Empty state -->
    @if (images().length === 0) {
    <div class="absolute inset-0 flex items-center justify-center bg-white/5 rounded-3xl border border-white/10">
      <div class="text-center">
        <div class="w-12 h-12 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p class="text-gray-500 font-sans text-sm tracking-widest uppercase">Loading...</p>
      </div>
    </div>
    }

    <!-- Navigation arrows -->
    @if (images().length > 1) {
    <button
      (click)="goToPrev()"
      aria-label="Previous slide"
      class="absolute left-4 top-1/2 -translate-y-1/2 z-20
             w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/20
             text-white hover:bg-gold hover:text-black hover:border-gold
             transition-all duration-300 flex items-center justify-center group
             focus:outline-none focus:ring-2 focus:ring-gold/50">
      <svg class="w-5 h-5 group-hover:-translate-x-0.5 transition-transform"
           fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
      </svg>
    </button>

    <button
      (click)="goToNext()"
      aria-label="Next slide"
      class="absolute right-4 top-1/2 -translate-y-1/2 z-20
             w-11 h-11 rounded-full bg-black/40 backdrop-blur-md border border-white/20
             text-white hover:bg-gold hover:text-black hover:border-gold
             transition-all duration-300 flex items-center justify-center group
             focus:outline-none focus:ring-2 focus:ring-gold/50">
      <svg class="w-5 h-5 group-hover:translate-x-0.5 transition-transform"
           fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
      </svg>
    </button>
    }
  </div>

  <!-- Dot indicators -->
  @if (images().length > 1) {
  <div class="flex items-center justify-center gap-2 mt-6" role="tablist" aria-label="Carousel navigation">
    @for (image of images(); track trackByIndex($index)) {
    <button
      (click)="goTo($index)"
      [attr.aria-selected]="currentIndex() === $index"
      [attr.aria-label]="'Go to slide ' + ($index + 1)"
      role="tab"
      class="transition-all duration-300 rounded-full focus:outline-none focus:ring-1 focus:ring-gold/50"
      [class.w-6]="currentIndex() === $index"
      [class.h-2]="currentIndex() === $index"
      [class.bg-gold]="currentIndex() === $index"
      [class.w-2]="currentIndex() !== $index"
      [class.h-2]="currentIndex() !== $index"
      [class.bg-white]="currentIndex() !== $index"
      [class.opacity-30]="currentIndex() !== $index"
      [class.hover:opacity-70]="currentIndex() !== $index">
    </button>
    }
  </div>
  }
</div>
```
</action>

<acceptance_criteria>
- File exists at `frontend/src/app/shared/components/carousel/carousel.component.html`
- Contains `(mouseenter)="onMouseEnter()"` and `(mouseleave)="onMouseLeave()"`
- Contains `[class.opacity-100]="currentIndex() === $index"` for active slide
- Contains prev/next arrow buttons with `aria-label`
- Contains dot indicators with `role="tab"` and `aria-selected`
- Contains `@if (images().length === 0)` empty/loading state
- Active dot has class `w-6` (wider pill shape), inactive has `w-2`
</acceptance_criteria>

## Verification

```bash
# Files exist
test -f frontend/src/app/shared/components/carousel/carousel.component.ts && echo "TS OK"
test -f frontend/src/app/shared/components/carousel/carousel.component.html && echo "HTML OK"

# Input signals
grep "images = input" frontend/src/app/shared/components/carousel/carousel.component.ts
grep "autoplayDelay = input" frontend/src/app/shared/components/carousel/carousel.component.ts

# Accessibility
grep 'aria-label="Previous slide"' frontend/src/app/shared/components/carousel/carousel.component.html
grep 'role="tab"' frontend/src/app/shared/components/carousel/carousel.component.html
```

## Success Criteria

- [ ] `carousel.component.ts` and `carousel.component.html` both exist
- [ ] `images` is an `input<RepertoireImage[]>` signal
- [ ] Autoplay runs outside NgZone (no CD overhead)
- [ ] Dots and arrows have proper ARIA attributes
- [ ] OnDestroy clears the interval
