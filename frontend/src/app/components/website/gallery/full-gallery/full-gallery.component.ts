import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../../core/services/supabase.service';
import { LanguageService } from '../../../../core/services/language.service';
import { RouterLink } from '@angular/router';
import { SafePipe } from '../../../../shared/pipes/safe.pipe';

@Component({
  selector: 'app-full-gallery',
  standalone: true,
  imports: [CommonModule, RouterLink, SafePipe],
  templateUrl: './full-gallery.component.html',
  styleUrl: './full-gallery.component.css'
})
export class FullGalleryComponent implements OnInit {
  supabaseService = inject(SupabaseService);
  langService = inject(LanguageService);

  content = this.langService.content;
  galleryItems = signal<any[]>([]);
  loading = signal<boolean>(true);

  // Pagination
  currentPage = signal<number>(1);
  pageSize = 9;
  totalItems = signal<number>(0);
  totalPages = signal<number>(0);

  async ngOnInit() {
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
