import { Component, inject, OnInit, signal } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-admin-team',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-team.component.html',
  styleUrls: ['./admin-team.component.css']
})
export class AdminTeamComponent implements OnInit {
  supabaseService = inject(SupabaseService);

  team = signal<any[]>([]);
  loading = signal<boolean>(false);
  uploading = signal<boolean>(false);
  showForm = signal<boolean>(false);
  editingId = signal<string | null>(null);

  memberForm = {
    name: '',
    role: '',
    category: 'member',
    img: '',
    instagram: '',
    display_order: 0
  };

  async ngOnInit() {
    await this.loadTeam();
  }

  async loadTeam() {
    const { data } = await this.supabaseService.getTeam();
    if (data) this.team.set(data);
  }

  openNewForm() {
    this.editingId.set(null);
    this.memberForm = {
      name: '',
      role: '',
      category: 'member',
      img: '',
      instagram: '',
      display_order: this.team().length
    };
    this.showForm.set(true);
  }

  editMember(member: any) {
    this.editingId.set(member.id);
    this.memberForm = { ...member };
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
      // Sanitize filename - remove special characters, accents and spaces
      const sanitizedName = file.name
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove accents
        .replace(/[^a-zA-Z0-9.-]/g, '_'); // Replace special chars and spaces with underscore

      const fileName = `team/${Date.now()}_${sanitizedName}`;
      const { data, error } = await this.supabaseService.uploadFile('team-photos', fileName, file);
      if (error) throw error;

      const publicUrl = await this.supabaseService.getPublicUrl('team-photos', fileName);
      this.memberForm.img = publicUrl;
    } catch (err: any) {
      alert('Erro no upload: ' + err.message);
    } finally {
      this.uploading.set(false);
    }
  }

  async saveMember() {
    this.loading.set(true);
    try {
      if (this.editingId()) {
        await this.supabaseService.updateTeamMember(this.editingId()!, this.memberForm);
      } else {
        await this.supabaseService.addTeamMember(this.memberForm);
      }
      await this.loadTeam();
      this.cancelEdit();
    } catch (error) {
      console.error('Error saving member:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async deleteMember(id: string) {
    if (confirm('Tem a certeza que deseja remover este membro?')) {
      await this.supabaseService.deleteTeamMember(id);
      await this.loadTeam();
    }
  }
}
