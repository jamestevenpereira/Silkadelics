import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { LanguageService } from '../../../../core/services/language.service';
import { SeoService } from '../../../../core/services/seo.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-terms-of-service',
    standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink],
    templateUrl: './terms-of-service.component.html',
    styles: []
})
export class TermsOfServiceComponent implements OnInit {
    seoService = inject(SeoService);
    langService = inject(LanguageService);

    ngOnInit() {
        const lang = this.langService.getLanguage();
        this.seoService.updateMeta({
            title: lang === 'pt' ? 'Termos e Condições' : 'Terms and Conditions',
            description: lang === 'pt'
                ? 'Termos e Condições da Silkadelics. Conheça as políticas de reserva, pagamento, cancelamento e utilização dos nossos serviços.'
                : 'Silkadelics Terms and Conditions. Learn about booking, payment, cancellation policies, and the use of our services.'
        });
    }
}
