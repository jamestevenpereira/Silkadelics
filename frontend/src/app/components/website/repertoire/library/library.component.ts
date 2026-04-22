import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';
import { LanguageService } from '../../../../core/services/language.service';

type RepertoireEra = '70-90' | '2000+' | '2010+';

const VALID_ERAS: RepertoireEra[] = ['70-90', '2000+', '2010+'];

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

  content = this.langService.content;

  activeEra = signal<RepertoireEra>('70-90');
  searchQuery = signal('');
  pageSize = signal(10);
  currentPage = signal(1);
  readonly pageSizeOptions = [5, 10, 15];
  showSuggestionModal = signal(false);

  // Audio state
  playingSong = signal<string | null>(null);
  private audioPlayer = new Audio();

  tabs: EraTab[] = [
    { id: '70-90', labelKey: '70-90' },
    { id: '2000+', labelKey: '2000+' },
    { id: '2010+', labelKey: '2010+' },
  ];

  songsByEra: Record<RepertoireEra, SongRow[]> = {
    '70-90': [
      { artist: 'Nirvana', song: 'Smells Like Teen Spirit', tags: ['Grunge', 'Rock'], audioUrl: 'assets/audio/demo.mp3' },
      { artist: 'Pearl Jam', song: 'Black', tags: ['Rock', 'Ballad'] },
      { artist: 'Guns N’ Roses', song: 'Sweet Child O’ Mine', tags: ['Classic Rock'] },
      { artist: 'Oasis', song: 'Wonderwall', tags: ['Sing-along', 'Britpop'] },
      { artist: 'Radiohead (Silkadelics Version)', song: 'Creep', tags: ['Alternative'] },
      { artist: 'Marilyn Manson', song: 'Sweet Dreams', tags: ['Dark Pop'] },
      { artist: 'People R Ugly', song: 'What’s Up', tags: ['Anthem'] },
      { artist: 'Ornatos Violeta', song: 'Ouvi Dizer', tags: ['Português'] },
      { artist: 'Ornatos Violeta', song: 'Chaga', tags: ['Português'] },
      { artist: 'Blink-182', song: 'All The Small Things', tags: ['Pop Punk'] },
      { artist: 'Gala', song: 'Freed From Desire', tags: ['Dance', '90s'] },
    ],
    '2000+': [
      { artist: 'Linkin Park', song: 'Crawling', tags: ['Rock', 'Nu-Metal'] },
      { artist: 'Linkin Park', song: 'Numb', tags: ['Anthem', 'Nu-Metal'], audioUrl: 'assets/audio/demo.mp3' },
      { artist: 'Linkin Park', song: 'What I’ve Done', tags: ['Rock'] },
      { artist: 'Coldplay', song: 'Fix You', tags: ['Emotional', 'Pop'] },
      { artist: 'Coldplay', song: 'Yellow', tags: ['Acoustic', 'Classic'] },
      { artist: 'The Rasmus', song: 'In The Shadows', tags: ['Rock'] },
      { artist: 'Green Day', song: 'Holiday', tags: ['Punk Rock'] },
      { artist: 'Green Day', song: 'Boulevard Of Broken Dreams', tags: ['Rock'] },
      { artist: '3 Doors Down', song: 'Kryptonite', tags: ['Alternative'] },
      { artist: 'Muse', song: 'Plug In Baby', tags: ['Rock', 'Modern'] },
      { artist: 'Muse', song: 'Hysteria', tags: ['Rock'] },
      { artist: 'Muse', song: 'Time Is Running Out', tags: ['Rock'] },
      { artist: 'System Of A Down', song: 'Lonely Day', tags: ['Rock'] },
      { artist: 'System Of A Down', song: 'Aerials', tags: ['Rock'] },
      { artist: 'Rage Against The Machine', song: 'Killing In The Name', tags: ['Heavy'] },
      { artist: 'Foo Fighters', song: 'Everlong', tags: ['Rock'] },
      { artist: 'Kings Of Leon', song: 'Use Somebody', tags: ['Indie Rock'] },
      { artist: 'Kings Of Leon', song: 'Sex On Fire', tags: ['Anthem'] },
      { artist: 'Daft Punk', song: 'One More Time', tags: ['Dance'] },
      { artist: 'The Kooks', song: 'Naive', tags: ['Indie'] },
      { artist: 'Arctic Monkeys', song: 'R U Mine?', tags: ['Rock'] },
    ],
    '2010+': [
      { artist: 'U2', song: 'Ordinary Love', tags: ['Pop'] },
      { artist: 'Kaleo', song: 'Way Down We Go', tags: ['Blues Rock'] },
      { artist: 'Kaleo', song: 'No Good', tags: ['Rock'] },
      { artist: 'Måneskin', song: 'Beggin', tags: ['Rock', 'Trend'] },
      { artist: 'Måneskin', song: 'Wanna Be Your Slave', tags: ['Rock'] },
      { artist: 'Måneskin', song: 'Let’s Get It Started', tags: ['Party'] },
      { artist: 'Radiohead (Silkadelics Version)', song: 'Creep', tags: ['Alternative'] },
      { artist: 'Adele', song: 'Rolling In The Deep (Linkin Park)', tags: ['Emotional'] },
      { artist: 'Walk The Moon', song: 'Shut Up And Dance', tags: ['Party', 'Dance'] },
      { artist: 'Maroon 5', song: 'Moves Like Jagger', tags: ['Pop'] },
      { artist: 'Maroon 5', song: 'Sugar', tags: ['Wedding Pop'] },
      { artist: 'Justin Timberlake', song: 'Can’t Stop The Feeling', tags: ['Dance', 'Pop'] },
      { artist: 'Bruno Mars', song: 'Super Bowl Halftime Medley', tags: ['Funk', 'Party'], audioUrl: 'assets/audio/demo.mp3' },
      { artist: 'Two Door Cinema Club', song: 'What You Know', tags: ['Indie'] },
      { artist: 'Vance Joy', song: 'Riptide', tags: ['Acoustic'] },
      { artist: 'Arctic Monkeys', song: 'Snap Out Of It', tags: ['Indie Rock'] },
      { artist: 'The Killers', song: 'Mr. Brightside', tags: ['Anthem', 'Party'] },
      { artist: 'Daft Punk', song: 'Get Lucky', tags: ['Funk', 'Disco'] },
      { artist: 'Bad Wolves', song: 'Zombie', tags: ['Rock'] },
      { artist: 'Tenacious D', song: 'Baby One More Time', tags: ['Funny', 'Rock'] },
      { artist: 'The weasel (Silkadelics Version)', song: 'Duia', tags: ['Português'] },
      { artist: 'Silkadelics Version', song: 'Haja O Que Houver', tags: ['Português'] },
      { artist: 'Os Azeitonas', song: 'Anda Comigo Ver os Aviões', tags: ['Português'] },
      { artist: 'Pearl Jam', song: 'Black', tags: ['Rock'] },
    ],
  };

  async ngOnInit(): Promise<void> {
    const eraParam = this.route.snapshot.queryParamMap.get('era') as RepertoireEra;
    const initialEra: RepertoireEra = VALID_ERAS.includes(eraParam) ? eraParam : '70-90';
    this.activeEra.set(initialEra);

    this.audioPlayer.addEventListener('ended', () => {
      this.playingSong.set(null);
    });
  }

  selectEra(era: RepertoireEra): void {
    this.activeEra.set(era);
    this.searchQuery.set('');
    this.currentPage.set(1);
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

  isActive(era: RepertoireEra): boolean {
    return this.activeEra() === era;
  }

  filteredSongs = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const songs = this.songsByEra[this.activeEra()] || [];
    
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
