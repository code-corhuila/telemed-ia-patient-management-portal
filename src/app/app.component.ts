import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <header class="app-header">
      <h1>TeleMed IA — Portal de Pacientes</h1>
    </header>
    <main class="app-main">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [
    `
      .app-header {
        padding: 1rem;
        background: var(--color-primary);
        color: white;
      }
      .app-header h1 { margin: 0; font-size: 1.25rem; }
      .app-main { padding: 1.5rem; max-width: 720px; margin: 0 auto; }
    `,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {}