import { test as base } from '@playwright/test'

export const EXPO_WEB_URL = process.env['PARKER_WEB_URL'] ?? 'http://localhost:9081'
export const PARKING_URL = process.env['PARKING_URL'] ?? 'http://localhost:4501'
export const PLACES_URL = process.env['PLACES_URL'] ?? 'http://localhost:4502'
export const USER_URL = process.env['USER_URL'] ?? 'http://localhost:4503'
export const SUPERTOKENS_CORE_URL = process.env['SUPERTOKENS_CORE_URL'] ?? 'http://localhost:4567'

const checkReachable = async (label: string, url: string): Promise<void> => {
  try {
    const response = await fetch(url)
    // Any HTTP response is fine — we just need the service to be answering
    void response
  } catch (error) {
    throw new Error(
      `[e2e] ${label} is not reachable at ${url}. Make sure you started it manually before running the e2e tests. ` +
        `See e2e-tests-web/README.md for the prerequisite commands. Underlying error: ${(error as Error).message}`
    )
  }
}

export const test = base.extend({
  page: async ({ page }, use) => {
    await checkReachable('Expo Web', EXPO_WEB_URL)
    await checkReachable('parking', PARKING_URL)
    await checkReachable('places', PLACES_URL)
    await checkReachable('user', USER_URL)
    await checkReachable('SuperTokens core', `${SUPERTOKENS_CORE_URL}/hello`)
    // No database cleanup intentionally — each test signs up with a unique email + Playwright
    // gives every test a fresh browser context (no cookies / storage), so tests are self-isolating
    // and never touch your local dev accounts or parking spots. The only residue is throwaway
    // users (and their spots), scoped to those users.
    await use(page)
  },
})

export { expect } from '@playwright/test'
