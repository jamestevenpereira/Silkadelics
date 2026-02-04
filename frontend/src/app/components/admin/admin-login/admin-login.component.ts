import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private supabaseService: SupabaseService, private router: Router) { }

  async onLogin() {
    this.loading = true;
    this.error = '';

    try {
      const { data, error } = await this.supabaseService.signIn(this.email, this.password);
      if (error) throw error;
      this.router.navigate(['/admin/dashboard']);
    } catch (err: any) {
      console.error('Login error:', err);
      this.error = err.message || 'Falha na autenticação';
    } finally {
      this.loading = false;
    }
  }
}
