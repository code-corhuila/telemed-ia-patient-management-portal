import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiClientService } from 'shell/apiClient';
import {
  CreatePatientPayload,
  Page,
  Patient,
  UpdatePatientPayload,
} from '../model/patient';

/**
 * Typed calls against the patient domain, through the shell's HTTP client.
 *
 * Per norm 5.4.1 the portal MUST NOT create its own HttpClient. It consumes
 * `shell/apiClient`, which already attaches the token, the correlation id,
 * the timeout and the error normalisation.
 */
@Injectable({ providedIn: 'root' })
export class PatientApiService {
  private readonly api = inject(ApiClientService);

  getMyProfile(): Observable<Patient> {
    return this.api.get<Patient>('/patients/me');
  }

  updateMyProfile(payload: UpdatePatientPayload): Observable<Patient> {
    return this.api.put<Patient>('/patients/me', payload);
  }

  createProfile(payload: CreatePatientPayload, idempotencyKey: string): Observable<Patient> {
    return this.api.post<Patient>('/patients', payload, idempotencyKey);
  }

  list(page = 1, limit = 20): Observable<Page<Patient>> {
    return this.api.getWithParams<Page<Patient>>('/patients', { page, limit });
  }
}