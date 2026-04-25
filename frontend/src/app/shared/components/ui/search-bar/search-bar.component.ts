import { Component, EventEmitter, Input, Output, signal, computed, ElementRef, ViewChild, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, CircleDot } from 'lucide-angular';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
  animations: [
    trigger('containerGrow', [
      state('focused', style({ width: '450px', transform: 'scale(1.02)' })),
      state('unfocused', style({ width: '320px', transform: 'scale(1)' })),
      transition('unfocused <=> focused', animate('400ms cubic-bezier(0.175, 0.885, 0.32, 1.275)')),
    ]),
    trigger('suggestionList', [
      transition(':enter', [
        style({ opacity: 0, height: 0, transform: 'translateY(10px)' }),
        animate('200ms ease-out', style({ opacity: 1, height: '*', transform: 'translateY(0)' })),
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, height: 0, transform: 'translateY(10px)' })),
      ]),
    ]),
    trigger('suggestionItem', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px) scale(0.95)' }),
        animate('{{delay}}ms cubic-bezier(0.34, 1.56, 0.64, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' })),
      ], { params: { delay: 300 } }),
    ]),
  ]
})
export class SearchBarComponent implements OnInit {
  @Input() placeholder = 'Search...';
  @Output() onSearch = new EventEmitter<string>();

  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  isFocused = signal(false);
  searchQuery = signal('');
  isAnimating = signal(false);
  isClicked = signal(false);
  mousePosition = signal({ x: 0, y: 0 });

  suggestionsData: string[] = [];

  suggestions = computed(() => {
    const query = this.searchQuery().toLowerCase();
    if (!query) return [];
    return this.suggestionsData.filter(item => item.toLowerCase().includes(query));
  });

  particles = Array.from({ length: 18 }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 1.5,
    duration: Math.random() * 1.5 + 1.5,
    x: (Math.random() - 0.5) * 40,
    y: (Math.random() - 0.5) * 40,
    scale: Math.random() * 0.8 + 0.4
  }));

  clickParticles = signal<{ x: number, y: number, tx: number, ty: number, scale: number, color: string, duration: number }[]>([]);

  readonly searchIcon = Search;
  readonly dotIcon = CircleDot;

  ngOnInit() {}

  handleSearch(value: string) {
    this.searchQuery.set(value);
  }

  handleSubmit(e?: Event) {
    if (e) e.preventDefault();
    const query = this.searchQuery().trim();
    if (query) {
      this.onSearch.emit(query);
      this.isAnimating.set(true);
      setTimeout(() => this.isAnimating.set(false), 1000);
    }
  }

  handleMouseMove(e: MouseEvent) {
    if (this.isFocused()) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      this.mousePosition.set({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  }

  handleClick(e: MouseEvent) {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    this.mousePosition.set({ x, y });
    this.isClicked.set(true);
    
    // Generate click particles
    const newParticles = Array.from({ length: 14 }, () => ({
      x,
      y,
      tx: x + (Math.random() - 0.5) * 160,
      ty: y + (Math.random() - 0.5) * 160,
      scale: Math.random() * 0.8 + 0.2,
      duration: Math.random() * 0.8 + 0.5,
      color: Math.random() > 0.5 ? 'rgba(255, 45, 149, 0.8)' : 'rgba(157, 0, 255, 0.8)' // Primary Pink or Purple Neon
    }));
    
    this.clickParticles.set(newParticles);
    
    setTimeout(() => {
      this.isClicked.set(false);
      this.clickParticles.set([]);
    }, 800);
  }

  onFocus() {
    this.isFocused.set(true);
  }

  onBlur() {
    // Timeout to allow clicking on suggestions
    setTimeout(() => this.isFocused.set(false), 200);
  }

  selectSuggestion(suggestion: string) {
    this.searchQuery.set(suggestion);
    this.onSearch.emit(suggestion);
    this.isFocused.set(false);
  }

  get isUnsupportedBrowser() {
    if (typeof window === 'undefined') return false;
    const ua = navigator.userAgent.toLowerCase();
    const isSafari = ua.includes('safari') && !ua.includes('chrome') && !ua.includes('chromium');
    const isChromeOniOS = ua.includes('crios');
    return isSafari || isChromeOniOS;
  }
}
