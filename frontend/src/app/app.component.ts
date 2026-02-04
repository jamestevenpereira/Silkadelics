import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { WhatsAppChatComponent } from './components/shared/whatsapp-chat/whatsapp-chat.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, WhatsAppChatComponent],
  template: `
    <router-outlet></router-outlet>
    <app-whatsapp-chat></app-whatsapp-chat>
  `,
  styleUrl: './app.component.css'
})
export class AppComponent { }
