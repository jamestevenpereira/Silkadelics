---
phase: 1
plan: 01
type: execute
wave: 1
depends_on: []
files_modified:
  - frontend/src/app/core/services/repertoire-image.service.ts
autonomous: true
requirements: [repertoire-image-service]
---

# Plan 01 — RepertoireImageService

## Objective

Create a reactive Angular service that fetches image public URLs from the Supabase `repertoire` storage bucket. Exposes signals for each folder's image list. Handles SSR gracefully (no window/browser APIs).

## Architecture Context

- `SupabaseService` at `frontend/src/app/core/services/supabase.service.ts` already has:
  - `getPublicUrl(bucket: string, path: string): string` — synchronous, uses `supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl`
  - `getTransformedUrl(url, options)` — appends width/height/quality/format params
  - `client` getter — exposes raw SupabaseClient
- Supabase bucket: `repertoire`
- Folders: `our-recommendations`, `2000+`, `2010+`, `70-90`
- Images are `.webp` format
- List files in a folder: `supabase.storage.from('repertoire').list('folder-name')`

## Tasks

### Task 1.1 — Create RepertoireImageService

<read_first>
- frontend/src/app/core/services/supabase.service.ts
- frontend/src/app/core/config/supabase.config.ts (if exists)
</read_first>

<action>
Create `frontend/src/app/core/services/repertoire-image.service.ts`:

```typescript
import { Injectable, inject, signal, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { SupabaseService } from './supabase.service';

export interface RepertoireImage {
  url: string;
  name: string;
  alt: string;
}

export type RepertoireEra = '70-90' | '2000+' | '2010+';

const BUCKET = 'repertoire';

@Injectable({ providedIn: 'root' })
export class RepertoireImageService {
  private supabase = inject(SupabaseService);
  private platformId = inject(PLATFORM_ID);

  recommendations = signal<RepertoireImage[]>([]);
  library70s90s = signal<RepertoireImage[]>([]);
  library2000s = signal<RepertoireImage[]>([]);
  library2010s = signal<RepertoireImage[]>([]);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  async loadRecommendations(): Promise<void> {
    const images = await this.fetchFolder('our-recommendations');
    this.recommendations.set(images);
  }

  async loadLibraryEra(era: RepertoireEra): Promise<void> {
    const images = await this.fetchFolder(era);
    if (era === '70-90') this.library70s90s.set(images);
    else if (era === '2000+') this.library2000s.set(images);
    else this.library2010s.set(images);
  }

  async loadAll(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    this.loading.set(true);
    this.error.set(null);
    try {
      await Promise.all([
        this.loadRecommendations(),
        this.loadLibraryEra('70-90'),
        this.loadLibraryEra('2000+'),
        this.loadLibraryEra('2010+'),
      ]);
    } catch (err: any) {
      this.error.set(err?.message ?? 'Failed to load repertoire images');
    } finally {
      this.loading.set(false);
    }
  }

  private async fetchFolder(folder: string): Promise<RepertoireImage[]> {
    const { data, error } = await this.supabase.client
      .storage
      .from(BUCKET)
      .list(folder, { sortBy: { column: 'name', order: 'asc' } });

    if (error || !data) return [];

    return data
      .filter(f => f.name.endsWith('.webp'))
      .map(f => {
        const url = this.supabase.getPublicUrl(BUCKET, `${folder}/${f.name}`);
        return { url, name: f.name, alt: f.name.replace('.webp', '').replace(/-/g, ' ') };
      });
  }
}
```
</action>

<acceptance_criteria>
- File exists at `frontend/src/app/core/services/repertoire-image.service.ts`
- File contains `@Injectable({ providedIn: 'root' })`
- File contains `signal<RepertoireImage[]>` for `recommendations`, `library70s90s`, `library2000s`, `library2010s`
- File contains `signal<boolean>(false)` for `loading`
- File contains `isPlatformBrowser` import and guard in `loadAll()`
- File contains `fetchFolder` private method that calls `supabase.client.storage.from(BUCKET).list(folder)`
- File contains `RepertoireImage` and `RepertoireEra` exported interfaces
</acceptance_criteria>

## Verification

```bash
# File exists
test -f frontend/src/app/core/services/repertoire-image.service.ts && echo "EXISTS"

# Injectable decorator
grep "@Injectable" frontend/src/app/core/services/repertoire-image.service.ts

# Signals
grep "signal<RepertoireImage" frontend/src/app/core/services/repertoire-image.service.ts

# SSR guard
grep "isPlatformBrowser" frontend/src/app/core/services/repertoire-image.service.ts
```

## Success Criteria

- [ ] `repertoire-image.service.ts` exists with `@Injectable({ providedIn: 'root' })`
- [ ] Four image signals exported (recommendations, library70s90s, library2000s, library2010s)
- [ ] `loadAll()` is SSR-safe (isPlatformBrowser guard)
- [ ] `fetchFolder()` filters `.webp` files only
