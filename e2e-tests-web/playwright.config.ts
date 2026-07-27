import { defineConfig, devices } from '@playwright/test'
import { FIXTURE_LOCATION } from './src/fixtures/googleMapsFixtureServer.js'

const expoWebUrl = process.env['PARKER_WEB_URL'] ?? 'http://localhost:9081'

export default defineConfig({
  testDir: './src',
  globalSetup: './src/fixtures/globalSetup.ts',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  reporter: process.env['CI'] ? [['list'], ['html', { open: 'never' }]] : 'list',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: expoWebUrl,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    // Grant geolocation near the fixture address, so the app's useDeviceLocation hook resolves
    // deterministically (instead of hanging on a permission prompt) and location-biased
    // place-suggestion searches behave the same on every machine.
    permissions: ['geolocation'],
    geolocation: { latitude: FIXTURE_LOCATION.latitude, longitude: FIXTURE_LOCATION.longitude },
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
})
