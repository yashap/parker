/**
 * Test env vars. This file must run before `setup.ts` (and thus before any application module is imported), because
 * modules like `src/config.ts` read env vars at import time. Tests assume `pnpm db:migrate-up:test` has been run from
 * the repo root first.
 */
export {}

process.env['DATABASE_URL'] = 'postgresql://parking:parking_password@localhost:6441/parking?schema=public'
process.env['LOG_LEVEL'] = process.env['LOG_LEVEL'] ?? 'off'
