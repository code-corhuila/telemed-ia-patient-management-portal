# telemed-ia-patient-management-portal

Web UI of the **patient-management** bounded context of TeleMed IA.

Part of team `telemed-ia`, Grupo 2.

## What this repo is

An Angular 21 remote that is loaded by the shell (`telemed-ia-front`) via Native Federation. The shell owns the HTTP client, the session and the layout; this portal only contributes the patient screens.

Per norm 5.4.1, this portal **must not** create its own HTTP client or session handling. Both come from the shell:

```typescript
import { ApiClientService } from 'shell/apiClient';
import { SessionService } from 'shell/session';
import { ApiError } from 'shell/apiError';
```

## Structure

```text
.
├── src/app/patient/
│   ├── components/         ProfileFormComponent
│   ├── data/               PatientApiService (uses shell/apiClient)
│   ├── model/              Patient, Page<T>, payload types
│   ├── pages/              ProfilePageComponent (4 states)
│   └── patient.routes.ts   exposed as ./routes via Native Federation
├── deploy/
│   ├── Dockerfile          Node 22 → nginx 1.27
│   ├── nginx.conf          SPA fallback + CORS + no-cache for remoteEntry.json
│   └── compose.yml         publishes port 4201 to the host
├── federation.config.js    exposes ./routes as remote "patient"
└── README.md
```

## Local development

The portal **cannot run standalone**: it needs the shell to provide
`shell/apiClient` and `shell/session` at runtime.

### Running alongside the shell

1. Start the shell (`telemed-ia-front`) in one terminal:

```bash
cd ../telemed-ia-front
npm start        # http://localhost:4200
```

2. Start this portal in another terminal:

```bash
npm install
npm start        # http://localhost:4201
```

3. Open `http://localhost:4200` in the browser. The shell loads this portal
   as a remote at the `/patient` route.

The shell's `public/federation.manifest.json` already points to:

```text
http://localhost:4201/remoteEntry.json
```

### Build

```bash
npm run build
```

Output goes to:

```text
dist/telemed-ia-patient-management-portal/
```

including:

```text
remoteEntry.json
```

## Docker

```bash
docker network create platform
docker compose -f deploy/compose.yml up -d --build
```

The portal is published on **port 4201** so the browser can fetch its
`remoteEntry.json`. The CORS policy in `deploy/nginx.conf` allows only the
shell's origins.

## Why this portal publishes a port

Every other service in the system is reachable only through the gateway, except
the shell (`-front`). Portals are the other exception: the browser loads their
`remoteEntry.json` and chunks directly, because Module Federation runs in the
browser, not through the gateway.

This is documented in the README of `telemed-ia-infra`.

## Related documentation

* Annex H of the repo norm.
* `telemed-ia-front/README.md` (the shell's contracts).
* `telemed-ia-docs/00-governance/branching-policy.md`.
