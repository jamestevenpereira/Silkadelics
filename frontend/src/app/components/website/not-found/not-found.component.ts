import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../../core/services/language.service';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './not-found.component.html',
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
      background-color: #050505;
    }
  `]
})
export class NotFoundComponent implements OnInit {
  langService = inject(LanguageService);
  seoService = inject(SeoService);
  content = this.langService.content;

  ngOnInit() {
    this.seoService.updateMeta({
      title: this.langService.getLanguage() === 'pt' ? 'Página Não Encontrada' : 'Page Not Found',
      description: 'The page you are looking for does not exist.',
      type: 'website'
    });
  }
}
