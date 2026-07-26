# parking

The parking service — owns parking spots, their time rules/overrides, and bookings. Fastify + ts-rest, backed by
Postgres with PostGIS (spot locations are `GEOMETRY(POINT,4326)`).

- API contract: `packages/parking-client`, served under the `/parking` path prefix
- Runs on `:4501` (`PORT`), auth'd via SuperTokens — a `preHandler` hook calls `requireSession` for every
  request whose URL starts with `/parking/`
- Routes are registered per domain: `registerParkingSpotRoutes(app, deps)` and
  `registerParkingSpotBookingRoutes(app, deps)`. Dependencies are constructed by hand in `src/main.ts` and
  passed into `buildApp` (`src/app.ts`), which is what lets tests build the app with fakes injected.

```bash
pnpm serve:parking                        # tsx watch, from the repo root (also starts SuperTokens)
pnpm --filter @parker/parking test        # vitest, against the test Postgres on :6441
```

## Database migrations

We use [Drizzle ORM](https://orm.drizzle.team/) + [drizzle-kit](https://orm.drizzle.team/kit-docs/overview).
Schema is defined in TypeScript, migrations are generated from the schema as plain SQL files, and applied via a
small TypeScript runner.

### Where things live

- **Schema** — `src/db/schema.ts`. Defines tables, columns, indexes and relations using Drizzle's `pgTable(...)`
  helpers. Use `standardFields` from `@parker/drizzle-utils` for the standard `id` + `createdAt` + `updatedAt`
  columns, and its `point` / `instant` / `plainTime` column helpers for PostGIS and Temporal types.
- **Migrations** — `drizzle/*.sql`. Each one is a numbered, named SQL file (e.g.
  `0001_create_initial_tables.sql`). Committed to git, run in order. **Once a migration is on `master`, treat it
  as immutable** — write a new one to fix it, don't edit it in place.
- **Migration metadata** — `drizzle/meta/`. `_journal.json` plus a JSON snapshot per migration, which drizzle-kit
  uses to diff schema versions. Committed too. Don't edit by hand.
- **Drizzle config** — `drizzle.config.ts`. Points drizzle-kit at `src/db/schema.ts`, outputs to `drizzle/`, and
  reads the DB URL from `DATABASE_URL`.
- **Runner** — `src/db/migrate.ts`. A tiny script that calls drizzle's `migrate()` against `drizzle/`. Run by
  `pnpm db:migrate-up` / `db:migrate-up:test`, which set `DATABASE_URL` to the `dev_admin` superuser —
  migrations need more privileges than the app's own `parking` user has.
- **Migration tracking table** — `drizzle.__drizzle_migrations` in Postgres. This is drizzle's default (we don't
  configure `migrationsTable`); it's created on first run and remembers which migrations have been applied.
- **Fixtures** — `fixtures.sql`, a committed `pg_dump` of a useful local dev state. See below.

### Workflow: change the schema, generate a migration, apply it

```bash
# 1. Edit src/db/schema.ts — add a column, table, index, etc.

# 2. Generate a migration from the schema diff. Provide a short snake_case name.
#    This brings up the dev Postgres first, then runs drizzle-kit generate.
pnpm --filter @parker/parking db:generate-migration add_spot_label

# 3. ALWAYS inspect the generated file at drizzle/NNNN_add_spot_label.sql before trusting it.
#    If it looks wrong, edit src/db/schema.ts and re-generate (drizzle-kit rewrites the same file).

# 4. Apply the migration against the dev DB...
pnpm db:migrate-up
# ...and against the test DB, so integration tests see the same schema.
pnpm db:migrate-up:test
```

### The over-quoting workaround

`db:generate-migration` doesn't call drizzle-kit directly — it goes through
`tools/scripts/generate_db_migration.sh`, which exists to work around a drizzle-kit bug: it emits certain SQL
**type** names wrapped in double quotes, which Postgres rejects as unknown types. The script captures
drizzle-kit's output, scrapes the generated file path out of it, and strips the bad quotes:

```bash
sed -i.bak 's/"GEOMETRY(POINT,4326)"/GEOMETRY(POINT,4326)/g' "$file_name"
sed -i.bak 's/"TIMESTAMP(3) WITH TIME ZONE"/TIMESTAMP(3) WITH TIME ZONE/g' "$file_name"
sed -i.bak 's/"TIME WITHOUT TIME ZONE"/TIME WITHOUT TIME ZONE/g' "$file_name"
```

Two consequences worth knowing:

- If you add a column of some _other_ exotic type and the generated SQL has a quoted type name, add another
  `sed` line. The whole hack can go away once the drizzle bug is fixed.
- The script identifies the output file by pattern-matching drizzle-kit's pretty-printed console output
  (`Your SQL migration file ➜ <path> 🚀`), so it's brittle against drizzle-kit CLI output changes. If migration
  generation starts failing with an empty filename after a drizzle-kit bump, that's why.

### Hand-written migrations

For things drizzle-kit can't infer — backfills, complex constraints, data migrations — generate an empty
migration and write the SQL yourself:

```bash
pnpm --filter @parker/parking db:generate-custom-migration backfill_spot_labels
# Creates drizzle/NNNN_backfill_spot_labels.sql with no content. Fill it in, commit it.
# pnpm db:migrate-up applies it like any other. (No sed workaround needed here — there's no
# drizzle-generated DDL to de-quote.)
```

### Resetting local state

```bash
# Drop just the parking DB/user (leaves the Postgres container running and other DBs intact):
pnpm --filter @parker/parking db:clean
pnpm db:migrate-up

# Snapshot the current dev DB state to fixtures.sql, for sharing seed data:
pnpm --filter @parker/parking db:dump-fixtures

# Restore the committed fixtures.sql (drops + re-creates the DB, loads the SQL, then migrates):
pnpm --filter @parker/parking db:restore-fixtures

# Nuclear option — destroy both Postgres containers (dev + test) and their volumes:
pnpm db:clean
pnpm db:migrate-up         # rebuilds the dev DB + applies all migrations
pnpm db:migrate-up:test    # same for the test DB
```

## Scripts (cheat sheet)

| Command                                                             | What it does                                                                                         |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `pnpm serve:parking` (root)                                         | `tsx watch` the service on `:4501`, plus the SuperTokens container                                   |
| `pnpm --filter @parker/parking serve`                               | `tsx watch` the service only — **no** SuperTokens sidecar (bypasses turbo)                           |
| `pnpm --filter @parker/parking build`                               | `tsc -p tsconfig.build.json` → `dist/`                                                               |
| `pnpm --filter @parker/parking start`                               | Run the compiled `dist/main.js` (after a build)                                                      |
| `pnpm --filter @parker/parking test`                                | Vitest integration tests (test Postgres on `:6441`; run `db:migrate-up:test` first on a fresh clone) |
| `pnpm --filter @parker/parking lint`                                | `tsc --noEmit` + ESLint                                                                              |
| `pnpm --filter @parker/parking db:generate-migration <name>`        | Generate a migration from the current schema diff                                                    |
| `pnpm --filter @parker/parking db:generate-custom-migration <name>` | Generate an empty migration for hand-written SQL                                                     |
| `pnpm --filter @parker/parking db:migrate-up`                       | Apply migrations against the dev Postgres (`:6440`)                                                  |
| `pnpm --filter @parker/parking db:migrate-up:test`                  | Apply migrations against the test Postgres (`:6441`)                                                 |
| `pnpm --filter @parker/parking db:clean`                            | Drop the parking DB + user from the dev container                                                    |
| `pnpm --filter @parker/parking db:clean:test`                       | Same, but for the test container                                                                     |
| `pnpm --filter @parker/parking db:dump-fixtures`                    | Dump the current parking DB to `fixtures.sql`                                                        |
| `pnpm --filter @parker/parking db:restore-fixtures`                 | Drop + re-create the DB from `fixtures.sql`, then migrate                                            |

## Config

All env vars have dev defaults (see `src/config.ts`), so the service boots with no setup:

| Variable               | Default                                                                      |
| ---------------------- | ---------------------------------------------------------------------------- |
| `PORT`                 | `4501`                                                                       |
| `HOST_NAME`            | `http://localhost`                                                           |
| `ENVIRONMENT`          | `dev`                                                                        |
| `DATABASE_URL`         | `postgresql://parking:parking_password@localhost:6440/parking?schema=public` |
| `PARKER_WEB_URL`       | `http://localhost:9081` (CORS origin)                                        |
| `SUPERTOKENS_CORE_URL` | `http://localhost:4567`                                                      |
| `SUPERTOKENS_API_KEY`  | unset                                                                        |
