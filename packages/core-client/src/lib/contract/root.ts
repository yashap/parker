import { initContract } from '@ts-rest/core'
import { parkingSpotContract } from 'src/lib/contract/parkingSpot'
import { parkingSpotBookingContract } from 'src/lib/contract/parkingSpotBooking'

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
