import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';

import { SupabaseService } from '../../../core/services/supabase.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  imports: [],
  templateUrl: './testimonials.component.html',
  styles: ``
})
export class TestimonialsComponent implements OnInit, OnDestroy {
  supabaseService = inject(SupabaseService);
  langService = inject(LanguageService);

  content = this.langService.content;
  testimonials = signal<any[]>([]);

  // Carousel
  currentIndex = signal<number>(0);
  autoPlayInterval: any;
  isPaused = false;

  async ngOnInit() {
    const { data } = await this.supabaseService.getTestimonials();
    console.log('Testimonials from database:', data);
    if (data) {
      this.testimonials.set(data);
      this.startAutoPlay();
    }
  }

  ngOnDestroy() {
    this.stopAutoPlay();
  }

  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      if (!this.isPaused) {
        this.next();
      }
    }, 5000); // Change slide every 5 seconds
  }

  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }

  pauseAutoPlay() {
    this.isPaused = true;
  }

  resumeAutoPlay() {
    this.isPaused = false;
  }

  next() {
    const total = this.testimonials().length;
    if (total > 0) {
      this.currentIndex.set((this.currentIndex() + 1) % total);
    }
  }

  previous() {
    const total = this.testimonials().length;
    if (total > 0) {
      this.currentIndex.set((this.currentIndex() - 1 + total) % total);
    }
  }

  goToSlide(index: number) {
    this.currentIndex.set(index);
  }

  getVisibleTestimonials() {
    const total = this.testimonials().length;
    if (total === 0) return [];

    // Show up to 3 testimonials at a time on desktop, 1 on mobile
    // But never more than the total available
    const desiredItems = window.innerWidth >= 1024 ? 3 : 1;
    const itemsToShow = Math.min(desiredItems, total);
    const items = [];

    for (let i = 0; i < itemsToShow; i++) {
      const index = (this.currentIndex() + i) % total;
      items.push(this.testimonials()[index]);
    }

    return items;
  }
}
