import { Routes } from '@angular/router';

/**
 * Routes exposed to the shell as `patient/routes` via Native Federation.
 *
 * The shell mounts this at `/patient`, so:
 *   /patient            → redirect to /patient/profile
 *   /patient/profile    → ProfilePageComponent
 */
export const PATIENT_ROUTES: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'profile',
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile-page.component').then((m) => m.ProfilePageComponent),
  },
];