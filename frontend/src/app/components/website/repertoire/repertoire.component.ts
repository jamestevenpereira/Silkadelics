import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-repertoire',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './repertoire.component.html'
})
export class RepertoireComponent {
  private langService = inject(LanguageService);
  content = this.langService.content;
}
