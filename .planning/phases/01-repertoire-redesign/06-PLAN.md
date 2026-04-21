---
phase: 1
plan: 06
type: execute
wave: 3
depends_on: [03, 04]
files_modified:
  - frontend/src/app/app.routes.ts
autonomous: true
requirements: [routing]
---

# Plan 06 — Routing Configuration

## Objective

Add child routes for `/repertoire/recommendations` and `/repertoire/library` to `app.routes.ts`. Use lazy-loaded `loadComponent` pattern consistent with existing routes. No changes to the root `''` route or any existing routes.

## Architecture Context

- `app.routes.ts` currently has: `''` (HomeComponent), `gallery`, `privacy-policy`, `terms-of-service`, `admin/**`, `**` (NotFoundComponent)
- `AppComponent` renders `<router-outlet>` — routed pages are full-page components
- Pattern for lazy loading:
  ```typescript
  loadComponent: () => import('./path/to/component').then(m => m.ComponentName)
  ```
- New routes needed:
  - `repertoire/recommendations` → `RecommendationsComponent`
  - `repertoire/library` → `LibraryComponent`
- Use a parent `repertoire` path with `children` array for clean URL nesting
- The `**` wildcard must remain LAST in the routes array

## Tasks

### Task 6.1 — Add Repertoire Child Routes

<read_first>
- frontend/src/app/app.routes.ts
</read_first>

<action>
Add a `repertoire` parent route with children BEFORE the `**` wildcard in `app.routes.ts`.

The new routes block to insert (add before the `**` route):

```typescript
{
    path: 'repertoire',
    children: [
        {
            path: 'recommendations',
            loadComponent: () => import('./components/website/repertoire/recommendations/recommendations.component')
                .then(m => m.RecommendationsComponent)
        },
        {
            path: 'library',
            loadComponent: () => import('./components/website/repertoire/library/library.component')
                .then(m => m.LibraryComponent)
        },
        {
            path: '',
            redirectTo: 'recommendations',
            pathMatch: 'full'
        }
    ]
},
```

Final `app.routes.ts` should look like:

```typescript
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'admin',
        children: [
            {
                path: '',
                loadComponent: () => import('./components/admin/admin-login/admin-login.component').then(m => m.AdminLoginComponent)
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./components/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
                canActivate: [authGuard]
            }
        ]
    },
    {
        path: '',
        loadComponent: () => import('./components/website/home/home.component').then(m => m.HomeComponent)
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
        path: 'repertoire',
        children: [
            {
                path: 'recommendations',
                loadComponent: () => import('./components/website/repertoire/recommendations/recommendations.component')
                    .then(m => m.RecommendationsComponent)
            },
            {
                path: 'library',
                loadComponent: () => import('./components/website/repertoire/library/library.component')
                    .then(m => m.LibraryComponent)
            },
            {
                path: '',
                redirectTo: 'recommendations',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '**',
        loadComponent: () => import('./components/website/not-found/not-found.component').then(m => m.NotFoundComponent)
    }
];
```
</action>

<acceptance_criteria>
- `frontend/src/app/app.routes.ts` contains `path: 'repertoire'` parent route
- Contains `path: 'recommendations'` child with `loadComponent` pointing to `recommendations.component`
- Contains `path: 'library'` child with `loadComponent` pointing to `library.component`
- Contains `path: ''` child with `redirectTo: 'recommendations'`
- `path: '**'` wildcard is still the LAST route in the array
- No existing routes have been modified or removed
- Import for `authGuard` preserved
</acceptance_criteria>

## Verification

```bash
# Repertoire routes exist
grep "path: 'repertoire'" frontend/src/app/app.routes.ts
grep "recommendations.component" frontend/src/app/app.routes.ts
grep "library.component" frontend/src/app/app.routes.ts

# Wildcard still last
tail -5 frontend/src/app/app.routes.ts | grep "\*\*"

# No syntax errors (TypeScript compile check)
cd frontend && npx tsc --noEmit 2>&1 | head -20
```

## Success Criteria

- [ ] `app.routes.ts` has `path: 'repertoire'` with two children: `recommendations` and `library`
- [ ] Both children use lazy `loadComponent`
- [ ] `path: ''` redirectTo `recommendations` for bare `/repertoire` URL
- [ ] `**` wildcard remains last
- [ ] `npx tsc --noEmit` passes (no TypeScript errors)
