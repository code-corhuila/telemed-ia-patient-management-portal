import {
  ApplicationConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

/**
 * Portal application config.
 *
 * The portal does NOT provide its own HttpClient or session handling.
 * Both are injected by the shell (telemed-ia-front) via Native Federation.
 * Until the shell exists, we provide a development-only fallback in
 * `shell-contract.ts`.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    provideRouter(routes),
  ],
};