import { ChangeDetectionStrategy, Component, ElementRef, AfterViewInit, OnDestroy, ViewChild, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-about',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent implements AfterViewInit, OnDestroy {
  langService = inject(LanguageService);
  platformId = inject(PLATFORM_ID);
  content = this.langService.content;

  @ViewChild('aboutImage') aboutImage!: ElementRef;

  isImageActive = false;
  private observer: IntersectionObserver | null = null;

  ngAfterViewInit() {
    // Only run in browser
    if (isPlatformBrowser(this.platformId)) {
      this.initIntersectionObserver();
    }
  }

  private initIntersectionObserver() {
    const options = {
      root: null, // use viewport
      threshold: 0.5 // trigger when 50% visible
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // Only trigger automation on mobile (hover: none)
        // On desktop, we want to allow standard hover to feel separate, 
        // but scroll activation still looks cool.
        if (window.matchMedia('(hover: none)').matches) {
          this.isImageActive = entry.isIntersecting;
        }
      });
    }, options);

    if (this.aboutImage) {
      this.observer.observe(this.aboutImage.nativeElement);
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
