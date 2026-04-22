import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  LucideAngularModule,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  ArrowRight,
  X,
  Search,
  CircleDot,
  Music,
  User,
  Mail,
  MessageSquare
} from 'lucide-angular';
import { LanguageService } from './core/services/language.service';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, 
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled'
      })
    ),
    provideHttpClient(withFetch()),
    provideAnimations(),
    importProvidersFrom(
      LucideAngularModule.pick({
        ChevronLeft,
        ChevronRight,
        ArrowUpRight,
        ArrowRight,
        X,
        Search,
        CircleDot,
        Music,
        User,
        Mail,
        MessageSquare
      })
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: (langService: LanguageService) => () => langService.init(),
      deps: [LanguageService],
      multi: true
    }
  ]
};
