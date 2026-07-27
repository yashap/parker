import { expect, test } from './fixtures/preflight.js'
import { signUpNewUser } from './helpers/auth.js'
import { visibleTestId } from './helpers/locators.js'
import { createParkingSpotViaUi } from './helpers/parkingSpots.js'

// Note: editing a parking spot is not implemented in the app yet (the Edit button is a TODO
// alert), so this spec only covers create + delete. See README.md ("Known coverage gaps").
test('delete a parking spot removes its card from the list', async ({ page }) => {
  await signUpNewUser(page)
  const parkingSpotId = await createParkingSpotViaUi(page)
  await expect(visibleTestId(page, `parkingSpotCard-${parkingSpotId}`)).toBeVisible()

  await visibleTestId(page, `deleteParkingSpot-${parkingSpotId}`).click()

  await expect(visibleTestId(page, `parkingSpotCard-${parkingSpotId}`)).toHaveCount(0)
})
