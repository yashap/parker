# user

Auth for Parker — signup, login, logout, session refresh, password reset.

This service is **almost entirely SuperTokens surface area**: it has no ts-rest contract, no controllers, no
routes of its own, and no database. `src/main.ts` calls `initLoginServiceSuperTokens(...)` (the
`EmailPassword` + `Session` recipe preset from `@parker/fastify-utils`) and then builds a standard Fastify app
with an empty `registerRoutes`. The SuperTokens Fastify plugin registered inside `FastifyAppBuilder` serves
everything under `/auth/*`.

- Runs on `:4503` (`PORT`)
- `/auth` is SuperTokens' _default_ `apiBasePath` — it isn't declared server-side. The one place it's written
  explicitly is the frontend's SuperTokens init (`frontends/landlord/src/app/_layout.tsx`)
- Needs the SuperTokens core container to be running, or every auth request fails with
  `Error: No SuperTokens core available to query`

```bash
pnpm serve:user     # tsx watch, from the repo root — also starts the SuperTokens container
```

Note that `pnpm --filter @parker/user serve` starts the service _without_ the SuperTokens container, because the
turbo sidecar only applies when the task runs through turbo. Prefer the root script.

## Config

Everything has a dev default (see `src/config.ts`):

| Variable               | Default                                          |
| ---------------------- | ------------------------------------------------ |
| `PORT`                 | `4503`                                           |
| `HOST_NAME`            | `http://localhost` (→ `apiDomain` with the port) |
| `ENVIRONMENT`          | `dev`                                            |
| `PARKER_WEB_URL`       | `http://localhost:9081` (→ `websiteDomain`)      |
| `SUPERTOKENS_CORE_URL` | `http://localhost:4567`                          |
| `SUPERTOKENS_API_KEY`  | unset                                            |

## Tests

There are no unit/integration tests in this workspace — `pnpm test` passes trivially via
`vitest --passWithNoTests`. Auth behaviour is covered end-to-end instead, by `e2e-tests-web/src/auth.spec.ts`
and the signup helper used by every other e2e spec.
