import { Injectable, signal, inject, PLATFORM_ID, computed } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Content } from '../../shared/models/content.model';
import { CONTENT_PT, CONTENT_EN } from '../../shared/data/content.data';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private platformId = inject(PLATFORM_ID);
    private language = signal<'pt' | 'en'>('en');

    content = computed(() => this.language() === 'pt' ? CONTENT_PT : CONTENT_EN);

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            // Load preference from localStorage if available
            const savedLang = localStorage.getItem('selectedLanguage') as 'pt' | 'en';
            if (savedLang) {
                this.language.set(savedLang);
            } else {
                // If no language is saved, default to 'en' and save it
                localStorage.setItem('selectedLanguage', 'en');
            }
            this.updateHtmlLang(this.language());
        }
    }

    setLanguage(lang: 'pt' | 'en') {
        this.language.set(lang);

        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('selectedLanguage', lang);
            this.updateHtmlLang(lang);
        }
    }

    getLanguage() {
        return this.language();
    }

    public updateHtmlLang(lang: 'pt' | 'en') {
        if (isPlatformBrowser(this.platformId)) {
            document.documentElement.lang = lang === 'pt' ? 'pt-PT' : 'en';
        }
    }
}
