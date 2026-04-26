import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { LanguageService } from '../../../../core/services/language.service';
import { SeoService } from '../../../../core/services/seo.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-privacy-policy',
    standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [RouterLink],
    templateUrl: './privacy-policy.component.html',
    styles: []
})
export class PrivacyPolicyComponent implements OnInit {
    seoService = inject(SeoService);
    langService = inject(LanguageService);

    ngOnInit() {
        const lang = this.langService.getLanguage();
        this.seoService.updateMeta({
            title: lang === 'pt' ? 'Política de Privacidade' : 'Privacy Policy',
            description: lang === 'pt'
                ? 'Política de Privacidade da Silkadelics. Saiba como recolhemos, tratamos e protegemos os seus dados pessoais em conformidade com o RGPD.'
                : 'Silkadelics Privacy Policy. Learn how we collect, process, and protect your personal data in compliance with GDPR.'
        });
    }
}
