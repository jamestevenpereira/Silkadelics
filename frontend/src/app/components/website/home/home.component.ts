import { ChangeDetectionStrategy, Component } from '@angular/core';

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
export class HomeComponent { }
