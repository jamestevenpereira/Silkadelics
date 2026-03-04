import { Component, inject, computed, signal, OnInit } from '@angular/core';

import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { LanguageService } from '../../../core/services/language.service';
import { SupabaseService } from '../../../core/services/supabase.service';
import { CalendarComponent } from '../../shared/calendar/calendar.component';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [ReactiveFormsModule, CalendarComponent],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.css'
})
export class BookingFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private supabaseService = inject(SupabaseService);
  langService = inject(LanguageService);
  content = this.langService.content;

  selectedEventType = signal<string>('');
  bookedDates = signal<any[]>([]);
  selectedCalendarDate = signal<string | null>(null);

  bookingForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\sÀ-ÿ\-\']+$/)]],
    email: ['', [Validators.required, Validators.email, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
    phone: ['', [Validators.required, Validators.pattern(/^\+?[0-9\s\-]{7,20}$/)]],
    date: ['', Validators.required],
    eventType: ['', Validators.required],
    pack: [''], // Not required by default
    extras: this.fb.array([]),
    message: ['']
  });


  // Show pack field only for weddings
  showPackField = computed(() => {
    const eventType = this.selectedEventType();
    // Use the localized title from the current content to match
    return this.content().eventTypes.items.some(
      type => type.title === eventType && (type.title === 'Casamentos' || type.title === 'Weddings')
    );
  });

  isSubmitting = false;
  submitSuccess = false;
  submitError = false;

  // Update selectedEventType when form changes
  async ngOnInit() {
    this.bookingForm.get('eventType')?.valueChanges.subscribe(value => {
      this.selectedEventType.set(value || '');

      // Toggle pack validation based on event type
      const packControl = this.bookingForm.get('pack');
      if (this.showPackField()) {
        packControl?.setValidators(Validators.required);
      } else {
        packControl?.clearValidators();
        this.bookingForm.patchValue({ pack: '' });
      }
      packControl?.updateValueAndValidity();
    });

    try {
      const dates = await this.supabaseService.getBookedDates();
      this.bookedDates.set(dates);
    } catch (err) {
      console.error('Error fetching booked dates:', err);
    }
  }

  onDateSelected(date: string) {
    this.selectedCalendarDate.set(date);
    this.bookingForm.patchValue({ date: date });
  }

  onExtraChange(event: any) {
    const extras: FormArray = this.bookingForm.get('extras') as FormArray;
    if (event.target.checked) {
      extras.push(new FormControl(event.target.value));
    } else {
      const index = extras.controls.findIndex(x => x.value === event.target.value);
      extras.removeAt(index);
    }
  }

  onNameInput(event: Event) {
    const input = event.target as HTMLInputElement;
    // Strip everything except letters, spaces, hyphens, and apostrophes
    const sanitized = input.value.replace(/[^a-zA-Z\sÀ-ÿ\-\']/g, '');
    if (sanitized !== input.value) {
      this.bookingForm.patchValue({ name: sanitized }, { emitEvent: false });
    }
  }

  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    // Strip everything except digits, +, spaces, and -
    const sanitized = input.value.replace(/[^\d\s\-\+]/g, '');
    if (sanitized !== input.value) {
      this.bookingForm.patchValue({ phone: sanitized }, { emitEvent: false });
    }
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.bookingForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  onSubmit() {
    if (this.bookingForm.valid) {
      this.isSubmitting = true;
      this.submitError = false;

      // Convert extras array to string for the backend/email
      const formData = {
        ...this.bookingForm.value,
        extras: this.bookingForm.value.extras.join(', '),
        pack: this.showPackField() ? this.bookingForm.value.pack : 'N/A'
      };

      this.http.post('http://localhost:3000/api/bookings', formData)
        .subscribe({
          next: (response) => {
            console.log('Form submitted successfully:', response);
            this.isSubmitting = false;
            this.submitSuccess = true;
            this.bookingForm.reset();
            (this.bookingForm.get('extras') as FormArray).clear();
          },
          error: (error) => {
            console.error('Error submitting form:', error);
            this.isSubmitting = false;
            this.submitError = true;
          }
        });
    }
  }
}
