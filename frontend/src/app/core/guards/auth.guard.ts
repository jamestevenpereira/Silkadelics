import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const authGuard: CanActivateFn = async (route, state) => {
    const supabaseService = inject(SupabaseService);
    const router = inject(Router);

    // Wait for Supabase to finish reading from local storage
    await supabaseService.waitForAuth();

    // Check session first (fast, from storage)
    const { data: { session } } = await supabaseService.getSession();
    let user = session?.user;

    // Fallback to getUser (more reliable, ensures fresh data)
    if (!user) {
        user = (await supabaseService.getUser()) || undefined;
    }

    // Restrict access to specific admin email
    const ADMIN_EMAIL = 'silkadelics@gmail.com';

    if (user && user.email === ADMIN_EMAIL) {
        return true;
    } else {
        // If logged in as someone else, sign out and redirect
        if (user) {
            await supabaseService.signOut();
        }
        router.navigate(['/admin']);
        return false;
    }
};
