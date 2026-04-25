import { Component, inject, signal, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';

const STORAGE_KEY = 'silkadelics_cookie_consent';

@Component({
  selector: 'app-cookie-consent',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cookie-consent.component.html',
})
export class CookieConsentComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  private langService = inject(LanguageService);

  content = this.langService.content;
  isVisible = signal(false);

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      // Small delay so the banner doesn't pop instantly on page load
      setTimeout(() => this.isVisible.set(true), 1500);
    }
  }

  acceptAll(): void {
    this.saveConsent('all');
  }

  acceptNecessary(): void {
    this.saveConsent('necessary');
  }

  private saveConsent(type: 'all' | 'necessary'): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(STORAGE_KEY, type);
    }
    this.isVisible.set(false);
  }
}
