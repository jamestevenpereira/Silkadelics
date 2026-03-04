import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { LanguageService } from './language.service';

@Injectable({
    providedIn: 'root'
})
export class SeoService {
    private platformId = inject(PLATFORM_ID);
    private title = inject(Title);
    private meta = inject(Meta);
    private router = inject(Router);
    private langService = inject(LanguageService);

    constructor() {
        this.router.events.pipe(
            filter(event => event instanceof NavigationEnd)
        ).subscribe(() => {
            // Default SEO update on route change if not handled specifically
            this.resetMeta();
        });
    }

    updateMeta(config: {
        title?: string;
        description?: string;
        image?: string;
        url?: string;
        type?: string;
    }) {
        const isBrowser = isPlatformBrowser(this.platformId);
        const lang = this.langService.getLanguage();
        const baseTitle = 'Silkadelics';
        const finalTitle = config.title ? `${config.title} | ${baseTitle}` : baseTitle;

        // Localized default description
        const defaultDesc = lang === 'pt'
            ? 'A experiência synthwave definitiva para o seu evento. Silkadelics traz a energia dos anos 80 com sofisticação moderna.'
            : 'The ultimate synthwave experience for your event. Silkadelics brings the energy of the 80s with modern sophistication.';

        const description = config.description || defaultDesc;
        const image = config.image || 'assets/og-image.jpg';

        let url = config.url;
        if (!url && isBrowser) {
            url = window.location.href;
        } else if (!url) {
            url = 'https://silkadelics.com'; // Fallback for SSR
        }

        const type = config.type || 'website';

        this.title.setTitle(finalTitle);

        // Standard Meta Tags
        this.meta.updateTag({ name: 'description', content: description });

        // Open Graph
        this.meta.updateTag({ property: 'og:title', content: finalTitle });
        this.meta.updateTag({ property: 'og:description', content: description });
        this.meta.updateTag({ property: 'og:image', content: image });
        this.meta.updateTag({ property: 'og:url', content: url });
        this.meta.updateTag({ property: 'og:type', content: type });

        // Twitter
        this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.meta.updateTag({ name: 'twitter:title', content: finalTitle });
        this.meta.updateTag({ name: 'twitter:description', content: description });
        this.meta.updateTag({ name: 'twitter:image', content: image });
    }

    resetMeta() {
        this.updateMeta({});
    }

    setJsonLd(data: any) {
        if (isPlatformBrowser(this.platformId)) {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.text = JSON.stringify(data);
            document.head.appendChild(script);
        }
    }
}
