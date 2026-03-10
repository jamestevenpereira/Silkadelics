import { Component, HostListener, inject, OnInit, signal, computed } from '@angular/core';

import { LanguageService } from '../../../core/services/language.service';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-band-members',
  standalone: true,
  imports: [],
  templateUrl: './band-members.component.html',
  styleUrl: './band-members.component.css'
})
export class BandMembersComponent implements OnInit {
  languageService = inject(LanguageService);
  supabaseService = inject(SupabaseService);

  content = this.languageService.content;
  team = signal<any[]>([]);

  members = computed(() =>
    this.team().filter(m => m.category === 'member')
  );

  activeMemberId = signal<string | null>(null);

  @HostListener('document:touchstart', ['$event'])
  onDocumentTouch(event: TouchEvent) {
    const target = event.target as HTMLElement;
    if (!target.closest('.interactive-member-card')) {
      this.activeMemberId.set(null);
    }
  }

  onMemberClick(id: string) {
    if (window.matchMedia('(hover: none)').matches) {
      if (this.activeMemberId() === id) {
        this.activeMemberId.set(null); // Optional: toggle off on second tap if desired, or keep open.
      } else {
        this.activeMemberId.set(id);
      }
    }
  }

  async ngOnInit() {
    const { data } = await this.supabaseService.getTeam();
    if (data && data.length > 0) {
      this.team.set(data.map(member => ({
        ...member,
        img: this.supabaseService.getTransformedUrl(member.img, { width: 400, quality: 80 })
      })));
    }
  }
}
