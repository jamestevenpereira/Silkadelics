import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../core/services/supabase.service';
import { LanguageService } from '../../../core/services/language.service';
import { RouterLink } from '@angular/router';
import { SafePipe } from '../../../shared/pipes/safe.pipe';

@Component({
  selector: 'app-media-gallery',
  standalone: true,
  imports: [CommonModule, RouterLink, SafePipe],
  templateUrl: './media-gallery.component.html',
  styleUrl: './media-gallery.component.css'
})
export class MediaGalleryComponent implements OnInit {
  supabaseService = inject(SupabaseService);
  langService = inject(LanguageService);

  content = this.langService.content;
  galleryItems = signal<any[]>([]);
  loading = signal<boolean>(true);

  async ngOnInit() {
    await this.loadGallery();
  }

  async loadGallery() {
    this.loading.set(true);
    const { data, error } = await this.supabaseService.getGallery();
    if (data) {
      // Show only latest 8 items on home page
      this.galleryItems.set(data.slice(0, 8));
    }
    this.loading.set(false);
  }
}
