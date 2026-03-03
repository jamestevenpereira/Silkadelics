import { Component, inject, OnInit, signal, computed } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../core/services/supabase.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-repertoire',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './repertoire.component.html',
  styles: [`
    :host { display: block; }
    .glass-card {
      background: rgba(255, 255, 255, 0.03);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
  `]
})
export class RepertoireComponent implements OnInit {
  supabaseService = inject(SupabaseService);
  langService = inject(LanguageService);

  content = this.langService.content;
  repertoire = signal<any[]>([]);
  searchQuery = signal<string>('');
  selectedCategory = signal<string>('');

  // Pagination
  currentPage = signal<number>(1);
  pageSize = 10;

  filteredRepertoire = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const category = this.selectedCategory();
    let items = this.repertoire();

    if (query) {
      items = items.filter(item =>
        item.title.toLowerCase().includes(query) ||
        item.artist.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query)
      );
    }

    if (category) {
      items = items.filter(item => item.category === category);
    }

    return items;
  });

  paginatedRepertoire = computed(() => {
    const items = this.filteredRepertoire();
    const start = (this.currentPage() - 1) * this.pageSize;
    const end = start + this.pageSize;
    return items.slice(start, end);
  });

  totalPages = computed(() => {
    return Math.ceil(this.filteredRepertoire().length / this.pageSize);
  });

  categories = computed(() => {
    const cats = this.repertoire().map(item => item.category);
    return [...new Set(cats)].sort();
  });

  async ngOnInit() {
    const { data } = await this.supabaseService.getRepertoire();
    if (data) this.repertoire.set(data);
  }

  onSearchChange(query: string) {
    this.searchQuery.set(query);
    this.currentPage.set(1); // Reset to first page on search
  }

  onCategoryChange(category: string) {
    this.selectedCategory.set(category);
    this.currentPage.set(1); // Reset to first page on filter
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPage.set(page);
    }
  }

  nextPage() {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  previousPage() {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }
}
