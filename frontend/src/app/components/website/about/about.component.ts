import { Component, HostListener, inject } from '@angular/core';

import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  langService = inject(LanguageService);
  content = this.langService.content;

  isImageActive = false;

  @HostListener('document:touchstart', ['$event'])
  onDocumentTouch(event: TouchEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.interactive-about-image')) {
      this.isImageActive = false;
    }
  }

  onImageClick() {
    if (window.matchMedia('(hover: none)').matches) {
      this.isImageActive = !this.isImageActive;
    }
  }
}
