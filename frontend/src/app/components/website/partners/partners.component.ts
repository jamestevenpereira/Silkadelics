import { ChangeDetectionStrategy, Component, inject, OnInit, signal, computed } from '@angular/core';

import { LanguageService } from '../../../core/services/language.service';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-partners',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './partners.component.html',
  styleUrl: './partners.component.css'
})
export class PartnersComponent implements OnInit {
  langService = inject(LanguageService);
  supabaseService = inject(SupabaseService);

  content = this.langService.content;
  team = signal<any[]>([]);

  partners = computed(() =>
    this.team().filter(m => m.category === 'partner')
  );

  async ngOnInit() {
    const { data } = await this.supabaseService.getTeam();
    if (data && data.length > 0) {
      this.team.set(data);
    }
  }
}
