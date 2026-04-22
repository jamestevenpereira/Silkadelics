import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LanguageService } from '../../../../core/services/language.service';
import { environment } from '../../../../../environments/environment';
import { LucideAngularModule, X, Music, User, Mail, MessageSquare } from 'lucide-angular';

@Component({
  selector: 'app-song-suggestion-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './song-suggestion-modal.component.html',
  styleUrl: './song-suggestion-modal.component.css'
})
export class SongSuggestionModalComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  langService = inject(LanguageService);
  content = this.langService.content;

  @Output() close = new EventEmitter<void>();

  suggestionForm: FormGroup = this.fb.group({
    name: [''],
    email: ['', [Validators.email]],
    artist: ['', [Validators.required]],
    song: ['', [Validators.required]],
    message: ['']
  });

  isSubmitting = signal(false);
  submitSuccess = signal(false);
  submitError = signal(false);

  // Icons
  readonly iconClose = X;
  readonly iconMusic = Music;
  readonly iconUser = User;
  readonly iconMail = Mail;
  readonly iconMessage = MessageSquare;

  onClose() {
    this.close.emit();
  }

  onSubmit() {
    if (this.suggestionForm.valid) {
      this.isSubmitting.set(true);
      this.submitError.set(false);

      this.http.post(`${environment.apiUrl}/suggestions`, this.suggestionForm.value)
        .subscribe({
          next: () => {
            this.isSubmitting.set(false);
            this.submitSuccess.set(true);
            setTimeout(() => this.onClose(), 3000);
          },
          error: (error) => {
            console.error('Error submitting suggestion:', error);
            this.isSubmitting.set(false);
            this.submitError.set(true);
          }
        });
    } else {
      this.suggestionForm.markAllAsTouched();
    }
  }
}
