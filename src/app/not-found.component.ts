import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="state state--error">
      <h2>Página no encontrada</h2>
      <p>La ruta que pediste no existe.</p>
      <a routerLink="/patient/profile">Volver al perfil</a>
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFoundComponent {}