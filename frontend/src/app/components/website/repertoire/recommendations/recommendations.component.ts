import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Router, RouterLink } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { LanguageService } from '../../../../core/services/language.service';

import { SearchBarComponent } from '../../../../shared/components/ui/search-bar/search-bar.component';
import { ButtonShinyComponent } from '../../../../shared/components/ui/button-shiny/button-shiny.component';
import { SongSuggestionModalComponent } from '../../../../shared/components/ui/song-suggestion-modal/song-suggestion-modal.component';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [RouterLink, NavbarComponent, FooterComponent, SearchBarComponent, ButtonShinyComponent, SongSuggestionModalComponent],
  templateUrl: './recommendations.component.html',
})
export class RecommendationsComponent implements OnInit {
  private langService = inject(LanguageService);
  private router = inject(Router);
  private scroller = inject(ViewportScroller);

  content = this.langService.content;
  
  searchQuery = signal('');
  pageSize = signal(10);
  currentPage = signal(1);
  readonly pageSizeOptions = [5, 10, 15];
  showSuggestionModal = signal(false);

  // Audio state
  playingSong = signal<string | null>(null);
  private audioPlayer = new Audio();

  recommendations: { artist: string; song: string; audioUrl?: string }[] = [
    { artist: 'Oasis', song: 'Wonderwall', audioUrl: 'assets/audio/demo.mp3' },
    { artist: 'People R Ugly', song: 'What\'s Up' },
    { artist: 'Radiohead (Silkadelics Version)', song: 'Creep' },
    { artist: 'Tenacious D', song: 'Baby One More Time' },
    { artist: 'The Killers', song: 'Mr. Brightside', audioUrl: 'assets/audio/demo.mp3' },
    { artist: 'Walk The Moon', song: 'Shut Up And Dance' },
    { artist: 'Linkin Park', song: 'Numb', audioUrl: 'assets/audio/demo.mp3' },
    { artist: 'Two Door Cinema Club', song: 'What You Know' },
    { artist: 'Guns N\' Roses', song: 'Sweet Child O\' Mine' },
    { artist: 'Coldplay', song: 'Yellow' },
    { artist: 'Kaleo', song: 'No Good' },
    { artist: 'Green Day', song: 'Boulevard Of Broken Dreams' },
    { artist: 'Daft Punk', song: 'One More Time' },
    { artist: 'Bad Wolves', song: 'Zombie' },
    { artist: 'Bruno Mars', song: 'Super Bowl Halftime Medley', audioUrl: 'assets/audio/demo.mp3' },
    { artist: 'Coldplay', song: 'Fix You' },
    { artist: 'Daft Punk', song: 'Get Lucky' },
    { artist: 'Franz Ferdinand', song: 'Take Me Out' },
    { artist: 'The Weasel (Silkadelics Version)', song: 'Duia' },
    { artist: 'Gala', song: 'Freed From Desire' },
    { artist: 'Green Day', song: 'Holiday' },
    { artist: 'Justin Timberlake', song: 'Can\'t Stop The Feeling' },
    { artist: 'Kings Of Leon', song: 'Sex On Fire' },
    { artist: 'Kings Of Leon', song: 'Use Somebody' },
    { artist: 'Måneskin', song: 'Beggin' },
    { artist: 'Måneskin', song: 'Let\'s Get It Started' },
  ];

  ngOnInit(): void {
    this.audioPlayer.addEventListener('ended', () => {
      this.playingSong.set(null);
    });
  }

  onSearch(query: string | Event): void {
    if (typeof query === 'string') {
      this.searchQuery.set(query);
    } else {
      const input = query.target as HTMLInputElement;
      this.searchQuery.set(input.value);
    }
    this.currentPage.set(1);
  }

  filteredRecommendations = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.recommendations;
    
    return this.recommendations.filter(r => 
      r.artist.toLowerCase().includes(query) || 
      r.song.toLowerCase().includes(query)
    );
  });

  sortedRecommendations = computed(() => {
    return [...this.filteredRecommendations()].sort((a, b) =>
      a.artist.localeCompare(b.artist, 'pt', { sensitivity: 'base' })
    );
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

  downloadPdf(): void {
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
      headStyles: { fillColor: [139, 92, 246] }, // Luxury Purple
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
  }

  nextPage(): void {
    this.currentPage.update((p) => Math.min(this.totalPages(), p + 1));
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
