import { Component, OnInit, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../core/services/supabase.service';

interface Booking {
  id: string;
  name: string;
  date: string;
  event_type: string;
  pack?: string;
  status: string;
  deal_value?: number;
  venue?: string;
}

@Component({
  selector: 'app-admin-metrics',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-metrics.component.html'
})
export class AdminMetricsComponent implements OnInit {
  private supabase = inject(SupabaseService);

  allBookings = signal<Booking[]>([]);
  loading = signal(true);
  selectedYear = signal<number>(new Date().getFullYear());
  today = new Date().toISOString().split('T')[0];

  availableYears = computed(() => {
    const years = new Set(this.allBookings().map(b => new Date(b.date).getFullYear()));
    return [...years].sort((a, b) => b - a);
  });

  filteredBookings = computed(() => {
    const y = this.selectedYear();
    return this.allBookings().filter(b => new Date(b.date).getFullYear() === y);
  });

  concluded = computed(() =>
    this.filteredBookings().filter(b => b.status === 'booked' && b.date < this.today)
  );

  upcoming = computed(() =>
    this.allBookings().filter(b => b.status === 'booked' && b.date >= this.today)
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 6)
  );

  pending = computed(() =>
    this.filteredBookings().filter(b => b.status === 'pending')
  );

  cancelled = computed(() =>
    this.filteredBookings().filter(b => b.status === 'cancelled')
  );

  totalCache = computed(() =>
    this.concluded().reduce((sum, b) => sum + (b.deal_value || 0), 0)
  );

  avgCache = computed(() => {
    const withValue = this.concluded().filter(b => b.deal_value);
    return withValue.length ? this.totalCache() / withValue.length : 0;
  });

  recentConcluded = computed(() =>
    [...this.concluded()]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 6)
  );

  async ngOnInit() {
    try {
      const { data } = await this.supabase.getAllBookings();
      this.allBookings.set(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      this.loading.set(false);
    }
  }
}
