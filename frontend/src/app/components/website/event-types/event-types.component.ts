import { Component, HostListener, inject } from '@angular/core';

import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-event-types',
  standalone: true,
  imports: [],
  templateUrl: './event-types.component.html',
  styleUrl: './event-types.component.css'
})
export class EventTypesComponent {
  langService = inject(LanguageService);
  content = this.langService.content;

  activeCard: string | null = null;

  @HostListener('document:touchstart', ['$event'])
  onDocumentTouch(event: TouchEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.interactive-card')) {
      this.activeCard = null;
    }
  }

  onCardClick(event: Event, typeId: string) {
    if (window.matchMedia('(hover: none)').matches) {
      if (this.activeCard !== typeId) {
        event.preventDefault();
        this.activeCard = typeId;
      }
    }
  }
}
