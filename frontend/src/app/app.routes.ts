import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./components/website/home/home.component').then(m => m.HomeComponent)
    },
    {
        path: 'admin',
        loadComponent: () => import('./components/admin/admin-login/admin-login.component').then(m => m.AdminLoginComponent)
    },
    {
        path: 'admin/dashboard',
        loadComponent: () => import('./components/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        canActivate: [authGuard]
    },
    {
        path: 'gallery',
        loadComponent: () => import('./components/website/gallery/full-gallery/full-gallery.component').then(m => m.FullGalleryComponent)
    },
    {
        path: 'privacy-policy',
        loadComponent: () => import('./components/website/legal/privacy-policy/privacy-policy.component').then(m => m.PrivacyPolicyComponent)
    },
    {
        path: 'terms-of-service',
        loadComponent: () => import('./components/website/legal/terms-of-service/terms-of-service.component').then(m => m.TermsOfServiceComponent)
    },
    {
        path: '**',
        redirectTo: ''
    }
];
