/**
 * Type declarations for the modules the shell (`telemed-ia-front`) exposes
 * to every domain portal via Native Federation.
 *
 * At runtime these are resolved by the import map generated at bootstrap.
 * At build time TypeScript needs the shapes to type-check.
 */

declare module 'shell/apiClient' {
  import { Observable } from 'rxjs';

  export class ApiClientService {
    get<T>(path: string): Observable<T>;
    getWithParams<T>(path: string, params: Record<string, string | number>): Observable<T>;
    post<T>(path: string, body: unknown, idempotencyKey: string): Observable<T>;
    put<T>(path: string, body: unknown): Observable<T>;
    delete<T>(path: string): Observable<T>;
  }
}

declare module 'shell/session' {
  export class SessionService {
    getToken(): string | null;
    isAuthenticated(): boolean;
    signIn(token: string): void;
    signOut(): void;
  }
}

declare module 'shell/apiError' {
  export interface ApiError {
    status: number;
    code: string;
    message: string;
    details?: ReadonlyArray<{ field: string; message: string }>;
    traceId?: string;
  }
  export const TIMEOUT_STATUS: number;
  export const TIMEOUT_CODE: string;
}