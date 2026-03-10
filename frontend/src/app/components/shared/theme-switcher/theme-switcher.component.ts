import { Component, PLATFORM_ID, inject, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  template: `
    <div class="fixed top-[120px] right-6 z-[9999] group">
      <!-- Toggle Button -->
      <button (click)="toggleMenu()" 
        class="w-12 h-12 bg-gold text-black rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform hover:bg-white">
        <svg class="w-6 h-6 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      </button>

      <!-- Menu -->
      @if (isOpen()) {
      <div class="absolute top-16 right-0 bg-luxury-charcoal border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col gap-2 min-w-[200px] animate-fade-down">
        <h4 class="text-white text-xs font-bold uppercase tracking-widest mb-2 border-b border-white/10 pb-2">Temas (Teste)</h4>
        
        <button (click)="setTheme('default')" 
          class="flex items-center gap-3 w-full p-2 rounded-xl transition-colors hover:bg-white/5"
          [class.bg-gold\/20]="currentTheme() === 'default'">
          <div class="w-4 h-4 rounded-full pointer-events-none bg-[#05010d] border border-white/20 shadow-[0_0_5px_#ff2d95]"></div>
          <span class="text-xs text-white pointer-events-none">Cyberpunk (Atual)</span>
        </button>

        <button (click)="setTheme('theme-pearl')" 
          class="flex items-center gap-3 w-full p-2 rounded-xl transition-colors hover:bg-white/5"
          [class.bg-gold\/20]="currentTheme() === 'theme-pearl'">
          <div class="w-4 h-4 rounded-full pointer-events-none bg-[#FAFAF7] border border-[#1A1A1A] shadow-[0_0_5px_#D4AF37]"></div>
          <span class="text-xs text-white pointer-events-none">Casamento (Claro)</span>
        </button>

        <button (click)="setTheme('theme-navy')" 
          class="flex items-center gap-3 w-full p-2 rounded-xl transition-colors hover:bg-white/5"
          [class.bg-gold\/20]="currentTheme() === 'theme-navy'">
          <div class="w-4 h-4 rounded-full pointer-events-none bg-[#0A192F] border border-white/20 shadow-[0_0_5px_#B76E79]"></div>
          <span class="text-xs text-white pointer-events-none">Corporativo (Azul)</span>
        </button>

        <button (click)="setTheme('theme-emerald')" 
          class="flex items-center gap-3 w-full p-2 rounded-xl transition-colors hover:bg-white/5"
          [class.bg-gold\/20]="currentTheme() === 'theme-emerald'">
          <div class="w-4 h-4 rounded-full pointer-events-none bg-[#022B22] border border-white/20 shadow-[0_0_5px_#D4AF37]"></div>
          <span class="text-xs text-white pointer-events-none">Premium (Esmeralda)</span>
        </button>
      </div>
      }
    </div>
  `
})
export class ThemeSwitcherComponent {
  private platformId = inject(PLATFORM_ID);
  isOpen = signal<boolean>(false);
  currentTheme = signal<string>('default');

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('silkadelics-theme');
      if (savedTheme) {
        // Use timeout to ensure it happens after initial render if needed, 
        // but setTheme already handles DOM directly.
        setTimeout(() => this.setTheme(savedTheme), 0);
      }
    }
  }

  toggleMenu() {
    this.isOpen.update(v => !v);
  }

  setTheme(themeName: string) {
    if (!isPlatformBrowser(this.platformId)) return;

    // Remove all theme classes first
    document.documentElement.classList.remove('theme-pearl', 'theme-navy', 'theme-emerald');

    // Add new theme if not default
    if (themeName !== 'default') {
      document.documentElement.classList.add(themeName);
    }

    this.currentTheme.set(themeName);
    localStorage.setItem('silkadelics-theme', themeName);

    // Auto close menu after selection
    this.isOpen.set(false);
  }
}
