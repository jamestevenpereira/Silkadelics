import { Component, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';

import { AdminTeamComponent } from '../admin-team/admin-team.component';
import { AdminRepertoireComponent } from '../admin-repertoire/admin-repertoire.component';
import { AdminTestimonialsComponent } from '../admin-testimonials/admin-testimonials.component';
import { AdminPacksComponent } from '../admin-packs/admin-packs.component';
import { AdminBookingsComponent } from '../admin-bookings/admin-bookings.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [FormsModule, AdminTeamComponent, AdminRepertoireComponent, AdminTestimonialsComponent, AdminPacksComponent, AdminBookingsComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  private platformId = inject(PLATFORM_ID);
  activeTab: 'general' | 'team' | 'repertoire' | 'testimonials' | 'packs' | 'bookings' = 'general';
  gallery: any[] = [];
  promoVideoUrl = '';
  loading = false;
  uploading = false;

  // Pagination
  currentPage = 1;
  pageSize = 9;
  totalItems = 0;
  totalPages = 0;

  constructor(private supabaseService: SupabaseService, private router: Router) { }

  async ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      await this.supabaseService.waitForAuth();
      const { data: { session } } = await this.supabaseService.getSession();
      const user = session?.user || await this.supabaseService.getUser();

      if (!user) {
        this.router.navigate(['/admin']);
        return;
      }
      await this.loadData();
    }
  }

  async loadData() {
    this.loading = true;
    try {
      const { data: galleryData, count } = await this.supabaseService.getGalleryPaginated(this.currentPage, this.pageSize);
      this.gallery = galleryData || [];
      this.totalItems = count || 0;
      this.totalPages = Math.ceil(this.totalItems / this.pageSize);

      const { data: videoData } = await this.supabaseService.getPromotionalVideo();
      this.promoVideoUrl = videoData?.value || '';
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      this.loading = false;
    }
  }

  async onUpload(event: any) {
    if (!isPlatformBrowser(this.platformId)) return;

    const files = Array.from(event.target.files) as File[];
    if (!files || files.length === 0) return;

    // Limit to 100 files
    const filesToUpload = files.slice(0, 100);

    this.uploading = true;
    let successCount = 0;
    let errorCount = 0;

    try {
      // Dynamic import for browser-only library
      const imageCompression = (await import('browser-image-compression')).default;

      // Get all existing gallery items to determine next number
      const { data: allGallery } = await this.supabaseService.getGallery();
      const existingNumbers = (allGallery || [])
        .map((item: any) => {
          const match = item.title?.match(/woodplan(\d+)/i);
          return match ? parseInt(match[1]) : 0;
        })
        .filter((n: number) => n > 0);

      let nextNumber = existingNumbers.length > 0 ? Math.max(...existingNumbers) + 1 : 1;

      for (const file of filesToUpload) {
        try {
          let fileToUpload: File = file;

          // Compress ALL images — enforce max 1200px and ~80% quality
          if (file.type.startsWith('image/')) {
            const options = {
              maxSizeMB: 0.8,           // Target ~800KB max output
              maxWidthOrHeight: 1200,   // Resize longest side to max 1200px
              useWebWorker: true,
              initialQuality: 0.80,     // 80% quality
              fileType: 'image/webp'    // Always output as WebP for best compression
            };
            fileToUpload = await imageCompression(file, options);
            console.log(`✅ Compressed ${file.name}: ${(file.size / 1024).toFixed(0)}KB → ${(fileToUpload.size / 1024).toFixed(0)}KB (WebP, 1200px max)`);
          }

          // Always save as .webp for images, keep original extension for videos
          const isImage = file.type.startsWith('image/');
          const extension = isImage ? 'webp' : (file.name.split('.').pop() || 'mp4');
          const newFileName = `silkadelics${nextNumber}.${extension}`;
          const storageFileName = `${Date.now()}_${newFileName}`;

          const { error } = await this.supabaseService.uploadFile('gallery', storageFileName, fileToUpload);
          if (error) throw error;

          const publicUrl = await this.supabaseService.getPublicUrl('gallery', storageFileName);
          await this.supabaseService.addToGallery({
            url: publicUrl,
            type: isImage ? 'image' : 'video',
            title: newFileName
          });

          nextNumber++;
          successCount++;
        } catch (err: any) {
          console.error(`Error uploading ${file.name}:`, err);
          errorCount++;
        }
      }

      await this.loadData();

      if (errorCount > 0) {
        alert(`Upload concluído: ${successCount} ficheiro(s) com sucesso, ${errorCount} erro(s).`);
      } else {
        alert(`${successCount} ficheiro(s) carregado(s) com sucesso!`);
      }
    } catch (err: any) {
      alert('Erro no upload: ' + err.message);
      console.error('Error uploading files:', err);
    } finally {
      this.uploading = false;
      event.target.value = '';
    }
  }

  async onDelete(item: any) {
    if (!confirm('Tem a certeza que deseja eliminar este item?')) return;

    try {
      const path = item.url.split('/').pop();
      if (path) {
        await this.supabaseService.deleteFile('gallery', path);
      }
      await this.supabaseService.removeFromGallery(item.id);
      await this.loadData();
    } catch (err) {
      console.error('Error deleting item:', err);
    }
  }

  async onUpdateVideo() {
    try {
      await this.supabaseService.updatePromotionalVideo(this.promoVideoUrl);
      alert('Vídeo promocional atualizado com sucesso!');
    } catch (err) {
      console.error('Error updating video:', err);
    }
  }

  async onLogout() {
    await this.supabaseService.signOut();
    this.router.navigate(['/admin']);
  }

  // Pagination methods
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadData();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadData();
    }
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.loadData();
    }
  }
}
