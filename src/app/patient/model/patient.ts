/**
 * Domain types. They mirror the JSON contract of `-api` in camelCase.
 */

export interface Patient {
  id: string;
  userId: string;
  birthDate: string | null;
  phone: string | null;
  medicalHistory: string | null;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePatientPayload {
  birthDate: string | null;
  phone: string | null;
  medicalHistory: string | null;
  description: string | null;
}

export type UpdatePatientPayload = CreatePatientPayload;
