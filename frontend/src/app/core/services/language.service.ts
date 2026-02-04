import { Injectable, signal } from '@angular/core';
import { Content } from '../../shared/models/content.model';
import { CONTENT_PT, CONTENT_EN } from '../../shared/data/content.data';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private currentLang = signal<'pt' | 'en'>('pt');

    content = signal<Content>(CONTENT_PT);

    constructor() {
        // Load preference from localStorage if available
        const savedLang = localStorage.getItem('lang') as 'pt' | 'en';
        if (savedLang) {
            this.setLanguage(savedLang);
        }
    }

    setLanguage(lang: 'pt' | 'en') {
        this.currentLang.set(lang);
        this.content.set(lang === 'pt' ? CONTENT_PT : CONTENT_EN);
        localStorage.setItem('lang', lang);
    }

    getLanguage() {
        return this.currentLang();
    }
}
