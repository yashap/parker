import { expect, test } from './fixtures/preflight.js'
import { logIn, logOut, signUpNewUser } from './helpers/auth.js'
import { visibleTestId } from './helpers/locators.js'

test('log out then log back in with the same credentials', async ({ page }) => {
  const { email, password } = await signUpNewUser(page)

  await logOut(page)

  await logIn(page, email, password)
  await expect(visibleTestId(page, 'parkingSpotsListScreen')).toBeVisible()
})

test('logging in with the wrong password stays on the log in screen', async ({ page }) => {
  const { email } = await signUpNewUser(page)
  await logOut(page)

  await logIn(page, email, 'WrongPassword123!')

  // The error surfaces as a toast; the key assertion is that we never leave the log in screen
  await expect(page.getByText('Wrong email and/or password')).toBeVisible()
  await expect(visibleTestId(page, 'logInScreen')).toBeVisible()
  await expect(visibleTestId(page, 'parkingSpotsListScreen')).toHaveCount(0)
})

test('signing up with an already-used email is rejected', async ({ page }) => {
  const { email, password } = await signUpNewUser(page)
  await logOut(page)

  await visibleTestId(page, 'goToSignUp').click()
  await expect(visibleTestId(page, 'signUpScreen')).toBeVisible()
  await visibleTestId(page, 'signUpEmailInput').fill(email)
  await visibleTestId(page, 'signUpPasswordInput').fill(password)
  await visibleTestId(page, 'submitSignUp').click()

  await expect(page.getByText('Email already exists')).toBeVisible()
  await expect(visibleTestId(page, 'signUpScreen')).toBeVisible()
  await expect(visibleTestId(page, 'parkingSpotsListScreen')).toHaveCount(0)
})
