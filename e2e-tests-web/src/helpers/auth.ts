import { expect, type Page } from '@playwright/test'
import { visibleTestId } from './locators.js'

export const DEFAULT_PASSWORD = 'StrongPassword123!'

export const uniqueEmail = (): string => `parker-e2e-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`

export interface Credentials {
  email: string
  password: string
}

/** Sign up as a fresh (unique-email) user and land on the parking spots list. */
export const signUpNewUser = async (page: Page): Promise<Credentials> => {
  const credentials: Credentials = { email: uniqueEmail(), password: DEFAULT_PASSWORD }

  await page.goto('/')
  await expect(visibleTestId(page, 'logInScreen')).toBeVisible()

  await visibleTestId(page, 'goToSignUp').click()
  await expect(visibleTestId(page, 'signUpScreen')).toBeVisible()
  await visibleTestId(page, 'signUpEmailInput').fill(credentials.email)
  await visibleTestId(page, 'signUpPasswordInput').fill(credentials.password)
  await visibleTestId(page, 'submitSignUp').click()

  await expect(visibleTestId(page, 'parkingSpotsListScreen')).toBeVisible()
  return credentials
}

/** Log out via the header button, landing back on the log in screen. */
export const logOut = async (page: Page): Promise<void> => {
  await visibleTestId(page, 'logoutButton').click()
  await expect(visibleTestId(page, 'logInScreen')).toBeVisible()
}

/** Log in with existing credentials from the log in screen. */
export const logIn = async (page: Page, email: string, password: string): Promise<void> => {
  await expect(visibleTestId(page, 'logInScreen')).toBeVisible()
  await visibleTestId(page, 'logInEmailInput').fill(email)
  await visibleTestId(page, 'logInPasswordInput').fill(password)
  await visibleTestId(page, 'submitLogIn').click()
}
