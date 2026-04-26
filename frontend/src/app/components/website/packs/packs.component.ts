import { ChangeDetectionStrategy, Component, ElementRef, AfterViewInit, OnDestroy, ViewChildren, QueryList, inject, OnInit, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../core/services/supabase.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-packs',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './packs.component.html',
  styles: ``
})
export class PacksComponent implements OnInit, AfterViewInit, OnDestroy {
  private supabaseService = inject(SupabaseService);
  langService = inject(LanguageService);
  platformId = inject(PLATFORM_ID);
  content = this.langService.content;
  packs = signal<any[]>([]);

  activePackId = signal<string | null>(null);

  @ViewChildren('packCard') packCards!: QueryList<ElementRef>;
  private observer: IntersectionObserver | null = null;
  private sub?: Subscription;

  async ngOnInit() {
    const { data } = await this.supabaseService.getPacks();
    if (data) {
      this.packs.set(data);
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initIntersectionObserver();

      this.sub = this.packCards.changes.subscribe(() => {
        this.observer?.disconnect();
        this.packCards.forEach(card => {
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
            const packId = (entry.target as HTMLElement).getAttribute('data-id');
            if (packId) {
              this.activePackId.set(packId);
            }
          }
        });
      } else {
        this.activePackId.set(null);
      }
    }, options);

    this.packCards.forEach(card => {
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

  isEssentialPack(pack: any): boolean {
  return pack.title?.toLowerCase().includes('essencial') ||
         pack.title?.toLowerCase().includes('essential');
  }

  isCompletePack(pack: any): boolean {
    return pack.title?.toLowerCase().includes('completo') ||
          pack.title?.toLowerCase().includes('complete');
  }

  // Get sub-options for Bronze/Silver pack
  getPerformanceOptions(pack: any): string[] {
    const items = pack.features || [];
    // Filter out the main description to get just the options (those starting with '-')
    return items.filter((f: string) => f.startsWith('-')).map((f: string) => {
      // We translate the full string first, then strip the hyphen
      const translated = this.content().packFeatures?.[f] || f;
      return translated.startsWith('-') ? translated.substring(1).trim() : translated;
    });
  }
}
