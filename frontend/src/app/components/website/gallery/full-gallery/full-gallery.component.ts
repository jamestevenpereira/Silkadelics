import { Component, HostListener, inject, OnInit, signal } from '@angular/core';

import { SupabaseService } from '../../../../core/services/supabase.service';
import { LanguageService } from '../../../../core/services/language.service';
import { LightboxService } from '../../../../core/services/lightbox.service';
import { SeoService } from '../../../../core/services/seo.service';
import { RouterLink } from '@angular/router';
import { SafePipe } from '../../../../shared/pipes/safe.pipe';

@Component({
  selector: 'app-full-gallery',
  standalone: true,
  imports: [RouterLink, SafePipe],
  templateUrl: './full-gallery.component.html',
  styleUrl: './full-gallery.component.css'
})
export class FullGalleryComponent implements OnInit {
  supabaseService = inject(SupabaseService);
  langService = inject(LanguageService);
  lightbox = inject(LightboxService);
  seoService = inject(SeoService);

  content = this.langService.content;
  galleryItems = signal<any[]>([]);
  loading = signal<boolean>(true);

  // Pagination
  currentPage = signal<number>(1);
  pageSize = 10;
  totalItems = signal<number>(0);
  totalPages = signal<number>(0);

  // Lightbox
  lightboxOpen = signal<boolean>(false);
  lightboxItem = signal<any | null>(null);

  // Mobile Interaction
  activeItemId = signal<string | null>(null);

  @HostListener('document:touchstart', ['$event'])
  onDocumentTouch(event: TouchEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.interactive-gallery-card')) {
      this.activeItemId.set(null);
    }
  }

  openLightbox(item: any) {
    if (item.type === 'image') {
      if (window.matchMedia('(hover: none)').matches) {
        // Touch device logic: first tap activates overlay, second tap opens lightbox
        if (this.activeItemId() === item.id) {
          this.lightboxItem.set(item);
          this.lightboxOpen.set(true);
          document.body.style.overflow = 'hidden';
          this.activeItemId.set(null); // Optional: reset active state when opening lightbox
        } else {
          this.activeItemId.set(item.id);
        }
      } else {
        // Desktop logic: open lightbox immediately
        this.lightboxItem.set(item);
        this.lightboxOpen.set(true);
        document.body.style.overflow = 'hidden';
      }
    }
  }

  closeLightbox() {
    this.lightboxOpen.set(false);
    this.lightboxItem.set(null);
    document.body.style.overflow = '';
  }

    async ngOnInit() {
    this.seoService.updateMeta({
      title: this.langService.getLanguage() === 'pt' ? 'Galeria' : 'Gallery',
      description: this.langService.getLanguage() === 'pt'
        ? 'Galeria de fotos e vídeos dos eventos e atuações da Silkadelics'
        : 'Photo and video gallery of Silkadelics\' live performances and events'
    });
    await this.loadGallery();
  }

  async loadGallery() {
    this.loading.set(true);
    const { data, count } = await this.supabaseService.getGalleryPaginated(this.currentPage(), this.pageSize);
    if (data) {
      this.galleryItems.set(data);
      this.totalItems.set(count || 0);
      this.totalPages.set(Math.ceil((count || 0) / this.pageSize));
    }
    this.loading.set(false);
  }

  async downloadImage(url: string, filename: string) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = filename || 'woodplan-gallery-image.jpg';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
      this.loadGallery();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
      this.loadGallery();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
