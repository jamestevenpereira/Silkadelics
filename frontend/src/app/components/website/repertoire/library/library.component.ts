import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { CarouselComponent } from '../../../../shared/components/carousel/carousel.component';
import { RepertoireImageService, RepertoireEra } from '../../../../core/services/repertoire-image.service';
import { LanguageService } from '../../../../core/services/language.service';

interface EraTab {
  id: RepertoireEra;
  labelKey: string;
}

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent, CarouselComponent],
  templateUrl: './library.component.html'
})
export class LibraryComponent implements OnInit {
  private imageService = inject(RepertoireImageService);
  private langService = inject(LanguageService);
  private router = inject(Router);
  private scroller = inject(ViewportScroller);

  content = this.langService.content;
  loading = this.imageService.loading;

  activeEra = signal<RepertoireEra>('70-90');

  // Tab definitions — label resolved via content() in template
  tabs: EraTab[] = [
    { id: '70-90', labelKey: '70-90' },
    { id: '2000+', labelKey: '2000+' },
    { id: '2010+', labelKey: '2010+' },
  ];

  activeImages = computed(() => {
    const era = this.activeEra();
    if (era === '70-90') return this.imageService.library70s90s();
    if (era === '2000+') return this.imageService.library2000s();
    return this.imageService.library2010s();
  });

  loadedEras = signal<Set<RepertoireEra>>(new Set(['70-90']));

  async ngOnInit(): Promise<void> {
    await this.imageService.loadLibraryEra('70-90');
    this.loadedEras.update(s => new Set([...s, '70-90']));
  }

  async selectEra(era: RepertoireEra): Promise<void> {
    this.activeEra.set(era);
    if (!this.loadedEras().has(era)) {
      await this.imageService.loadLibraryEra(era);
      this.loadedEras.update(s => new Set([...s, era]));
    }
  }

  isActive(era: RepertoireEra): boolean {
    return this.activeEra() === era;
  }

  goToBooking(): void {
    this.router.navigate(['/'], { fragment: 'booking' }).then(() => {
      setTimeout(() => this.scroller.scrollToAnchor('booking'), 300);
    });
  }
}
