import { Component, inject, signal } from '@angular/core';
import { CommonModule, ViewportScroller } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  langService = inject(LanguageService);
  router = inject(Router);
  scroller = inject(ViewportScroller);
  content = this.langService.content;

  isMenuOpen = false;
  isScrolled = false;

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  setLanguage(lang: 'pt' | 'en') {
    this.langService.setLanguage(lang);
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
    }
  }

  scrollToTop() {
    const isHome = this.router.url === '/' || this.router.url.startsWith('/#');
    if (isHome) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      this.router.navigate(['/']);
    }
  }

  goToBooking(): void {
    if (this.isMenuOpen) {
      this.isMenuOpen = false;
    }
    this.router.navigate(['/'], { fragment: 'booking' }).then(() => {
      setTimeout(() => this.scroller.scrollToAnchor('booking'), 300);
    });
  }
}
