import { Component, ElementRef, AfterViewInit, OnDestroy, ViewChildren, QueryList, inject, OnInit, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';

import { LanguageService } from '../../../core/services/language.service';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-band-members',
  standalone: true,
  imports: [],
  templateUrl: './band-members.component.html',
  styleUrl: './band-members.component.css'
})
export class BandMembersComponent implements OnInit, AfterViewInit, OnDestroy {
  languageService = inject(LanguageService);
  supabaseService = inject(SupabaseService);
  platformId = inject(PLATFORM_ID);

  content = this.languageService.content;
  team = signal<any[]>([]);

  members = computed(() =>
    this.team().filter(m => m.category === 'member')
  );

  activeMemberId = signal<string | null>(null);

  @ViewChildren('memberCard') memberCards!: QueryList<ElementRef>;
  private observer: IntersectionObserver | null = null;
  private sub?: Subscription;

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initIntersectionObserver();

      // Since data is loaded asynchronously, we must wait for changes
      this.sub = this.memberCards.changes.subscribe(() => {
        this.observer?.disconnect();
        this.memberCards.forEach(card => {
          this.observer?.observe(card.nativeElement);
        });
      });
    }
  }

  private initIntersectionObserver() {
    const options = {
      root: null,
      rootMargin: '-30% 0px -30% 0px',
      threshold: 0
    };

    this.observer = new IntersectionObserver((entries) => {
      if (window.innerWidth < 1024) {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const memberId = (entry.target as HTMLElement).getAttribute('data-id');
            if (memberId) {
              this.activeMemberId.set(memberId);
            }
          }
        });
      } else {
        this.activeMemberId.set(null);
      }
    }, options);

    this.memberCards.forEach(card => {
      this.observer?.observe(card.nativeElement);
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  async ngOnInit() {
    const { data } = await this.supabaseService.getTeam();
    if (data && data.length > 0) {
      this.team.set(data.map(member => ({
        ...member,
        img: this.supabaseService.getTransformedUrl(member.img, { width: 400, quality: 80 })
      })));
    }
  }
}
