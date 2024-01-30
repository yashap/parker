import { initContract } from '@ts-rest/core'
import { parkingSpotContract } from './parkingSpot'
import { parkingSpotBookingContract } from './parkingSpotBooking'

const c = initContract()

export const contract = c.router(
  {
    parkingSpots: parkingSpotContract,
    parkingSpotBookings: parkingSpotBookingContract,
  },
  {
    strictStatusCodes: true,
    pathPrefix: '/core',
  }
)
