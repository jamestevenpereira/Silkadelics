import { Component, inject, OnInit, signal, OnDestroy, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { LanguageService } from '../../../core/services/language.service';
import { SupabaseService } from '../../../core/services/supabase.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

declare var YT: any;

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css'
})
export class HeroComponent implements OnInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  langService = inject(LanguageService);
  supabaseService = inject(SupabaseService);
  sanitizer = inject(DomSanitizer);

  content = this.langService.content;
  videoUrl = signal<SafeResourceUrl | null>(null);
  isMuted = signal<boolean>(true);
  videoLoaded = signal<boolean>(false);
  posterShown = true;
  posterUrl = signal<string>('/assets/images/about-band.webp'); // Default poster
  rawVideoUrl = '';
  player: any;
  videoId = '';

  async ngOnInit() {
    try {
      const { data } = await this.supabaseService.getPromotionalVideo();
      this.rawVideoUrl = data?.value || 'https://www.youtube.com/embed/dQw4w9WgXcQ';
      this.videoId = this.extractVideoId(this.rawVideoUrl);
    } catch (err) {
      this.rawVideoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
      this.videoId = this.extractVideoId(this.rawVideoUrl);
    }
    this.setPosterImage();
  }

  setPosterImage(): void {
    if (this.videoId) {
      this.posterUrl.set(`https://img.youtube.com/vi/${this.videoId}/maxresdefault.jpg`);
    } else {
      this.posterUrl.set('https://silkadelics.pt/assets/images/about-band.webp');
    }
  }

  initYoutubeApi() {
    if (!isPlatformBrowser(this.platformId)) return;

    // Load the IFrame Player API code asynchronously.
    if (!(window as any)['onYouTubeIframeAPIReady']) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      if (firstScriptTag && firstScriptTag.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        document.head.appendChild(tag);
      }

      (window as any)['onYouTubeIframeAPIReady'] = () => this.createPlayer();
    } else {
      this.createPlayer();
    }
  }

  createPlayer() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.player = new YT.Player('hero-video', {
      videoId: this.videoId,
      playerVars: {
        autoplay: 1,
        mute: 1,
        controls: 0,
        loop: 1,
        playlist: this.videoId,
        showinfo: 0,
        rel: 0,
        enablejsapi: 1,
        start: 15
      },
      events: {
        onReady: (event: any) => {
          event.target.playVideo();
        }
      }
    });
  }

  loadVideo(): void {
    if (this.videoLoaded() || !isPlatformBrowser(this.platformId)) return;
    this.posterShown = false;
    this.videoLoaded.set(true);
    this.initYoutubeApi();
  }

  toggleAudio() {
    if (!this.videoLoaded()) {
      this.loadVideo();
      return;
    }
    this.isMuted.set(!this.isMuted());
    if (this.player) {
      if (this.isMuted()) {
        this.player.mute();
      } else {
        this.player.unMute();
        this.player.setVolume(50); // 50% volume as requested
      }
    }
  }

  private extractVideoId(url: string): string {
    if (url.includes('embed/')) {
      return url.split('embed/')[1].split('?')[0];
    }
    if (url.includes('watch?v=')) {
      return url.split('watch?v=')[1].split('&')[0];
    }
    return url;
  }

  ngOnDestroy() {
    if (this.player) {
      this.player.destroy();
    }
  }
}
