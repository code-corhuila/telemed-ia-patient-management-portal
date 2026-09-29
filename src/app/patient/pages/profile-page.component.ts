import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { ApiError } from 'shell/apiError';
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

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [ProfileFormComponent],
  template: `
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