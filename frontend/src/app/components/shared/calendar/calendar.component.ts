import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, inject, effect } from '@angular/core';
import { LanguageService } from '../../../core/services/language.service';

interface BookedDate {
    date: string;
    status: string;
}

@Component({
    selector: 'app-calendar',
    standalone: true,
    imports: [],
    templateUrl: './calendar.component.html',
    styleUrl: './calendar.component.css'
})
export class CalendarComponent implements OnInit, OnChanges {
    private langService = inject(LanguageService);
    content = this.langService.content;

    @Input() bookedDates: BookedDate[] = [];
    @Input() selectedDate: string | null = null;
    @Output() dateSelected = new EventEmitter<string>();

    currentDate: Date = new Date();
    viewDate: Date = new Date();
    days: { date: Date; isCurrentMonth: boolean; status?: string; isSelected?: boolean; isPast?: boolean }[] = [];

    weekDays: string[] = [];

    constructor() {
        // Automatically update weekDays when content changes
        effect(() => {
            this.weekDays = this.content().calendar.weekDays;
        });
    }

    ngOnInit() {
        this.generateCalendar();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['bookedDates'] || changes['selectedDate']) {
            this.generateCalendar();
        }
    }

    generateCalendar() {
        const year = this.viewDate.getFullYear();
        const month = this.viewDate.getMonth();

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);

        const firstDayIdx = firstDayOfMonth.getDay();
        const lastDayDate = lastDayOfMonth.getDate();

        const daysCount = lastDayDate + firstDayIdx;
        const rows = Math.ceil(daysCount / 7);
        const calendarDays = rows * 7;

        this.days = [];

        // Prev month days
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (let i = firstDayIdx - 1; i >= 0; i--) {
            const d = new Date(year, month - 1, prevMonthLastDay - i);
            this.days.push({
                date: d,
                isCurrentMonth: false,
                isPast: d <= today
            });
        }

        // Current month days
        for (let i = 1; i <= lastDayDate; i++) {
            const d = new Date(year, month, i);
            const dStr = this.formatDate(d);

            // Normalize and find bookings
            const bookingsForDay = this.bookedDates.filter(b => {
                const bDate = b.date.includes('T') ? b.date.split('T')[0] : b.date;
                return bDate === dStr;
            });

            // Prioritize 'booked' over 'pending'
            let status: string | undefined;
            if (bookingsForDay.some(b => b.status?.toLowerCase() === 'booked')) {
                status = 'booked';
            } else if (bookingsForDay.some(b => b.status?.toLowerCase() === 'pending')) {
                status = 'pending';
            }

            const isPast = d <= today;

            this.days.push({
                date: d,
                isCurrentMonth: true,
                status: status,
                isSelected: this.selectedDate === dStr,
                isPast: isPast
            });
        }

        // Next month days
        const remainingDays = calendarDays - this.days.length;
        for (let i = 1; i <= remainingDays; i++) {
            const d = new Date(year, month + 1, i);
            this.days.push({
                date: d,
                isCurrentMonth: false,
                isPast: d <= today
            });
        }
    }

    prevMonth() {
        this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() - 1, 1);
        this.generateCalendar();
    }

    nextMonth() {
        this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + 1, 1);
        this.generateCalendar();
    }

    selectDate(day: any) {
        if (!day.isCurrentMonth || day.status === 'booked' || day.isPast) return;
        const dStr = this.formatDate(day.date);
        this.dateSelected.emit(dStr);
    }

    formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    getMonthName(): string {
        const monthIndex = this.viewDate.getMonth();
        const year = this.viewDate.getFullYear();
        return `${this.content().calendar.months[monthIndex]} ${year}`;
    }
}
