import { Component, inject, OnInit, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-admin-repertoire',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-repertoire.component.html',
  styleUrls: ['./admin-repertoire.component.css']
})
export class AdminRepertoireComponent implements OnInit {
  supabaseService = inject(SupabaseService);

  repertoire = signal<any[]>([]);
  loading = signal<boolean>(false);
  showForm = signal<boolean>(false);
  editingId = signal<number | null>(null);

  // Pagination & Search
  page = signal(1);
  pageSize = signal(10);
  totalItems = signal(0);
  searchQuery = signal('');
  searchTimeout: any;

  Math = Math; // Expose Math to template

  categories = signal<string[]>([
    'Pop / Indie',
    'Rock / Alternative',
    'Jazz',
    'Portuguesa',
    'Soul / Funk / Blues',
    'Acústico',
    'Outro'
  ]);

  itemForm = {
    title: '',
    artist: '',
    category: 'Pop',
    display_order: 0
  };

  async ngOnInit() {
    await this.loadRepertoire();
  }

  async loadRepertoire() {
    const { data, count } = await this.supabaseService.getRepertoire(
      this.page(),
      this.pageSize(),
      this.searchQuery()
    );

    if (data) this.repertoire.set(data);
    if (count !== null) this.totalItems.set(count);
  }

  onSearch() {
    if (this.searchTimeout) clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.page.set(1);
      this.loadRepertoire();
    }, 300);
  }

  nextPage() {
    if (this.page() * this.pageSize() < this.totalItems()) {
      this.page.update(p => p + 1);
      this.loadRepertoire();
    }
  }

  prevPage() {
    if (this.page() > 1) {
      this.page.update(p => p - 1);
      this.loadRepertoire();
    }
  }

  openNewForm() {
    this.editingId.set(null);
    this.itemForm = {
      title: '',
      artist: '',
      category: 'Pop',
      display_order: this.totalItems() + 1
    };
    this.showForm.set(true);
  }

  editItem(item: any) {
    this.editingId.set(item.id);
    this.itemForm = { ...item };
    this.showForm.set(true);
  }

  cancelEdit() {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  async saveItem() {
    this.loading.set(true);
    try {
      if (this.editingId()) {
        await this.supabaseService.updateRepertoireItem(this.editingId()!, this.itemForm);
      } else {
        // Check for duplicate title
        const { data: existing } = await this.supabaseService.client
          .from('repertoire')
          .select('id')
          .ilike('title', this.itemForm.title)
          .limit(1);

        if (existing && existing.length > 0) {
          alert('Já existe uma música com este título no repertório!');
          this.loading.set(false);
          return;
        }

        await this.supabaseService.addRepertoireItem(this.itemForm);
      }
      await this.loadRepertoire();
      this.cancelEdit();
    } catch (error) {
      console.error('Error saving repertoire item:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async deleteItem(id: number) {
    if (confirm('Tem a certeza que deseja remover esta música?')) {
      await this.supabaseService.deleteRepertoireItem(id);
      await this.loadRepertoire();
    }
  }
}
