import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../core/services/supabase.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-packs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './packs.component.html',
  styles: ``
})
export class PacksComponent implements OnInit {
  private supabaseService = inject(SupabaseService);
  langService = inject(LanguageService);
  content = this.langService.content;
  packs = signal<any[]>([]);

  async ngOnInit() {
    const { data } = await this.supabaseService.getPacks();
    if (data) {
      this.packs.set(data);
    }
  }

  isBronzePack(pack: any): boolean {
    return pack.title?.toLowerCase().includes('bronze');
  }

  // Get sub-options for Bronze pack
  getBronzePerformanceOptions(pack: any): string[] {
    const bronzeItems = pack.features || [];
    // Filter out the main description to get just the options (those starting with '-')
    return bronzeItems.filter((f: string) => f.startsWith('-')).map((f: string) => {
      // We translate the full string first, then strip the hyphen
      const translated = this.content().packFeatures[f] || f;
      return translated.startsWith('-') ? translated.substring(1).trim() : translated;
    });
  }
}
