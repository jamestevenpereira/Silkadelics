import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../core/services/supabase.service';
import { ConfirmDialogComponent, ConfirmDialogOptions } from '../shared/confirm-dialog/confirm-dialog.component';

interface Booking {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  event_type: string;
  pack?: string;
  extras?: string;
  message?: string;
  status: string;
  deal_value?: number;
  venue?: string;
  notes?: string;
  created_at: string;
}

type BookingFormData = Omit<Booking, 'id' | 'created_at'>;

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, ConfirmDialogComponent],
  templateUrl: './admin-bookings.component.html',
  styleUrl: './admin-bookings.component.css'
})
export class AdminBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  loading = false;

  showModal = false;
  editingId: string | null = null;
  isSaving = false;

  emptyForm: BookingFormData = {
    name: '', email: '', phone: '', date: '', event_type: '',
    pack: '', status: 'pending', deal_value: undefined, venue: '', notes: '', extras: '', message: ''
  };

  bookingForm: BookingFormData = { ...this.emptyForm };

  unsavedStatuses: { [key: string]: string } = {};
  isUpdatingStatus: { [key: string]: boolean } = {};
  confirmDialog = signal<(ConfirmDialogOptions & { action: () => void }) | null>(null);

  showConfirm(opts: ConfirmDialogOptions & { action: () => void }) { this.confirmDialog.set(opts); }
  dismissConfirm() { this.confirmDialog.set(null); }
  executeConfirm() { const d = this.confirmDialog(); if (d) { this.confirmDialog.set(null); d.action(); } }

  today = new Date().toISOString().split('T')[0];

  constructor(private supabaseService: SupabaseService) { }

  ngOnInit() { this.loadBookings(); }

  async loadBookings() {
    this.loading = true;
    try {
      const { data, error } = await this.supabaseService.getAllBookings();
      if (error) throw error;
      this.bookings = this.sortBookings(data || []);
    } catch (err) {
      console.error('Error loading bookings:', err);
    } finally {
      this.loading = false;
    }
  }

  private sortBookings(list: Booking[]): Booking[] {
    return [...list].sort((a, b) => {
      const aFuture = a.date >= this.today;
      const bFuture = b.date >= this.today;
      if (aFuture && !bFuture) return -1;
      if (!aFuture && bFuture) return 1;
      return aFuture
        ? a.date.localeCompare(b.date)        // upcoming: nearest first
        : b.date.localeCompare(a.date);        // past: most recent first
    });
  }

  displayStatus(booking: Booking): string {
    if (booking.status === 'booked' && booking.date < this.today) return 'concluded';
    return booking.status;
  }

  openNewModal() {
    this.editingId = null;
    this.bookingForm = { ...this.emptyForm };
    this.showModal = true;
  }

  openEditModal(booking: Booking) {
    this.editingId = booking.id;
    this.bookingForm = {
      name: booking.name,
      email: booking.email,
      phone: booking.phone,
      date: booking.date,
      event_type: booking.event_type,
      pack: booking.pack ?? '',
      status: booking.status,
      deal_value: booking.deal_value ?? undefined,
      venue: booking.venue ?? '',
      notes: booking.notes ?? '',
      extras: booking.extras ?? '',
      message: booking.message ?? ''
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
    this.editingId = null;
  }

  async saveBooking() {
    this.isSaving = true;
    try {
      const payload = {
        ...this.bookingForm,
        deal_value: this.bookingForm.deal_value || null,
        venue: this.bookingForm.venue || null,
        notes: this.bookingForm.notes || null
      };

      if (this.editingId) {
        const { error } = await this.supabaseService.updateBooking(this.editingId, payload);
        if (error) throw error;
      } else {
        const { error } = await this.supabaseService.addBooking(payload);
        if (error) throw error;
      }
      this.closeModal();
      await this.loadBookings();
    } catch (err) {
      console.error('Error saving booking:', err);
      alert('Erro ao guardar reserva.');
    } finally {
      this.isSaving = false;
    }
  }

  onStatusChange(bookingId: string, newStatus: string) {
    this.unsavedStatuses[bookingId] = newStatus;
  }

  async confirmUpdateStatus(booking: Booking) {
    const newStatus = this.unsavedStatuses[booking.id];
    if (!newStatus) return;
    this.isUpdatingStatus[booking.id] = true;
    try {
      const { data, error } = await this.supabaseService.updateBooking(booking.id, { status: newStatus });
      if (error) throw error;
      if (!data || data.length === 0) throw new Error('RLS ou ID inválido.');
      booking.status = newStatus;
      delete this.unsavedStatuses[booking.id];
      this.bookings = this.sortBookings(this.bookings);
    } catch (err: any) {
      alert('Erro ao atualizar estado: ' + (err.message || ''));
    } finally {
      this.isUpdatingStatus[booking.id] = false;
    }
  }

  deleteBooking(id: string) {
    this.showConfirm({
      title: 'Eliminar Reserva',
      message: 'Tem a certeza que deseja eliminar esta reserva permanentemente? Esta ação não pode ser desfeita.',
      confirmLabel: 'Eliminar',
      danger: true,
      action: async () => {
        try {
          const { data, error } = await this.supabaseService.deleteBooking(id);
          if (error) throw error;
          if (!data || data.length === 0) throw new Error('RLS ou ID inválido.');
          this.bookings = this.bookings.filter(b => b.id !== id);
        } catch (err: any) {
          alert('Erro ao eliminar reserva: ' + (err.message || ''));
        }
      }
    });
  }

  getStatusClass(status: string) {
    switch (status) {
      case 'booked':     return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'pending':    return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'cancelled':  return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'concluded':  return 'bg-primary/10 text-primary border-primary/20';
      default:           return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  }

  getStatusLabel(status: string) {
    switch (status) {
      case 'booked':    return 'Confirmado';
      case 'pending':   return 'Pendente';
      case 'cancelled': return 'Cancelado';
      case 'concluded': return 'Concluído';
      default:          return status;
    }
  }
}
