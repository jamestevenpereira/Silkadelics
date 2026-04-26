import { Component, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { SupabaseService } from '../../../core/services/supabase.service';
import { ConfirmDialogComponent, ConfirmDialogOptions } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-admin-repertoire',
  standalone: true,
  imports: [FormsModule, DragDropModule, ConfirmDialogComponent],
  templateUrl: './admin-repertoire.component.html',
  styleUrls: ['./admin-repertoire.component.css']
})
export class AdminRepertoireComponent implements OnInit {
  supabaseService = inject(SupabaseService);

  repertoire = signal<any[]>([]);
  recommendedList = signal<any[]>([]);
  loading = signal<boolean>(false);
  savingOrder = signal<boolean>(false);
  showForm = signal<boolean>(false);
  editingId = signal<number | null>(null);
  confirmDialog = signal<(ConfirmDialogOptions & { action: () => void }) | null>(null);

  showConfirm(opts: ConfirmDialogOptions & { action: () => void }) { this.confirmDialog.set(opts); }
  dismissConfirm() { this.confirmDialog.set(null); }
  executeConfirm() { const d = this.confirmDialog(); if (d) { this.confirmDialog.set(null); d.action(); } }

  page = signal(1);
  pageSize = signal(10);
  totalItems = signal(0);
  searchQuery = signal('');
  searchTimeout: any;

  Math = Math;

  eras = ['70-90', '2000+', '2010+'];

  allItems = signal<any[]>([]);

  existingMedleys = (): string[] => {
    const names = this.allItems().map(i => i.medley_name).filter(Boolean);
    return [...new Set(names)];
  };

  itemForm = {
    title: '',
    artist: '',
    category: '70-90',
    audio_url: '',
    is_recommended: false,
    display_order: 0,
    medley_name: ''
  };

  async ngOnInit() {
    await Promise.all([this.loadRepertoire(), this.loadRecommended(), this.loadAllItems()]);
  }

  async loadAllItems() {
    const { data } = await this.supabaseService.getRepertoire(1, 500, '');
    if (data) this.allItems.set(data);
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

  async loadRecommended() {
    const data = await this.supabaseService.getAllRecommended();
    this.recommendedList.set(data);
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
      category: '70-90',
      audio_url: '',
      is_recommended: false,
      display_order: this.totalItems() + 1,
      medley_name: ''
    };
    this.showForm.set(true);
  }

  editItem(item: any) {
    this.editingId.set(item.id);
    this.itemForm = {
      title: item.title,
      artist: item.artist,
      category: item.category,
      audio_url: item.audio_url ?? '',
      is_recommended: item.is_recommended,
      display_order: item.display_order,
      medley_name: item.medley_name ?? ''
    };
    this.showForm.set(true);
  }

  cancelEdit() {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  async saveItem() {
    this.loading.set(true);
    try {
      const payload = {
        title: this.itemForm.title,
        artist: this.itemForm.artist,
        category: this.itemForm.category,
        audio_url: this.itemForm.audio_url,
        is_recommended: this.itemForm.is_recommended,
        display_order: this.itemForm.display_order,
        medley_name: this.itemForm.medley_name?.trim() || null
      };

      if (this.editingId()) {
        await this.supabaseService.updateRepertoireItem(this.editingId()!, payload);
      } else {
        const isDuplicate = await this.supabaseService.checkDuplicateRepertoireTitle(this.itemForm.title);

        if (isDuplicate) {
          alert('Já existe uma música com este título no repertório!');
          this.loading.set(false);
          return;
        }
        await this.supabaseService.addRepertoireItem(payload);
      }

      await Promise.all([this.loadRepertoire(), this.loadRecommended(), this.loadAllItems()]);
      this.cancelEdit();
    } catch (error) {
      console.error('Error saving repertoire item:', error);
    } finally {
      this.loading.set(false);
    }
  }

  deleteItem(id: number) {
    this.showConfirm({
      title: 'Remover Música',
      message: 'Tem a certeza que deseja remover esta música? Esta ação não pode ser desfeita.',
      confirmLabel: 'Remover',
      danger: true,
      action: async () => {
        await this.supabaseService.deleteRepertoireItem(id);
        await Promise.all([this.loadRepertoire(), this.loadRecommended()]);
      }
    });
  }

  async toggleRecommended(item: any) {
    const newValue = !item.is_recommended;
    // Optimistic update
    this.repertoire.update(list =>
      list.map(r => r.id === item.id ? { ...r, is_recommended: newValue } : r)
    );
    await this.supabaseService.updateRepertoireItem(item.id, { is_recommended: newValue });
    await this.loadRecommended();
  }

  async dropRecommended(event: CdkDragDrop<any[]>) {
    const list = [...this.recommendedList()];
    moveItemInArray(list, event.previousIndex, event.currentIndex);
    this.recommendedList.set(list);

    this.savingOrder.set(true);
    try {
      const updates = list.map((item, index) => ({ id: item.id, display_order: index }));
      await this.supabaseService.reorderRepertoire(updates);
      await this.loadRepertoire();
    } catch (error) {
      console.error('Error reordering:', error);
      await this.loadRecommended();
    } finally {
      this.savingOrder.set(false);
    }
  }

  async downloadFullPdf() {
    const { jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');

    const { data } = await this.supabaseService.getRepertoire(1, 500, '');
    if (!data || data.length === 0) return;

    const doc = new jsPDF();
    const date = new Date().toLocaleDateString('pt-PT');

    doc.setFontSize(22);
    doc.text('Silkadelics — Repertório Completo', 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text(`Gerado em: ${date}  ·  Total: ${data.length} músicas`, 14, 30);

    const eras = ['70-90', '2000+', '2010+'];
    let startY = 40;

    for (const era of eras) {
      const songs = data
        .filter((s: any) => s.category === era)
        .sort((a: any, b: any) => a.artist.localeCompare(b.artist, 'pt'));

      if (songs.length === 0) continue;

      doc.setFontSize(13);
      doc.setTextColor(40);
      doc.text(`Era: ${era} (${songs.length} músicas)`, 14, startY);
      startY += 4;

      autoTable(doc, {
        head: [['#', 'Artista', 'Música', 'Medley']],
        body: songs.map((s: any, i: number) => [
          (i + 1).toString().padStart(2, '0'),
          s.artist,
          s.title,
          s.medley_name || '—'
        ]),
        startY,
        theme: 'grid',
        headStyles: { fillColor: [139, 92, 246] },
        styles: { font: 'helvetica', fontSize: 9 },
        margin: { top: 40 },
        didDrawPage: (d: any) => { startY = d.cursor.y; }
      });

      startY = (doc as any).lastAutoTable.finalY + 12;
    }

    const filename = `Silkadelics_Repertorio_Completo_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(filename);
  }
}
