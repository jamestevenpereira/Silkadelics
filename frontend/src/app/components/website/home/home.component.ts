import { ChangeDetectionStrategy, Component, AfterViewInit, OnDestroy, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { NavbarComponent } from '../navbar/navbar.component';
import { HeroComponent } from '../hero/hero.component';
import { AboutComponent } from '../about/about.component';
import { EventTypesComponent } from '../event-types/event-types.component';
import { PacksComponent } from '../packs/packs.component';
import { MediaGalleryComponent } from '../media-gallery/media-gallery.component';
import { BandMembersComponent } from '../band-members/band-members.component';
import { TestimonialsComponent } from '../testimonials/testimonials.component';
import { FaqComponent } from '../faq/faq.component';
import { BookingFormComponent } from '../booking-form/booking-form.component';
import { FooterComponent } from '../footer/footer.component';
import { PartnersComponent } from '../partners/partners.component';
import { RepertoireComponent } from '../repertoire/repertoire.component';

@Component({
  selector: 'app-home',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NavbarComponent,
    HeroComponent,
    AboutComponent,
    EventTypesComponent,
    PacksComponent,
    MediaGalleryComponent,
    BandMembersComponent,
    TestimonialsComponent,
    FaqComponent,
    BookingFormComponent,
    FooterComponent,
    PartnersComponent,
    RepertoireComponent
],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private platformId = inject(PLATFORM_ID);
  private fragmentSub?: Subscription;

  ngAfterViewInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.fragmentSub = this.route.fragment.subscribe(fragment => {
      if (!fragment) return;
      this.scrollToFragmentStable(fragment);
    });
  }

  // Re-snaps scroll to the target several times so that as @defer blocks
  // above replace their placeholders with real (taller) content, the final
  // landing position is still the requested anchor and not drift below it.
  private scrollToFragmentStable(id: string): void {
    [80, 450, 1000, 1700, 2500].forEach(delay => {
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'auto', block: 'start' });
      }, delay);
    });
  }

  ngOnDestroy() {
    this.fragmentSub?.unsubscribe();
  }
}
