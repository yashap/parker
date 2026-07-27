/**
 * Test env vars. This file must run before `setup.ts`, so that env vars are set before any module that reads them is
 * imported.
 */
export {}

process.env['LOG_LEVEL'] = process.env['LOG_LEVEL'] ?? 'off'
