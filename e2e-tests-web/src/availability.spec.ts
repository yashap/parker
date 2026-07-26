import { type Page } from '@playwright/test'
import { expect, test } from './fixtures/preflight.js'
import { signUpNewUser } from './helpers/auth.js'
import { visibleTestId } from './helpers/locators.js'
import { createParkingSpotViaUi } from './helpers/parkingSpots.js'

const openConfigureAvailability = async (page: Page, parkingSpotId: string): Promise<void> => {
  await visibleTestId(page, `configureAvailability-${parkingSpotId}`).click()
  await expect(visibleTestId(page, 'configureAvailabilityScreen')).toBeVisible()
}

const saveAndReturnToList = async (page: Page): Promise<void> => {
  await visibleTestId(page, 'saveAvailability').click()
  await expect(visibleTestId(page, 'parkingSpotsListScreen')).toBeVisible()
}

test('add a weekly availability rule and verify it persists', async ({ page }) => {
  await signUpNewUser(page)
  const parkingSpotId = await createParkingSpotViaUi(page)

  await openConfigureAvailability(page, parkingSpotId)
  await visibleTestId(page, 'addDay-Monday').click()
  const mondayRule = visibleTestId(page, 'timeRule-Monday')
  await expect(mondayRule).toBeVisible()
  // Default times for a new rule
  await expect(mondayRule).toContainText('09:00')
  await expect(mondayRule).toContainText('17:00')

  await saveAndReturnToList(page)

  // Reopen — the rule was persisted on the backend
  await openConfigureAvailability(page, parkingSpotId)
  await expect(visibleTestId(page, 'timeRule-Monday')).toBeVisible()
  await expect(visibleTestId(page, 'timeRule-Monday')).toContainText('09:00')
  // Monday is no longer offered under "Add Day"
  await expect(visibleTestId(page, 'addDay-Monday')).toHaveCount(0)
  await expect(visibleTestId(page, 'addDay-Tuesday')).toBeVisible()
})

// Adds an override through the editor modal, accepting its defaults (available, now → now + 1h),
// so no date/time picker interaction is needed. The Menu-driven "quick override" buttons can't be
// covered — react-native-paper's Menu never opens on web (see README, "Known coverage gaps").
test('add an override via the editor modal and verify it persists', async ({ page }) => {
  await signUpNewUser(page)
  const parkingSpotId = await createParkingSpotViaUi(page)

  await openConfigureAvailability(page, parkingSpotId)
  await visibleTestId(page, 'addOverride').click()
  await visibleTestId(page, 'saveOverrideEditor').click()
  await expect(visibleTestId(page, 'overrideItem-0')).toBeVisible()
  await expect(visibleTestId(page, 'overrideItem-0')).toContainText('Available')

  await saveAndReturnToList(page)

  // Reopen — the override was persisted on the backend
  await openConfigureAvailability(page, parkingSpotId)
  await expect(visibleTestId(page, 'overrideItem-0')).toBeVisible()
  await expect(visibleTestId(page, 'overrideItem-0')).toContainText('Available')
})
