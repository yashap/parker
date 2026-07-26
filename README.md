# Parker

Monorepo for the **Parker** parking app — landlords list parking spots, renters book them.

## Local dev

### Initial setup

- [nvm](https://github.com/nvm-sh/nvm)
  - For managing multiple node versions
  - Suggest setting up `nvm` to [auto-switch to the right node version on cd](https://github.com/nvm-sh/nvm#deeper-shell-integration)
  - The pinned version lives in `.nvmrc` (currently `v24.18.0`); `engines.node` requires `>=24.0.0`

- [pnpm](https://pnpm.io/installation)

  ```bash
  npm install -g pnpm
  ```

  - The version is pinned by the `packageManager` field in the root `package.json` (currently `pnpm@11.17.0`)
  - Note we do **not** use `corepack` — it's deprecated as of Node 24, so install pnpm globally instead
  - If you run `which pnpm`, it should show something like `~/.nvm/versions/node/<node_version>/bin/pnpm`

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
  - For your local platform, e.g. [Docker for Mac](https://docs.docker.com/desktop/install/mac-install/) for a Mac
  - Used for the dev/test Postgres containers and the SuperTokens core container

- [XCode](https://en.wikipedia.org/wiki/Xcode) — only needed if you want to run the iOS simulator
  - Ensure XCode is installed, with command line tools
  - Ensure you can open a simulated iPhone with Simulator, and it starts up properly
  - You do **not** need `cmake` — the landlord app runs through Expo's managed workflow (there are no
    checked-in `ios/` or `android/` directories), so there's no local native build step

- Sync the workspace — installs pnpm deps, brings up the dev/test Postgres containers, and runs migrations
  against both:

  ```bash
  nvm use
  pnpm sync
  ```

- Install the Playwright browser for the web e2e tests (chromium is the only configured project):

  ```bash
  pnpm --filter @parker/e2e-tests-web exec playwright install chromium
  ```

### Useful commands

All of these are run from the root of the repo. Most wrap a `turbo run` command so they take advantage of
Turborepo caching. To run a task against a single workspace, use `pnpm --filter <workspace> <task>`, where the
workspace is the `name` from its `package.json` — e.g. `pnpm --filter @parker/geography test`.

Very common:

```bash
# Install pnpm deps + ensure DBs are up + run migrations (dev & test)
pnpm sync

# In own terminal: serve all backends (parking, places, user + the SuperTokens core container, in parallel via turbo)
pnpm serve:backend

# In own terminal: the Expo app
pnpm serve:landlord       # iOS simulator
pnpm serve:landlord:web   # web, on :9081 — this is what the e2e tests drive

# Lint (prettier check + per-workspace tsc --noEmit + eslint) and format
pnpm lint
pnpm format

# Vitest unit + integration tests (no e2e)
pnpm test

# Playwright web e2e tests — backends and the Expo web app must already be running
pnpm test:e2e:web

# Compile every workspace to dist/ (only needed to verify the production build; dev never needs it)
pnpm build
```

Less common:

```bash
# Serve a single backend (each brings up the SuperTokens container alongside it — see below)
pnpm serve:parking
pnpm serve:places
pnpm serve:user

# Apply migrations to the dev DB / the test DB
pnpm db:migrate-up
pnpm db:migrate-up:test

# Author a new migration (per-backend; see the parking README for the full workflow)
pnpm --filter @parker/parking db:generate-migration <migration_name>

# Dev fixtures: snapshot the current dev DB / restore the committed snapshot
pnpm db:dump-fixtures
pnpm db:restore-fixtures

# Tear down the Postgres containers + volumes
pnpm db:clean

# Nuke node_modules, dist, DBs, etc.
pnpm clean
```

Note also the more detailed e2e docs: [the web e2e README](./e2e-tests-web/README.md) covers how to bring up
the full stack, state isolation, and the known coverage gaps.

### Serving a single backend

`pnpm serve:backend` runs `turbo run serve --filter='./backends/*' --parallel`, which covers all three Fastify
services **and** `@parker/supertokens` (the SuperTokens core container), because that lives in `backends/` too.

All three backends initialise the SuperTokens SDK, so none of them are useful without the core running — an
auth'd request fails with `Error: No SuperTokens core available to query`. Each backend therefore declares the
container as a turbo sidecar, in e.g. `backends/user/turbo.json`:

```json
{
  "extends": ["//"],
  "tasks": {
    "serve": { "cache": false, "persistent": true, "with": ["@parker/supertokens#serve"] }
  }
}
```

Two things worth knowing:

- `with` is a **turbo** feature, so it only applies when the task is run through turbo. `pnpm serve:user`
  (which is `turbo run serve --filter=@parker/user`) starts the container; running the package script directly
  via `pnpm --filter @parker/user serve` **bypasses turbo entirely** and does not. Prefer the root scripts.
- Turbo dedupes the sidecar, so `pnpm serve:backend` still starts exactly one SuperTokens container even
  though all three backends declare it.

## The no-compile workspace deps story

Internal workspace packages use a conditional `exports` map. The `"development"` condition points at TS source;
`"default"` points at compiled JS:

```json
"exports": {
  ".": {
    "development": "./src/index.ts",
    "types": "./dist/index.d.ts",
    "default": "./dist/index.js"
  }
}
```

Every consumer has to be told to prefer the `development` condition. Each does it its own way, and the
condition lists are deliberately **not** identical — each is the minimum that tool needs:

| Consumer            | How it opts in                                                                                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tsc` / IDE         | `packages/tsconfig/base.json` sets `moduleResolution: "bundler"` + `customConditions: ["development"]`                                                              |
| Fastify dev servers | `tsx watch --conditions=development src/main.ts` (each backend's `serve` script)                                                                                    |
| Vitest              | `resolve.conditions = ['development', 'import', 'node']` in each `vitest.config.ts`                                                                                 |
| ESLint              | `eslint-import-resolver-typescript` with `conditionNames: ['development', 'types', 'import', 'require', 'node', 'default']`                                         |
| Expo / Metro        | `unstable_enablePackageExports: true` + `unstable_conditionNames: ['development', 'react-native', 'browser', 'require', 'import']`, plus a `.js`→`.ts` shim (below) |
| Production          | plain `node dist/main.js` — no conditions flag, so `default` wins → compiled JS                                                                                     |

Because the TS resolver follows `development` straight to `src/`, **a fresh clone can lint and typecheck with
zero `dist/` built** — `pnpm install && pnpm lint` works on its own. `pnpm build` is only needed to produce or
verify the production artifacts.

The one wrinkle is Metro. Our TS source uses NodeNext-style `.js` extensions on relative imports (required for
production Node ESM), and Metro doesn't rewrite those itself. So `frontends/landlord/metro.config.js` adds a
`resolveRequest` hook that retries `.js` specifiers as `.ts`/`.tsx` — but only for relative imports whose
_importer_ sits under `packages/` or `backends/` and outside `node_modules`, so third-party resolution is
untouched.

Net effect: editing `packages/errors/src/something.ts` is picked up immediately by the running Fastify
services, by Metro, and by Vitest. There is no `tsc --watch` running anywhere.

### ESM conventions

A few things the ESM + `"type": "module"` setup forces, which are easy to get wrong:

- **Relative imports carry `.js` suffixes**, even though the file on disk is `.ts` — e.g.
  `import { config } from './config.js'`. This is what makes the compiled output valid Node ESM.
- **`lodash` must be imported per-method**, with the extension: `import omit from 'lodash/omit.js'`. The
  top-level `import { omit } from 'lodash'` does not resolve under ESM.
- **`extendable-error` needs the named import**: `import { ExtendableError } from 'extendable-error'`.
- **No `dotenv`.** Each backend has a `src/config.ts` with small `env()` / `required()` helpers and inline dev
  defaults, so the services boot with no env setup at all. The one exception is `GOOGLE_MAPS_API_KEY`, which
  has no default and throws on startup if missing.
  - `backends/places/.env` is gitignored and loaded by `tsx --env-file-if-exists=.env` in its `serve` script.
    Node's `--env-file` never overrides variables already set in the environment, so **the shell env wins** —
    which is how the e2e tests point places at their fixture server.

## Ports

| Service                          | Port |
| -------------------------------- | ---- |
| Expo (web, Metro bundler)        | 9081 |
| Expo (iOS, Metro bundler)        | 9082 |
| Expo (Android, Metro bundler)    | 9083 |
| parking                          | 4501 |
| places                           | 4502 |
| user                             | 4503 |
| SuperTokens core                 | 4567 |
| Postgres (dev)                   | 6440 |
| Postgres (test)                  | 6441 |
| Google Maps fixture server (e2e) | 4599 |

## Stack

| Layer            | Tech                                                                     |
| ---------------- | ------------------------------------------------------------------------ |
| Monorepo         | pnpm workspaces + Turborepo                                              |
| Language         | TypeScript (ESM throughout, no compile step in dev)                      |
| Database         | Postgres + PostGIS (`postgis/postgis:15-3.3`), Drizzle ORM + drizzle-kit |
| Backend services | Fastify 4 + ts-rest + zod                                                |
| Auth             | SuperTokens (self-hosted core container + `supertokens-node`)            |
| Frontend         | React Native + Expo (SDK 57) + Expo Router + NativeWind                  |
| Tests            | Vitest (unit + integration), Playwright (web e2e)                        |
| CI               | GitHub Actions — `lint`, `test`, `e2e-web` jobs                          |

## Architecture notes

- **API contracts are ts-rest + zod**, defined in `packages/parking-client` and `packages/places-client`. The
  contract is the single source of truth: the backend registers it with `@ts-rest/fastify` (with response
  validation on) and the frontend consumes the generated client. Contracts set their own `pathPrefix` —
  `/parking` and `/places`.
- **Routes are plain functions**, registered per domain — e.g.
  `registerParkingSpotRoutes(app, { parkingSpotRepository })`. There is no DI container: each `main.ts`
  constructs its dependencies by hand and passes them down (which is also what lets tests build an app with
  fakes injected).
- **`@parker/fastify-utils` owns the shared app shell** — `FastifyAppBuilder`, the correlation-id and
  HTTP-logging plugins, the error handler that maps our error types to response DTOs, the auth helpers
  (`requireSession` / `getSessionUserId`, plus a test-only `mockAuth` bypass), and the two `initSuperTokens`
  presets. See [its README](./packages/fastify-utils/README.md).
- **The `user` service has no routes of its own** — the SuperTokens Fastify plugin serves all of `/auth/*`.

## Testing

- **Vitest** (`pnpm test`) — unit tests plus backend integration tests. Tests that touch the DB run against the
  real **test** Postgres on `:6441`, not a mock, so run `pnpm db:migrate-up:test` (or `pnpm sync`) first on a
  fresh clone. There's no root vitest config; each workspace has its own `vitest.config.ts`. DB-touching
  workspaces disable file parallelism so they don't fight over tables.
- **Playwright** (`pnpm test:e2e:web`) — drives the Expo web build in a real browser against the full running
  stack. It starts **no** services for you; see [the web e2e README](./e2e-tests-web/README.md) for the
  bring-up sequence, and note the Google Maps calls are stubbed by a fixture server on `:4599` rather than
  hitting the real API.

## Workspace conventions

Workspaces live in `backends/*`, `frontends/*`, `packages/*`, and `e2e-tests-web` (see
`pnpm-workspace.yaml`).

**Install an external dependency**

```bash
pnpm --filter <workspace> add <package>
pnpm --filter <workspace> add -D <package>
pnpm --filter <workspace> remove <package>

# e.g.
pnpm --filter @parker/parking add lodash
```

**Depend on another workspace package** — use the `workspace:` protocol:

```json
{
  "name": "@parker/parking",
  "dependencies": {
    "@parker/context-propagation": "workspace:*"
  }
}
```

...then run `pnpm install`.

### Adding a new app/package

- For a new package (a.k.a. library), copy `packages/geography` — it's about the smallest complete example
  (conditional exports, `tsconfig.json` + `tsconfig.build.json`, `eslint.config.mjs`, `vitest.config.ts`)
- For a new backend service, copy `backends/places` — a Fastify service with no database. Copy
  `backends/parking` if you need Drizzle + migrations
- For a new React Native app, copy `frontends/landlord`

If adding new packages becomes a pain point, we could consider writing
[Turborepo custom code generators](https://turbo.build/repo/docs/core-concepts/monorepos/code-generation).

### Dev fixtures

For local development it's useful to have some default users, parking spots, etc. set up, a.k.a. "local dev
fixtures". We do this by taking and restoring DB snapshots.

As an example, say you want to add a new parking spot to the default dev fixtures: spin up your local env, add
that parking spot in the UI, then run `pnpm db:dump-fixtures` and commit the updated `fixtures.sql`. Later,
when other people run `pnpm db:restore-fixtures`, they'll get the state you snapshotted.

## Known issues / gaps

Honest list of things that are broken, missing, or untested:

- **The landlord "quick override" buttons don't work on web.** They're built on `react-native-paper`'s `Menu`,
  which never opens under `react-native-web` in this stack — the button's `onPress` fires and the Menu mounts
  its Portal, but its internal measure loop never resolves and it unmounts again. It's an app/library defect,
  not a test artifact. Use the override editor modal instead.
- **Editing a parking spot is unimplemented** — the Edit button is a TODO alert.
- **Bookings and closest-to-point search have no UI.** Both exist in the API and are covered by API-level e2e
  tests only.
- **`react-native-paper-dates` picker paths are untested** — changing a time rule's start/end times, and
  picking custom dates/times in the override editor, both go through paper-dates modals that are brittle to
  drive from Playwright.
- **SuperTokens is pinned to SDK 23 / core 11.4.5.** `supertokens-node` 24 requires core 12, which needs a
  staged operator migration, so the upgrade is deliberately deferred.
- **`backends/user` has no tests** of its own (it has a `vitest.config.ts` but no spec files) — its behaviour
  is covered indirectly by the auth e2e specs.
- If Metro claims a file that plainly exists can't be resolved, run `watchman watch-del-all`.
