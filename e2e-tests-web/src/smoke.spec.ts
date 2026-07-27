import { expect, test } from './fixtures/preflight.js'
import { signUpNewUser } from './helpers/auth.js'
import { visibleTestId } from './helpers/locators.js'

test('/ redirects to the log in screen', async ({ page }) => {
  await page.goto('/')
  await expect(visibleTestId(page, 'logInScreen')).toBeVisible()
})

test('signing up as a fresh user lands on the parking spots list', async ({ page }) => {
  await signUpNewUser(page)
  await expect(visibleTestId(page, 'parkingSpotsListScreen')).toBeVisible()
  await expect(visibleTestId(page, 'addParkingSpotCard')).toBeVisible()
})
