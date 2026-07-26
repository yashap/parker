/**
 * Test env vars. This file must run before `setup.ts`, so that env vars are set before any module that reads them is
 * imported. Tests assume `pnpm db:migrate-up:test` has been run from the repo root first.
 */
export {}

process.env['DATABASE_URL'] = 'postgresql://dev_admin:dev_admin_password@localhost:6441/drizzle_utils?schema=public'
process.env['LOG_LEVEL'] = process.env['LOG_LEVEL'] ?? 'off'
