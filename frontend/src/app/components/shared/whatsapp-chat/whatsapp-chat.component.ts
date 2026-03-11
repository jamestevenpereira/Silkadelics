import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-whatsapp-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './whatsapp-chat.component.html',
  styleUrl: './whatsapp-chat.component.css'
})
export class WhatsAppChatComponent {
  private langService = inject(LanguageService);
  content = this.langService.content;

  phoneNumber = '351927245662';
  userMessage = '';
  isOpen = signal(false);

  toggleChat() {
    this.isOpen.set(!this.isOpen());
  }

  sendWhatsApp() {
    const finalMessage = this.userMessage.trim() || this.content().whatsapp.defaultMessage;
    const url = `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(finalMessage)}`;
    window.open(url, '_blank');
    this.isOpen.set(false);
    this.userMessage = '';
  }
}
