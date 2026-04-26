import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../core/services/supabase.service';
import { ConfirmDialogComponent, ConfirmDialogOptions } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-admin-bookings',
    standalone: true,
    imports: [CommonModule, FormsModule, ConfirmDialogComponent],
    templateUrl: './admin-bookings.component.html',
    styleUrl: './admin-bookings.component.css'
})
export class AdminBookingsComponent implements OnInit {
    bookings: any[] = [];
    loading = false;

    // Modal state
    showAddModal = false;
    isSaving = false;
    newBooking = {
        name: '',
        email: '',
        phone: '',
        date: '',
        event_type: '',
        pack: '',
        status: 'pending',
        message: ''
    };

    unsavedStatuses: { [key: string]: string } = {};
    isUpdatingStatus: { [key: string]: boolean } = {};
    confirmDialog = signal<(ConfirmDialogOptions & { action: () => void }) | null>(null);

    showConfirm(opts: ConfirmDialogOptions & { action: () => void }) { this.confirmDialog.set(opts); }
    dismissConfirm() { this.confirmDialog.set(null); }
    executeConfirm() { const d = this.confirmDialog(); if (d) { this.confirmDialog.set(null); d.action(); } }

    constructor(private supabaseService: SupabaseService) { }

    ngOnInit() {
        this.loadBookings();
    }

    async loadBookings() {
        this.loading = true;
        try {
            const { data, error } = await this.supabaseService.getAllBookings();
            if (error) throw error;
            this.bookings = data || [];
        } catch (err) {
            console.error('Error loading bookings:', err);
        } finally {
            this.loading = false;
        }
    }

    onStatusChange(bookingId: string, newStatus: string) {
        this.unsavedStatuses[bookingId] = newStatus;
    }

    async confirmUpdateStatus(booking: any) {
        const newStatus = this.unsavedStatuses[booking.id];
        if (!newStatus) return;

        this.isUpdatingStatus[booking.id] = true;
        try {
            const { data, error } = await this.supabaseService.updateBooking(booking.id, { status: newStatus });
            if (error) throw error;

            if (!data || data.length === 0) {
                throw new Error('A alteração não foi guardada na base de dados (RLS ou ID inválido).');
            }

            booking.status = newStatus;
            delete this.unsavedStatuses[booking.id];
        } catch (err: any) {
            console.error('Error updating status:', err);
            alert('Erro ao atualizar estado: ' + (err.message || 'Verifique as permissões de RLS no Supabase'));
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
                    if (!data || data.length === 0) throw new Error('A reserva não foi eliminada da base de dados (RLS ou ID inválido).');
                    this.bookings = this.bookings.filter(b => b.id !== id);
                } catch (err: any) {
                    console.error('Error deleting booking:', err);
                    alert('Erro ao eliminar reserva: ' + (err.message || 'Verifique as permissões de RLS no Supabase'));
                }
            }
        });
    }

    async onAddBooking() {
        this.isSaving = true;
        try {
            const { error } = await this.supabaseService.addBooking(this.newBooking);
            if (error) throw error;

            this.showAddModal = false;
            this.resetNewBooking();
            await this.loadBookings();
        } catch (err) {
            console.error('Error adding booking:', err);
            alert('Erro ao adicionar reserva. Verifique se a tabela tem todos os campos necessários.');
        } finally {
            this.isSaving = false;
        }
    }

    resetNewBooking() {
        this.newBooking = {
            name: '',
            email: '',
            phone: '',
            date: '',
            event_type: '',
            pack: '',
            status: 'pending',
            message: ''
        };
    }

    getStatusClass(status: string) {
        switch (status) {
            case 'booked': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'pending': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            default: return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
        }
    }
}
