import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { ProfileFormComponent } from '../components/profile-form.component';
import { PatientApiService } from '../data/patient-api.service';
import { UpdatePatientPayload } from '../model/patient';
import { Patient } from '../model/patient';

interface ViewModel {
  readonly loading: boolean;
  readonly error: ApiError | null;
  readonly patient: Patient | null;
  readonly submitting: boolean;
}

interface ApiError {
  status: number;
  code: string;
  message: string;
  traceId?: string;
}

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [ProfileFormComponent],
  styleUrl: '../patient-theme.css',
  styles: [
    `
      .profile {
        max-width: 760px;
        margin: 0 auto;
        padding: 32px 24px;
      }

      .profile__header {
        margin-bottom: 24px;
      }

      .profile__eyebrow {
        margin: 0 0 6px;
        color: var(--color-primary);
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .profile__title {
        margin: 0;
        font-size: 28px;
        font-weight: 700;
      }

      .profile__subtitle {
        margin: 6px 0 0;
        color: var(--color-text-soft);
      }
    `,
  ],
  template: `
    <section class="profile" aria-labelledby="profile-title">
      <header class="profile__header">
        <p class="profile__eyebrow">Mi cuenta</p>
        <h1 class="profile__title" id="profile-title">Mi perfil</h1>
        <p class="profile__subtitle">Tus datos de salud para preparar cada atención.</p>
      </header>

    @if (vm().loading) {
      <section class="state" aria-live="polite">
        <p>Cargando perfil…</p>
      </section>
    } @else if (vm().error; as err) {
      <section class="state state--error" role="alert">
        <p>{{ err.message }}</p>
        @if (err.traceId) {
          <p class="small">Referencia: {{ err.traceId }}</p>
        }
        <button type="button" (click)="load()">Reintentar</button>
      </section>
    } @else if (vm().patient; as patient) {
      <app-profile-form
        [initial]="patient"
        [submitting]="vm().submitting"
        (submitted)="update($event)"
      />
    } @else {
      <section class="state state--empty">
        <p>Aún no tienes perfil. Crea uno para comenzar.</p>
        <button type="button" (click)="create()" [disabled]="vm().submitting">
          {{ vm().submitting ? 'Creando…' : 'Crear perfil' }}
        </button>
      </section>
    }
    </section>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent implements OnInit {
  private readonly api = inject(PatientApiService);

  protected readonly vm = signal<ViewModel>({
    loading: true,
    error: null,
    patient: null,
    submitting: false,
  });

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.vm.set({ loading: true, error: null, patient: null, submitting: false });
    this.api.getMyProfile().subscribe({
      next: (patient) =>
        this.vm.set({ loading: false, error: null, patient, submitting: false }),
      error: (err: ApiError) => {
        // 404 means "no profile yet" → empty state, not error.
        if (err.status === 404) {
          this.vm.set({ loading: false, error: null, patient: null, submitting: false });
        } else {
          this.vm.set({ loading: false, error: err, patient: null, submitting: false });
        }
      },
    });
  }

  protected create(): void {
    this.vm.update((s) => ({ ...s, submitting: true }));
    const key = crypto.randomUUID();
    this.api
      .createProfile(
        { birthDate: null, phone: null, medicalHistory: null, description: null },
        key,
      )
      .subscribe({
        next: (patient) =>
          this.vm.set({ loading: false, error: null, patient, submitting: false }),
        error: (err: ApiError) =>
          this.vm.set({ loading: false, error: err, patient: null, submitting: false }),
      });
  }

  protected update(payload: UpdatePatientPayload): void {
    this.vm.update((s) => ({ ...s, submitting: true }));
    this.api.updateMyProfile(payload).subscribe({
      next: (patient) =>
        this.vm.set({ loading: false, error: null, patient, submitting: false }),
      error: (err: ApiError) =>
        this.vm.set({ loading: false, error: err, patient: null, submitting: false }),
    });
  }
}