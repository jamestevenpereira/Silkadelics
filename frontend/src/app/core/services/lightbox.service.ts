import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LightboxService {
    readonly isOpen = signal<boolean>(false);
    readonly imageUrl = signal<string>('');
    readonly imageAlt = signal<string>('');

    open(url: string, alt: string = '') {
        this.imageUrl.set(url);
        this.imageAlt.set(alt);
        this.isOpen.set(true);
        document.body.style.overflow = 'hidden';
    }

    close() {
        this.isOpen.set(false);
        this.imageUrl.set('');
        this.imageAlt.set('');
        document.body.style.overflow = '';
    }
}
