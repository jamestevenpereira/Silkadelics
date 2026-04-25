import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { LanguageService } from '../../../../core/services/language.service';

import { SupabaseService } from '../../../../core/services/supabase.service';

type RepertoireEra = 'All' | '70-90' | '2000+' | '2010+' | string;

const VALID_ERAS: RepertoireEra[] = ['All', '70-90', '2000+', '2010+'];

interface EraTab {
  id: RepertoireEra;
  labelKey: string;
}

interface SongRow {
  artist: string;
  song: string;
  tags?: string[];
  audioUrl?: string;
}

import { SearchBarComponent } from '../../../../shared/components/ui/search-bar/search-bar.component';
import { ButtonShinyComponent } from '../../../../shared/components/ui/button-shiny/button-shiny.component';
import { SongSuggestionModalComponent } from '../../../../shared/components/ui/song-suggestion-modal/song-suggestion-modal.component';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent, SearchBarComponent, ButtonShinyComponent, SongSuggestionModalComponent],
  templateUrl: './library.component.html'
})
export class LibraryComponent implements OnInit {
  private langService = inject(LanguageService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private scroller = inject(ViewportScroller);
  private supabase = inject(SupabaseService);

  content = this.langService.content;

  activeEra = signal<RepertoireEra>('All');
  searchQuery = signal('');
  pageSize = signal(10);
  currentPage = signal(1);
  readonly pageSizeOptions = [5, 10, 15];
  showSuggestionModal = signal(false);

  // Audio state
  playingSong = signal<string | null>(null);
  private audioPlayer = new Audio();
  
  isLoading = signal(true);

  tabs: EraTab[] = [
    { id: 'All', labelKey: 'Tudo' },
    { id: '70-90', labelKey: '70-90' },
    { id: '2000+', labelKey: '2000+' },
    { id: '2010+', labelKey: '2010+' },
  ];

  // Use a signal so computed() re-runs automatically when fetch completes
  songsByEra = signal<Record<string, SongRow[]>>({
    'All': [],
    '70-90': [],
    '2000+': [],
    '2010+': [],
    'Pop / Indie': [],
    'Rock / Alternative': [],
    'Jazz': [],
    'Portuguesa': [],
    'Soul / Funk / Blues': [],
    'Acústico': [],
    'Outro': []
  });

  async ngOnInit(): Promise<void> {
    const eraParam = this.route.snapshot.queryParamMap.get('era') as RepertoireEra;
    const initialEra: RepertoireEra = VALID_ERAS.includes(eraParam) ? eraParam : 'All';
    this.activeEra.set(initialEra);

    await this.loadSongs();

    this.audioPlayer.addEventListener('ended', () => {
      this.playingSong.set(null);
    });
  }

  async loadSongs() {
    this.isLoading.set(true);
    try {
      const data = await this.supabase.getRepertoireApi();
      const newSongsByEra: Record<string, SongRow[]> = {
        'All': [], '70-90': [], '2000+': [], '2010+': [], 'Pop / Indie': [], 'Rock / Alternative': [],
        'Jazz': [], 'Portuguesa': [], 'Soul / Funk / Blues': [], 'Acústico': [], 'Outro': []
      };
      
      for (const item of data) {
        if (!newSongsByEra[item.category]) newSongsByEra[item.category] = [];
        
        const songObj: SongRow = {
          artist: item.artist,
          song: item.title,
          tags: item.tags,
          audioUrl: item.audio_url
        };
        
        newSongsByEra[item.category].push(songObj);
        newSongsByEra['All'].push(songObj);
      }
      
      // Using .set() on the signal triggers re-computation of all dependents
      this.songsByEra.set(newSongsByEra);
    } catch (error) {
      console.error('Error fetching repertoire:', error);
    } finally {
      this.isLoading.set(false);
    }
  }

  selectEra(era: RepertoireEra): void {
    this.activeEra.set(era);
    this.searchQuery.set('');
    this.currentPage.set(1);
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

  isActive(era: RepertoireEra): boolean {
    return this.activeEra() === era;
  }

  filteredSongs = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    // Both songsByEra() and activeEra() are signals — this computed re-runs when either changes
    const songs = this.songsByEra()[this.activeEra()] || [];
    
    if (!query) return songs;
    
    return songs.filter(s => 
      s.artist.toLowerCase().includes(query) || 
      s.song.toLowerCase().includes(query)
    );
  });

  sortedActiveSongs = computed(() => {
    return [...this.filteredSongs()].sort((a, b) =>
      a.artist.localeCompare(b.artist, 'pt', { sensitivity: 'base' })
    );
  });

  paginatedSongs = computed(() => {
    const page = this.currentPage();
    const size = this.pageSize();
    const start = (page - 1) * size;
    return this.sortedActiveSongs().slice(start, start + size);
  });

  totalPages = computed(() => {
    const total = this.sortedActiveSongs().length;
    return Math.max(1, Math.ceil(total / this.pageSize()));
  });

  toggleAudio(song: SongRow): void {
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

  activeSongs(): SongRow[] {
    return this.sortedActiveSongs();
  }

  totalSongsForActiveEra(): number {
    return this.sortedActiveSongs().length;
  }

  downloadPdf(): void {
    const doc = new jsPDF();
    const eraName = this.activeEra();
    const title = `Silkadelics - Repertório (${eraName})`;
    const date = new Date().toLocaleDateString();

    doc.setFontSize(22);
    doc.text(title, 14, 20);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Gerado em: ${date}`, 14, 30);

    const tableData = this.sortedActiveSongs().map((s, i) => [
      (i + 1).toString().padStart(2, '0'),
      s.artist,
      s.song
    ]);
    
    autoTable(doc, {
      head: [['#', 'Artista', 'Música']],
      body: tableData,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [139, 92, 246] }, // Luxury Purple
      styles: { font: 'helvetica', fontSize: 10 },
      margin: { top: 40 }
    });

    doc.save(`Silkadelics_Repertorio_${eraName}.pdf`);
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
      const tablePanel = document.querySelector('[role="tabpanel"]');
      if (tablePanel) {
        tablePanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
