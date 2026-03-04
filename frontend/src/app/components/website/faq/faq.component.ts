import { Component, inject, OnInit, signal, computed } from '@angular/core';

import { LanguageService } from '../../../core/services/language.service';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent implements OnInit {
  langService = inject(LanguageService);
  supabaseService = inject(SupabaseService);
  content = this.langService.content;

  openIndex: number | null = null;
  totalCount = signal<number>(0);

  parsedItems = computed(() => {
    return this.content().faq.items.map(item => ({
      ...item,
      answer: item.answer.replace('{count}', this.totalCount().toString())
    }));
  });

  async ngOnInit() {
    try {
      const count = await this.supabaseService.getSongsCount();
      this.totalCount.set(count);
    } catch (err) {
      console.error('Error fetching song count:', err);
    }
  }

  toggle(index: number) {
    this.openIndex = this.openIndex === index ? null : index;
  }
}
