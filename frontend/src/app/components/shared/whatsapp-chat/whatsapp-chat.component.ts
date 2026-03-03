import { Component, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-whatsapp-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './whatsapp-chat.component.html',
  styleUrl: './whatsapp-chat.component.css'
})
export class WhatsAppChatComponent {
  phoneNumber = '351968464987';
  userMessage = '';
  isOpen = signal(false);

  toggleChat() {
    this.isOpen.set(!this.isOpen());
  }

  sendWhatsApp() {
    const finalMessage = this.userMessage.trim() || 'Olá! Gostaria de saber mais sobre Silkadelics.';
    const url = `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(finalMessage)}`;
    window.open(url, '_blank');
    this.isOpen.set(false);
    this.userMessage = '';
  }
}
