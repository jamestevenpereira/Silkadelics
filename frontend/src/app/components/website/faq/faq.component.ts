import { ChangeDetectionStrategy, Component, inject, OnInit, signal, computed, effect } from '@angular/core';

import { LanguageService } from '../../../core/services/language.service';
import { SupabaseService } from '../../../core/services/supabase.service';
import { SeoService } from '../../../core/services/seo.service';

@Component({
  selector: 'app-faq',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.css'
})
export class FaqComponent implements OnInit {
  langService = inject(LanguageService);
  supabaseService = inject(SupabaseService);
  seoService = inject(SeoService);
  content = this.langService.content;

  openIndex: number | null = null;
  totalCount = signal<number>(0);

  parsedItems = computed(() => {
    const faq = this.content()?.faq;
    if (!faq?.items) return [];
    return faq.items.map((item: any) => ({
      ...item,
      answer: item.answer.replace('{count}', this.totalCount().toString())
    }));
  });

  constructor() {
    effect(() => {
      const items = this.parsedItems();
      if (!items.length) return;
      this.seoService.setJsonLd({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: items.map((item: any) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer.replace(/<[^>]*>/g, '')
          }
        }))
      }, 'ld-faq');
    });
  }

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
