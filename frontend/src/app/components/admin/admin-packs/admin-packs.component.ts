import { Component, inject, OnInit, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-admin-packs',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-packs.component.html',
  styleUrls: ['./admin-packs.component.css']
})
export class AdminPacksComponent implements OnInit {
  supabaseService = inject(SupabaseService);

  packs = signal<any[]>([]);
  loading = signal<boolean>(false);
  showForm = signal<boolean>(false);
  editingId = signal<string | null>(null);

  form = {
    title: '',
    price: '',
    description: '',
    features: [] as string[],
    highlight: false
  };

  featuresText = '';

  async ngOnInit() {
    await this.loadPacks();
  }

  async loadPacks() {
    const { data } = await this.supabaseService.getPacks();
    if (data) this.packs.set(data);
  }

  editPack(pack: any) {
    this.editingId.set(pack.id);
    this.form = { ...pack };
    this.featuresText = pack.features.join('\n');
    this.showForm.set(true);
  }

  updateFeatures(text: string) {
    this.featuresText = text;
    this.form.features = text.split('\n').filter(line => line.trim() !== '');
  }

  cancelEdit() {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  async savePack() {
    this.loading.set(true);
    try {
      if (this.editingId()) {
        await this.supabaseService.updatePack(this.editingId()!, this.form);
      }
      await this.loadPacks();
      this.cancelEdit();
    } catch (error) {
      console.error('Error saving pack:', error);
    } finally {
      this.loading.set(false);
    }
  }
}
