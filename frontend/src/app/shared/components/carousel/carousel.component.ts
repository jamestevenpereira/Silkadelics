import {
  Component, input, signal, computed,
  OnDestroy, NgZone, effect
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
