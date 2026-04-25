import { Component, signal, OnInit, OnDestroy, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-scroll-to-top',
  standalone: true,
  imports: [],
  templateUrl: './scroll-to-top.component.html',
})
export class ScrollToTopComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  isVisible = signal(false);

  private onScroll = (): void => {
    this.isVisible.set(window.scrollY > 400);
  };

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.addEventListener('scroll', this.onScroll, { passive: true });
  }

  ngOnDestroy(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    window.removeEventListener('scroll', this.onScroll);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
