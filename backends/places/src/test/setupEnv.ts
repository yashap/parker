/**
 * Test env vars. This file must run before `setup.ts` (and thus before any application module is imported), because
 * modules like `src/config.ts` read env vars at import time.
 */
export {}

process.env['GOOGLE_MAPS_API_KEY'] = 'fake-google-maps-api-key'
process.env['LOG_LEVEL'] = process.env['LOG_LEVEL'] ?? 'off'
