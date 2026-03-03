import { Component, inject } from '@angular/core';

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
}
