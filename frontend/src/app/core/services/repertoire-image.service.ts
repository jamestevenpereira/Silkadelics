import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SupabaseService } from './supabase.service';

export interface RepertoireImage {
  url: string;
  name: string;
  alt: string;
}

export type RepertoireEra = '70-90' | '2000+' | '2010+';

const BUCKET = 'repertoire';

@Injectable({ providedIn: 'root' })
export class RepertoireImageService {
  private supabase = inject(SupabaseService);
  private platformId = inject(PLATFORM_ID);

  recommendations = signal<RepertoireImage[]>([]);
  library70s90s = signal<RepertoireImage[]>([]);
  library2000s = signal<RepertoireImage[]>([]);
  library2010s = signal<RepertoireImage[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  async loadRecommendations(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    this.loading.set(true);
    this.error.set(null);
    try {
      const images = await this.fetchFolder('our-recommendations');
      this.recommendations.set(images);
    } catch (err: any) {
      this.error.set(err?.message ?? 'Failed to load recommendations');
    } finally {
      this.loading.set(false);
    }
  }

  async loadLibraryEra(era: RepertoireEra): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    this.loading.set(true);
    this.error.set(null);
    try {
      const images = await this.fetchFolder(era);
      if (era === '70-90') this.library70s90s.set(images);
      else if (era === '2000+') this.library2000s.set(images);
      else this.library2010s.set(images);
    } catch (err: any) {
      this.error.set(err?.message ?? `Failed to load ${era} library`);
    } finally {
      this.loading.set(false);
    }
  }

  async loadAll(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    this.loading.set(true);
    this.error.set(null);
    try {
      await Promise.all([
        this.fetchFolder('our-recommendations').then(i => this.recommendations.set(i)),
        this.fetchFolder('70-90').then(i => this.library70s90s.set(i)),
        this.fetchFolder('2000+').then(i => this.library2000s.set(i)),
        this.fetchFolder('2010+').then(i => this.library2010s.set(i)),
      ]);
    } catch (err: any) {
      this.error.set(err?.message ?? 'Failed to load repertoire images');
    } finally {
      this.loading.set(false);
    }
  }

  private async fetchFolder(folder: string): Promise<RepertoireImage[]> {
    const { data, error } = await this.supabase.client
      .storage
      .from(BUCKET)
      .list(folder, { sortBy: { column: 'name', order: 'asc' } });

    if (error) {
      console.error(`[RepertoireImageService] Failed to list bucket folder "${folder}"`, error);
      throw new Error(`Unable to load images from "${folder}". Check Supabase bucket policies and folder names.`);
    }
    if (!data) return [];

    const allowedExtensions = ['.webp', '.jpg', '.jpeg', '.png'];
    return data
      .filter(f => allowedExtensions.some(ext => f.name.toLowerCase().endsWith(ext)))
      .map(f => {
        const url = this.supabase.client.storage.from(BUCKET).getPublicUrl(`${folder}/${f.name}`).data.publicUrl;
        return { url, name: f.name, alt: f.name.replace('.webp', '').replace(/-/g, ' ') };
      });
  }
}
