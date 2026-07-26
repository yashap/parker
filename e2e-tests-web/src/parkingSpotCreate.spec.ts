import { FIXTURE_ADDRESS_LABEL, FIXTURE_ADDRESS_QUERY } from './fixtures/googleMapsFixtureServer.js'
import { expect, test } from './fixtures/preflight.js'
import { signUpNewUser } from './helpers/auth.js'
import { visibleTestId } from './helpers/locators.js'
import { createParkingSpotViaUi } from './helpers/parkingSpots.js'

test('create a parking spot via address autocomplete', async ({ page }) => {
  await signUpNewUser(page)

  const parkingSpotId = await createParkingSpotViaUi(page)

  await expect(visibleTestId(page, `parkingSpotCard-${parkingSpotId}`)).toContainText(FIXTURE_ADDRESS_LABEL)
})

test('searching for an unknown address shows no suggestions', async ({ page }) => {
  await signUpNewUser(page)

  await visibleTestId(page, 'addParkingSpotCard').click()
  await expect(visibleTestId(page, 'newParkingSpotScreen')).toBeVisible()

  // First prove the fixture address produces a suggestion, so "no suggestions" below is
  // meaningful (and not just the request never happening)
  await visibleTestId(page, 'addressInput').fill(FIXTURE_ADDRESS_QUERY)
  await expect(visibleTestId(page, 'addressSuggestion-0')).toBeVisible()

  // Then an unknown address (the fixture server's ZERO_RESULTS path) clears them
  await visibleTestId(page, 'addressInput').fill('zzz-no-such-place')
  await expect(visibleTestId(page, 'addressSuggestion-0')).toHaveCount(0)

  // Nothing selected — no location panel appears
  await expect(visibleTestId(page, 'selectedLocationPanel')).toHaveCount(0)
})
