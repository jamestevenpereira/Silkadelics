import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
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
    private document = inject(DOCUMENT);

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
            ? 'Banda ao vivo premium para casamentos, eventos corporativos e festas privadas. Repertório versátil de rock, pop, funk, soul e dance.'
            : 'Premium live band for weddings, corporate events, and private parties. Versatile repertoire of rock, pop, funk, soul, and dance.';

        const description = config.description || defaultDesc;
        const image = config.image || 'https://silkadelics.pt/assets/images/about-band.jpg';

        let url = config.url;
        if (!url && isBrowser) {
            url = window.location.href;
        } else if (!url) {
            url = 'https://silkadelics.pt'; // Fallback for SSR
        }

        const type = config.type || 'website';

        this.title.setTitle(finalTitle);

        // Standard Meta Tags
        this.meta.updateTag({ name: 'description', content: description });
        this.meta.removeTag('name="keywords"'); // Explicitly remove keywords if present

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

        // Canonical URL
        this.setCanonical(url);
    }

    setCanonical(url: string): void {
        const doc = this.document;
        const existing = doc.querySelector("link[rel='canonical']");
        if (existing) {
            existing.setAttribute('href', url);
        } else {
            const link = doc.createElement('link');
            link.setAttribute('rel', 'canonical');
            link.setAttribute('href', url);
            doc.head.appendChild(link);
        }
    }

    resetMeta() {
        this.updateMeta({});
    }

    setJsonLd(data: any, id?: string) {
        const doc = this.document;
        const scriptId = id ?? 'ld-json-default';

        const existing = doc.getElementById(scriptId);
        if (existing) existing.remove();

        const script = doc.createElement('script');
        script.type = 'application/ld+json';
        script.id = scriptId;
        script.text = JSON.stringify(data);
        doc.head.appendChild(script);
    }
}
