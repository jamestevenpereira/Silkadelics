import {
  Component, input, signal, computed,
  NgZone, HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RepertoireImage } from '../../../core/services/repertoire-image.service';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html'
})
export class CarouselComponent {
  images = input<RepertoireImage[]>([]);

  currentIndex = signal(0);
  isHovered = signal(false);
  isTransitioning = signal(false);

  // Drag state
  private dragStartX = 0;
  private dragCurrentX = 0;
  private isDragging = signal(false);
  private pointerCaptured = false;

  total = computed(() => this.images().length);
  hasPrev = computed(() => this.currentIndex() > 0);
  hasNext = computed(() => this.currentIndex() < this.total() - 1);

  constructor(private ngZone: NgZone) {}

  // Keyboard navigation
  @HostListener('window:keydown', ['$event'])
  handleKeyboard(e: KeyboardEvent): void {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      this.ngZone.run(() => this.goToPrev());
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      this.ngZone.run(() => this.goToNext());
    }
  }

  goTo(index: number): void {
    if (index === this.currentIndex() || this.isTransitioning()) return;
    this.isTransitioning.set(true);
    this.currentIndex.set(index);
    setTimeout(() => this.isTransitioning.set(false), 700);
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

  // Drag / swipe support
  onPointerDown(e: PointerEvent): void {
    if (this.images().length <= 1) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    this.pointerCaptured = true;
    this.dragStartX = e.clientX;
    this.dragCurrentX = 0;
    this.isDragging.set(true);
  }

  onPointerMove(e: PointerEvent): void {
    if (!this.isDragging()) return;
    this.dragCurrentX = e.clientX - this.dragStartX;
  }

  onPointerUp(): void {
    if (!this.isDragging()) return;
    const threshold = 50;
    if (this.dragCurrentX > threshold) {
      this.goToPrev();
    } else if (this.dragCurrentX < -threshold) {
      this.goToNext();
    }
    this.isDragging.set(false);
    this.pointerCaptured = false;
  }

  onMouseEnter(): void { this.isHovered.set(true); }
  onMouseLeave(): void { this.isHovered.set(false); }

  // Slide transforms for 3D coverflow-like effect
  getSlideTransform(index: number): string {
    const diff = index - this.currentIndex();
    const translateX = diff * 65;
    const scale = Math.abs(diff) <= 1 ?
      (diff === 0 ? 1 : 0.78) : 0.6;
    return `translateX(${translateX}%) scale(${scale})`;
  }

  getSlideOpacity(index: number): number {
    const diff = index - this.currentIndex();
    return Math.abs(diff) <= 2 ?
      (diff === 0 ? 1 : 0.6) : 0;
  }

  getSlideZIndex(index: number): number {
    const diff = index - this.currentIndex();
    return diff === 0 ? 10 : (Math.abs(diff) === 1 ? 5 : 1);
  }

  getSlideWidth(index: number): string {
    const diff = index - this.currentIndex();
    return diff === 0 ? '75%' : '65%';
  }

  getSlideMaxWidth(index: number): string {
    return '500px';
  }

  trackByIndex(index: number): number { return index; }
}
