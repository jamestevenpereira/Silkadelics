import { Injectable, signal, inject, PLATFORM_ID, computed, effect } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { Content } from '../../shared/models/content.model';

@Injectable({
    providedIn: 'root'
})
export class LanguageService {
    private platformId = inject(PLATFORM_ID);
    private document = inject(DOCUMENT);
    private http = inject(HttpClient);
    
    private language = signal<'pt' | 'en'>('pt');
    private contentData = signal<Content | null>(null);

    content = computed(() => this.contentData() || {} as any);

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            const savedLang = localStorage.getItem('selectedLanguage') as 'pt' | 'en';
            if (savedLang) {
                this.language.set(savedLang);
            }
        }
    }

    async init() {
        await this.loadTranslations(this.language());
    }

    private async loadTranslations(lang: 'pt' | 'en') {
        try {
            const data = await firstValueFrom(
                this.http.get<Content>(`/assets/i18n/${lang}.json`)
            );
            this.contentData.set(data);
        } catch (error) {
            console.error(`Failed to load translations for ${lang}`, error);
        }
    }

    async setLanguage(lang: 'pt' | 'en') {
        this.language.set(lang);
        await this.loadTranslations(lang);

        if (isPlatformBrowser(this.platformId)) {
            localStorage.setItem('selectedLanguage', lang);
            this.updateHtmlLang(lang);
        }
        // Metadata is now handled by components calling SeoService which uses the content() signal
    }

    getLanguage() {
        return this.language();
    }

    public updateHtmlLang(lang: 'pt' | 'en') {
        if (isPlatformBrowser(this.platformId)) {
            this.document.documentElement.lang = lang === 'pt' ? 'pt-PT' : 'en';
        }
    }
}
