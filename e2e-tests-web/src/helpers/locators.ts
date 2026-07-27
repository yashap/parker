import { type Locator, type Page } from '@playwright/test'

/**
 * Like page.getByTestId, but filtered to visible elements. Needed because expo-router's stack
 * navigator keeps previous screens mounted (hidden) in the DOM on web, so after navigating
 * around, a plain getByTestId can resolve to multiple elements (a strict-mode violation) — e.g.
 * two `parkingSpotsListScreen`s after list → new → list.
 */
export const visibleTestId = (page: Page, testId: string): Locator => page.getByTestId(testId).filter({ visible: true })
