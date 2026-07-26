import type { ParkingSpotBookingDto, ParkingSpotDto } from '@parker/parking-client'
import type { APIRequestContext } from '@playwright/test'
import { expect, test, PARKING_URL, USER_URL } from './fixtures/preflight.js'
import { uniqueEmail, DEFAULT_PASSWORD } from './helpers/auth.js'

/**
 * API-level coverage (through Playwright's request context) for the parts of the parking backend
 * that have no UI yet: searching for spots closest to a point, and booking a spot. Uses
 * header-based SuperTokens sessions (st-auth-mode: header → st-access-token → Authorization:
 * Bearer), the same mechanism any non-browser client would use.
 */

interface AuthedUser {
  userId: string
  accessToken: string
}

const signUpViaApi = async (request: APIRequestContext): Promise<AuthedUser> => {
  const response = await request.post(`${USER_URL}/auth/signup`, {
    headers: { 'st-auth-mode': 'header' },
    data: {
      formFields: [
        { id: 'email', value: uniqueEmail() },
        { id: 'password', value: DEFAULT_PASSWORD },
      ],
    },
  })
  expect(response.status()).toBe(200)
  const body = (await response.json()) as { status: string; user: { id: string } }
  expect(body.status).toBe('OK')
  const accessToken = response.headers()['st-access-token']
  expect(accessToken, 'signup should return an st-access-token header').toBeTruthy()
  return { userId: body.user.id, accessToken: accessToken ?? '' }
}

const authHeaders = (user: AuthedUser): Record<string, string> => ({
  Authorization: `Bearer ${user.accessToken}`,
})

test('create a parking spot, find it via closestToPoint, and book it', async ({ request }) => {
  const owner = await signUpViaApi(request)

  // Give each run its own location so closestToPoint deterministically ranks this spot first,
  // even with spots accumulated from previous runs (no DB cleanup, by design)
  const location = {
    latitude: 37.7909 + (Math.random() - 0.5) * 0.1,
    longitude: -122.3925 + (Math.random() - 0.5) * 0.1,
  }

  // Create a spot
  const createResponse = await request.post(`${PARKING_URL}/parking/parkingSpots`, {
    headers: authHeaders(owner),
    data: {
      address: '160 Spear Street',
      location,
      timeRules: [{ day: 'Monday', startTime: '00:00:00', endTime: '23:59:59' }],
      timeRuleOverrides: [],
    },
  })
  expect(createResponse.status()).toBe(201)
  const parkingSpot = (await createResponse.json()) as ParkingSpotDto
  expect(parkingSpot.ownerUserId).toBe(owner.userId)

  // An unauthenticated request is rejected
  const unauthedResponse = await request.get(
    `${PARKING_URL}/parking/parkingSpots/closestToPoint?latitude=${location.latitude}&longitude=${location.longitude}&limit=1`
  )
  expect(unauthedResponse.status()).toBe(401)

  // Search for it as a different user (a driver looking for parking)
  const driver = await signUpViaApi(request)
  const searchResponse = await request.get(
    `${PARKING_URL}/parking/parkingSpots/closestToPoint?latitude=${location.latitude}&longitude=${location.longitude}&limit=1`,
    { headers: authHeaders(driver) }
  )
  expect(searchResponse.status()).toBe(200)
  const searchBody = (await searchResponse.json()) as { data: ParkingSpotDto[] }
  expect(searchBody.data[0]?.id).toBe(parkingSpot.id)

  // Book it
  const now = new Date()
  const inOneHour = new Date(now.getTime() + 60 * 60 * 1000)
  const bookingResponse = await request.post(`${PARKING_URL}/parking/parkingSpots/${parkingSpot.id}/bookings`, {
    headers: authHeaders(driver),
    data: {
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      bookingStartsAt: now.toISOString(),
      bookingEndsAt: inOneHour.toISOString(),
    },
  })
  expect(bookingResponse.status()).toBe(201)
  const booking = (await bookingResponse.json()) as ParkingSpotBookingDto
  expect(booking.parkingSpotId).toBe(parkingSpot.id)
  expect(booking.bookedByUserId).toBe(driver.userId)
  expect(booking.status).toBe('Accepted')
})
