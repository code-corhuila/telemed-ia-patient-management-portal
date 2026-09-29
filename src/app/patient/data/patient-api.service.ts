import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  CreatePatientPayload,
  Page,
  Patient,
  UpdatePatientPayload,
} from '../model/patient';

/**
 * TEMPORARY implementation.
 *
 * The portal cannot import `shell/apiClient` from the shell because that
 * would break the Docker build isolation (the portal repo does not have
 * access to the sibling `telemed-ia-front` repo at build time).
 *
 * Until `telemed-ia-contracts` exists, this service reads the access token
 * directly from sessionStorage (the same place the shell stores it) and
 * calls the API through the gateway.
 *
 * Planned migration: replace with the shell's ApiClientService once a
 * shared contracts package exists (norm 5.4.1 will then be fully met).
 */
@Injectable({ providedIn: 'root' })
export class PatientApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v1';

  private headers(): HttpHeaders {
    const token = sessionStorage.getItem('telemed.access-token');
    const correlationId = crypto.randomUUID();
    let h = new HttpHeaders().set('X-Correlation-Id', correlationId);
    if (token) h = h.set('Authorization', `Bearer ${token}`);
    return h;
  }

  getMyProfile(): Observable<Patient> {
    return this.http.get<Patient>(`${this.baseUrl}/patients/me`, {
      headers: this.headers(),
    });
  }

  updateMyProfile(payload: UpdatePatientPayload): Observable<Patient> {
    return this.http.put<Patient>(`${this.baseUrl}/patients/me`, payload, {
      headers: this.headers(),
    });
  }

  createProfile(payload: CreatePatientPayload, idempotencyKey: string): Observable<Patient> {
    const h = this.headers().set('Idempotency-Key', idempotencyKey);
    return this.http.post<Patient>(`${this.baseUrl}/patients`, payload, { headers: h });
  }

  list(page = 1, limit = 20): Observable<Page<Patient>> {
    return this.http.get<Page<Patient>>(`${this.baseUrl}/patients`, {
      headers: this.headers(),
      params: { page, limit },
    });
  }
}