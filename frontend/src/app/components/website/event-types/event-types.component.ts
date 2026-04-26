import { ChangeDetectionStrategy, Component, ElementRef, AfterViewInit, OnDestroy, ViewChildren, QueryList, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-event-types',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './event-types.component.html',
  styleUrl: './event-types.component.css'
})
export class EventTypesComponent implements AfterViewInit, OnDestroy {
  langService = inject(LanguageService);
  platformId = inject(PLATFORM_ID);
  content = this.langService.content;

  @ViewChildren('cardElement') cardElements!: QueryList<ElementRef>;

  activeCard: string | null = null;
  private observer: IntersectionObserver | null = null;

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initIntersectionObserver();
    }
  }

  private initIntersectionObserver() {
    const options = {
      root: null,
      // Create a trigger zone in the middle 40% of the viewport.
      rootMargin: '-30% 0px -30% 0px',
      threshold: 0
    };

    this.observer = new IntersectionObserver((entries) => {
      // Only apply scroll-to-activate on screens smaller than lg (mobile/tablet)
      if (window.innerWidth < 1024) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const typeId = (entry.target as HTMLElement).getAttribute('data-type');
            this.activeCard = typeId;
          }
        });
      } else {
        // clear on desktop so hover takes full control
        this.activeCard = null;
      }
    }, options);

    this.cardElements.forEach(card => {
      this.observer?.observe(card.nativeElement);
    });
  }

  onCardClick(event: Event, typeId: string) {
    // With scroll-to-activate, we can allow immediate navigation 
    // because the card is already "active" when clicked.
    // We keep the method for consistency or future analytics.
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
