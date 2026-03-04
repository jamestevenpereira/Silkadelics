import { Component, inject, OnInit, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-admin-testimonials',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-testimonials.component.html',
  styleUrls: ['./admin-testimonials.component.css']
})
export class AdminTestimonialsComponent implements OnInit {
  supabaseService = inject(SupabaseService);

  testimonials = signal<any[]>([]);
  loading = signal<boolean>(false);
  uploading = signal<boolean>(false);
  showForm = signal<boolean>(false);
  editingId = signal<number | null>(null);

  form = {
    name: '',
    role: '',
    text: '',
    img: ''
  };

  async ngOnInit() {
    await this.loadTestimonials();
  }

  async loadTestimonials() {
    const { data } = await this.supabaseService.getTestimonials();
    if (data) this.testimonials.set(data);
  }

  openNewForm() {
    this.editingId.set(null);
    this.form = { name: '', role: '', text: '', img: '' };
    this.showForm.set(true);
  }

  editTestimonial(item: any) {
    this.editingId.set(item.id);
    this.form = { ...item };
    this.showForm.set(true);
  }

  cancelEdit() {
    this.showForm.set(false);
    this.editingId.set(null);
  }

  async onImageUpload(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.uploading.set(true);
    try {
      // Sanitize filename - remove special characters and accents
      const sanitizedName = file.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-zA-Z0-9.-]/g, '_'); // Replace special chars with underscore

      const fileName = `${Date.now()}_${sanitizedName}`;
      const { data, error } = await this.supabaseService.uploadFile('testimonials', fileName, file);
      if (error) throw error;

      const publicUrl = await this.supabaseService.getPublicUrl('testimonials', fileName);
      this.form.img = publicUrl;
    } catch (err: any) {
      alert('Erro no upload: ' + err.message);
    } finally {
      this.uploading.set(false);
    }
  }

  async saveTestimonial() {
    this.loading.set(true);
    try {
      if (this.editingId()) {
        await this.supabaseService.updateTestimonial(this.editingId()!, this.form);
      } else {
        await this.supabaseService.addTestimonial(this.form);
      }
      await this.loadTestimonials();
      this.cancelEdit();
    } catch (error) {
      console.error('Error saving testimonial:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async deleteTestimonial(id: number) {
    if (confirm('Tem a certeza que deseja remover este testemunho?')) {
      await this.supabaseService.deleteTestimonial(id);
      await this.loadTestimonials();
    }
  }
}
