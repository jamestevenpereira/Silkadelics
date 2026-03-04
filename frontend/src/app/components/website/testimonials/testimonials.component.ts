import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupabaseService } from '../../../core/services/supabase.service';
import { LanguageService } from '../../../core/services/language.service';

@Component({
  selector: 'app-testimonials',
  standalone: true,
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
        // Duplicate the list 3 times to ensure no gaps during animation
        this.displayTestimonials.set([...data, ...data, ...data]);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  }
}
