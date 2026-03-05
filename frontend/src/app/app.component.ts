import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WhatsAppChatComponent } from './components/shared/whatsapp-chat/whatsapp-chat.component';
import { LightboxService } from './core/services/lightbox.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WhatsAppChatComponent],
  template: `
    <router-outlet></router-outlet>
    <app-whatsapp-chat></app-whatsapp-chat>

    <!-- Global Lightbox — rendered at root level to escape all stacking contexts -->
    @if (lightbox.isOpen()) {
    <div class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
      (click)="lightbox.close()">
      <button class="absolute top-6 right-6 text-white hover:text-gold transition-colors"
        (click)="lightbox.close()">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <img [src]="lightbox.imageUrl()" [alt]="lightbox.imageAlt()"
        class="max-h-[90vh] max-w-full object-contain rounded-2xl shadow-2xl"
        (click)="$event.stopPropagation()">
    </div>
    }
  `,
  styleUrl: './app.component.css'
})
export class AppComponent {
  lightbox = inject(LightboxService);
}
