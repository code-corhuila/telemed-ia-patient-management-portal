import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Patient, UpdatePatientPayload } from '../model/patient';

function birthDateNotFuture(control: AbstractControl): ValidationErrors | null {
  const value = control.value as string | null;
  if (!value) return null;
  const today = new Date().toISOString().slice(0, 10);
  return value <= today ? null : { futureBirthDate: true };
}

@Component({
  selector: 'app-profile-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
      <div class="field">
        <label for="birthDate">Fecha de nacimiento</label>
        <input
          id="birthDate"
          type="date"
          formControlName="birthDate"
          [attr.aria-describedby]="
            form.controls.birthDate.touched && form.controls.birthDate.invalid
              ? 'birthDate-error'
              : null
          "
        />
        @if (form.controls.birthDate.touched && form.controls.birthDate.invalid) {
          <span id="birthDate-error" class="error">La fecha no puede ser futura.</span>
        }
      </div>

      <div class="field">
        <label for="phone">Teléfono</label>
        <input
          id="phone"
          type="tel"
          formControlName="phone"
          maxlength="30"
          [attr.aria-describedby]="
            form.controls.phone.touched && form.controls.phone.invalid
              ? 'phone-error'
              : null
          "
        />
        @if (form.controls.phone.touched && form.controls.phone.invalid) {
          <span id="phone-error" class="error">Máximo 30 caracteres.</span>
        }
      </div>

      <div class="field">
        <label for="medicalHistory">Antecedentes médicos</label>
        <textarea
          id="medicalHistory"
          rows="3"
          formControlName="medicalHistory"
        ></textarea>
      </div>

      <div class="field">
        <label for="description">Descripción</label>
        <textarea
          id="description"
          rows="3"
          formControlName="description"
        ></textarea>
      </div>

      <button type="submit" [disabled]="submitting || form.invalid">
        {{ submitting ? 'Guardando…' : 'Guardar' }}
      </button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileFormComponent implements OnInit {
  @Input() initial: Patient | null = null;
  @Input() submitting = false;
  @Output() readonly submitted = new EventEmitter<UpdatePatientPayload>();

  private readonly fb = inject(FormBuilder);

  protected readonly form = this.fb.group({
    birthDate: this.fb.control<string | null>(null, { validators: [birthDateNotFuture] }),
    phone: this.fb.control<string | null>(null, { validators: [Validators.maxLength(30)] }),
    medicalHistory: this.fb.control<string | null>(null),
    description: this.fb.control<string | null>(null),
  });

  ngOnInit(): void {
    if (this.initial) {
      this.form.patchValue({
        birthDate: this.initial.birthDate,
        phone: this.initial.phone,
        medicalHistory: this.initial.medicalHistory,
        description: this.initial.description,
      });
    }
  }

  protected submit(): void {
    if (this.form.invalid || this.submitting) return;
    this.submitted.emit({
      birthDate: this.form.controls.birthDate.value,
      phone: this.form.controls.phone.value,
      medicalHistory: this.form.controls.medicalHistory.value,
      description: this.form.controls.description.value,
    });
  }
}