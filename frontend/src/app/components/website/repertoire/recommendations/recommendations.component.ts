import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { LanguageService } from '../../../../core/services/language.service';
import { SupabaseService } from '../../../../core/services/supabase.service';

import { SearchBarComponent } from '../../../../shared/components/ui/search-bar/search-bar.component';
import { ButtonShinyComponent } from '../../../../shared/components/ui/button-shiny/button-shiny.component';
import { SongSuggestionModalComponent } from '../../../../shared/components/ui/song-suggestion-modal/song-suggestion-modal.component';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, NavbarComponent, FooterComponent, SearchBarComponent, ButtonShinyComponent, SongSuggestionModalComponent],
  templateUrl: './recommendations.component.html',
})
export class RecommendationsComponent implements OnInit {
  private langService = inject(LanguageService);
  private router = inject(Router);
  private scroller = inject(ViewportScroller);
  private supabase = inject(SupabaseService);

  content = this.langService.content;
  
  searchQuery = signal('');
  pageSize = signal(10);
  currentPage = signal(1);
  readonly pageSizeOptions = [5, 10, 15];
  showSuggestionModal = signal(false);

  // Audio state
  playingSong = signal<string | null>(null);
  private audioPlayer = new Audio();

  recommendations = signal<{ artist: string; song: string; audioUrl?: string; medleyName?: string }[]>([]);

  async ngOnInit(): Promise<void> {
    await this.loadRecommendations();
    this.audioPlayer.addEventListener('ended', () => {
      this.playingSong.set(null);
    });
  }

  async loadRecommendations() {
    try {
      const data = await this.supabase.getRecommendationsApi();
      // API returns ordered by display_order — preserve that order
      this.recommendations.set(data.map(item => ({
        artist: item.artist,
        song: item.title,
        audioUrl: item.audio_url,
        medleyName: item.medley_name || undefined
      })));
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  }

  private searchDebounceTimer: any = null;

  onSearch(query: string | Event): void {
    const q = typeof query === 'string' ? query : (query.target as HTMLInputElement).value;
    if (this.searchDebounceTimer) clearTimeout(this.searchDebounceTimer);
    this.searchDebounceTimer = setTimeout(() => {
      this.searchQuery.set(q);
      this.currentPage.set(1);
    }, 300);
  }

  filteredRecommendations = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.recommendations();
    
    return this.recommendations().filter(r => 
      r.artist.toLowerCase().includes(query) || 
      r.song.toLowerCase().includes(query)
    );
  });

  sortedRecommendations = computed(() => {
    // Order comes from display_order set in admin — do not re-sort
    return this.filteredRecommendations();
  });

  paginatedRecommendations = computed(() => {
    const page = this.currentPage();
    const size = this.pageSize();
    const start = (page - 1) * size;
    return this.sortedRecommendations().slice(start, start + size);
  });

  totalPages = computed(() => {
    const total = this.sortedRecommendations().length;
    return Math.max(1, Math.ceil(total / this.pageSize()));
  });

  toggleAudio(song: any): void {
    if (!song.audioUrl) return;

    if (this.playingSong() === song.song) {
      this.audioPlayer.pause();
      this.playingSong.set(null);
    } else {
      this.audioPlayer.src = song.audioUrl;
      this.audioPlayer.play();
      this.playingSong.set(song.song);
    }
  }

  totalRecommendations(): number {
    return this.sortedRecommendations().length;
  }

  async downloadPdf(): Promise<void> {
    const { jsPDF } = await import('jspdf');
    const { default: autoTable } = await import('jspdf-autotable');

    const doc = new jsPDF();
    const title = 'Silkadelics - Recomendações de Repertório';
    const date = new Date().toLocaleDateString();

    doc.setFontSize(22);
    doc.text(title, 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Gerado em: ${date}`, 14, 30);

    const tableData = this.sortedRecommendations().map((s, i) => [
      (i + 1).toString().padStart(2, '0'),
      s.artist,
      s.song
    ]);

    autoTable(doc, {
      head: [['#', 'Artista', 'Música']],
      body: tableData,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [139, 92, 246] },
      styles: { font: 'helvetica', fontSize: 10 },
      margin: { top: 40 }
    });

    doc.save('Silkadelics_Recomendacoes.pdf');
  }

  changePageSize(rawValue: string): void {
    const nextSize = Number(rawValue);
    if (!this.pageSizeOptions.includes(nextSize)) return;
    this.pageSize.set(nextSize);
    this.currentPage.set(1);
  }

  prevPage(): void {
    this.currentPage.update((p) => Math.max(1, p - 1));
    this.scrollTableToTop();
  }

  nextPage(): void {
    this.currentPage.update((p) => Math.min(this.totalPages(), p + 1));
    this.scrollTableToTop();
  }

  private scrollTableToTop(): void {
    setTimeout(() => {
      const table = document.getElementById('recommendations-table');
      if (table) {
        table.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 0);
  }

  goToBooking(): void {
    this.router.navigate(['/'], { fragment: 'booking' }).then(() => {
      setTimeout(() => this.scroller.scrollToAnchor('booking'), 300);
    });
  }

  openSuggestionModal() {
    this.showSuggestionModal.set(true);
  }

  closeSuggestionModal() {
    this.showSuggestionModal.set(false);
  }
}
