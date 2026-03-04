import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SupabaseService } from '../../../core/services/supabase.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrl: './admin-login.component.css'
})
export class AdminLoginComponent implements OnInit {
  email = '';
  password = '';
  error = '';
  loading = false;

  constructor(private supabaseService: SupabaseService, private router: Router) { }

  async ngOnInit() {
    // If there's already a valid session, redirect straight to dashboard (e.g. after pressing F5)
    await this.supabaseService.waitForAuth();
    const { data: { session } } = await this.supabaseService.getSession();
    if (session?.user?.email === 'silkadelics@gmail.com') {
      this.router.navigate(['/admin/dashboard']);
    }
  }

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
