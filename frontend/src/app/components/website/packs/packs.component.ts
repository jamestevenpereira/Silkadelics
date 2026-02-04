import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-packs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './packs.component.html',
  styles: ``
})
export class PacksComponent implements OnInit {
  supabaseService = inject(SupabaseService);
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
  getBronzePerformanceOptions(): string[] {
    return [
      'Cerimónia (Igreja ou Civil)',
      'Receção dos Noivos',
      'Concerto 2h',
      'DJ Live Set'
    ];
  }
}
