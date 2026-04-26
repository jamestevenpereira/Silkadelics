import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';

import { SupabaseService } from '../../../core/services/supabase.service';
import { LanguageService } from '../../../core/services/language.service';
import { LightboxService } from '../../../core/services/lightbox.service';
import { RouterLink } from '@angular/router';
import { SafePipe } from '../../../shared/pipes/safe.pipe';

@Component({
  selector: 'app-media-gallery',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SafePipe],
  templateUrl: './media-gallery.component.html',
  styleUrl: './media-gallery.component.css'
})
export class MediaGalleryComponent implements OnInit {
  supabaseService = inject(SupabaseService);
  langService = inject(LanguageService);
  lightbox = inject(LightboxService);

  content = this.langService.content;
  galleryItems = signal<any[]>([]);
  loading = signal<boolean>(true);

  openLightbox(item: any) {
    if (item.type === 'image') {
      this.lightbox.open(item.url, item.title);
    }
  }

  async ngOnInit() {
    await this.loadGallery();
  }

  async loadGallery() {
    this.loading.set(true);
    const { data, error } = await this.supabaseService.getGallery();
    if (data) {
      this.galleryItems.set(data.slice(0, 10).map(item => ({
        ...item,
        url: item.type === 'image'
          ? this.supabaseService.getTransformedUrl(item.url, { width: 300, quality: 50 })
          : item.url
      })));
    }
    this.loading.set(false);
  }
}
