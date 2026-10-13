/**
 * Entry point for the portal when it runs standalone (for local development).
 *
 * In production, the portal is loaded as a remote by `telemed-ia-front`,
 * and this file is not executed. It only exists so `ng build` produces a
 * valid bundle and `ng serve` starts an app.
 */
import { initFederation } from '@angular-architects/native-federation';

initFederation()
  .catch((err) => console.error('Federation init failed', err))
  .then(() => import('./main'));