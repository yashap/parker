import { expect, type Page } from '@playwright/test'
import { FIXTURE_ADDRESS_LABEL, FIXTURE_ADDRESS_QUERY } from '../fixtures/googleMapsFixtureServer.js'
import { visibleTestId } from './locators.js'

/**
 * From the parking spots list, create a parking spot at the fixture address (served by the
 * Google Maps fixture server) and land back on the list. Returns the new spot's id, read from its
 * card's testID. Assumes the logged-in user is fresh (their list contains only spots created here).
 */
export const createParkingSpotViaUi = async (page: Page): Promise<string> => {
  const existingIds = await parkingSpotIds(page)

  await visibleTestId(page, 'addParkingSpotCard').click()
  await expect(visibleTestId(page, 'newParkingSpotScreen')).toBeVisible()

  await visibleTestId(page, 'addressInput').fill(FIXTURE_ADDRESS_QUERY)
  await visibleTestId(page, 'addressSuggestion-0').click()
  await expect(visibleTestId(page, 'selectedLocationPanel')).toBeVisible()
  await expect(visibleTestId(page, 'selectedLocationPanel')).toContainText(FIXTURE_ADDRESS_LABEL)

  await visibleTestId(page, 'submitParkingSpot').click()
  await expect(visibleTestId(page, 'parkingSpotsListScreen')).toBeVisible()

  await expect
    .poll(async () => (await parkingSpotIds(page)).length, { message: 'new parking spot card should appear' })
    .toBe(existingIds.length + 1)
  const newIds = (await parkingSpotIds(page)).filter((id) => !existingIds.includes(id))
  expect(newIds).toHaveLength(1)
  return newIds[0] ?? ''
}

/**
 * The ids of the parking spots shown on the (visible) list screen, in list order. Note that
 * react-native-paper's Card renders its testID on two nested elements (`x` and `x-container`), so
 * the `-container` duplicates are excluded.
 */
export const parkingSpotIds = async (page: Page): Promise<string[]> => {
  const testIds = await visibleTestId(page, 'parkingSpotsListScreen')
    .locator('[data-testid^="parkingSpotCard-"]:not([data-testid$="-container"])')
    .evaluateAll((elements) => elements.map((element) => element.getAttribute('data-testid') ?? ''))
  return testIds.map((testId) => testId.replace('parkingSpotCard-', ''))
}
