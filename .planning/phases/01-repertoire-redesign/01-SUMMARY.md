---
phase: 1
plan: 01
subsystem: core/services
tags: [supabase, storage, signals, ssr]
key-files:
  created:
    - frontend/src/app/core/services/repertoire-image.service.ts
---

# Plan 01 — RepertoireImageService: COMPLETE

## What Was Built

Created `RepertoireImageService` — a reactive Angular service that fetches image public URLs from the Supabase `repertoire` storage bucket. Exposes signals for each folder's image list. SSR-safe via `isPlatformBrowser` guard.

**Deviation:** Plan called `supabase.getPublicUrl()` (async wrapper) directly in `.map()`. This would yield `Promise<string>` instead of `string`. Fixed by calling `supabase.client.storage.from(BUCKET).getPublicUrl(path).data.publicUrl` directly (synchronous), avoiding Promise wrapping inside `.map()`.

## Commits

| Task | Commit | Description |
|------|--------|-------------|
| 1.1 | 5cd8bee | feat(phase-1-01): create RepertoireImageService with signals and SSR guard |

## Self-Check: PASSED

- [x] `repertoire-image.service.ts` exists with `@Injectable({ providedIn: 'root' })`
- [x] Four image signals exported (recommendations, library70s90s, library2000s, library2010s)
- [x] `loadAll()` is SSR-safe (isPlatformBrowser guard)
- [x] `fetchFolder()` filters `.webp` files only
