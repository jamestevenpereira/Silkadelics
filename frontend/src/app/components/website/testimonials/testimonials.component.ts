import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../core/services/supabase.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-testimonials',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './testimonials.component.html',
  styleUrl: './testimonials.component.css'
})
export class TestimonialsComponent implements OnInit {
  private supabaseService = inject(SupabaseService);
  private langService = inject(LanguageService);

  content = this.langService.content;
  testimonials = signal<any[]>([]);

  // Duplicate testimonials for seamless infinite scroll
  displayTestimonials = signal<any[]>([]);

  async ngOnInit() {
    try {
      const data = await this.supabaseService.getTestimonialsApi();
      if (data) {
        this.testimonials.set(data);
        // Single set — duplication is done in template for seamless loop
        this.displayTestimonials.set(data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  }
}
