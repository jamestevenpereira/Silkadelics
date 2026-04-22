import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button-shiny',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      (click)="onClick.emit($event)"
      class="group relative min-w-[200px] h-12 px-8 rounded-lg overflow-hidden transition-all duration-500 cursor-pointer"
      [ngClass]="className"
    >
      <!-- Outer Border Gradient -->
      <div class="absolute inset-0 rounded-lg p-[2px] bg-gradient-to-b from-[#654358] via-[#17092A] to-[#2F0D64]">
        <div class="absolute inset-0 bg-[#170928] rounded-lg opacity-90"></div>
      </div>

      <!-- Inner Glow Layers -->
      <div class="absolute inset-[2px] bg-[#170928] rounded-lg opacity-95"></div>
      <div class="absolute inset-[2px] bg-gradient-to-r from-[#170928] via-[#1d0d33] to-[#170928] rounded-lg opacity-90"></div>
      <div class="absolute inset-[2px] bg-gradient-to-b from-[#654358]/40 via-[#1d0d33] to-[#2F0D64]/30 rounded-lg opacity-80"></div>
      <div class="absolute inset-[2px] bg-gradient-to-br from-[#C787F6]/10 via-[#1d0d33] to-[#2A1736]/50 rounded-lg"></div>

      <!-- Inner Shadow -->
      <div class="absolute inset-[2px] shadow-[inset_0_0_15px_rgba(199,135,246,0.15)] rounded-lg"></div>

      <!-- Label -->
      <div class="relative flex items-center justify-center gap-2">
        <span class="text-lg font-light bg-gradient-to-b from-[#D69DDE] to-[#B873F8] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(199,135,246,0.4)] tracking-tighter">
          {{ label }}
        </span>
      </div>

      <!-- Hover Overlay -->
      <div class="absolute inset-[2px] opacity-0 transition-opacity duration-300 bg-gradient-to-r from-[#2A1736]/20 via-[#C787F6]/10 to-[#2A1736]/20 group-hover:opacity-100 rounded-lg"></div>
    </button>
  `
})
export class ButtonShinyComponent {
  @Input() label = 'Get Access';
  @Input() className = '';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() disabled = false;
  
  @Output() onClick = new EventEmitter<MouseEvent>();
}
