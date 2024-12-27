import { ContractBuilder } from '@parker/api-client-utils'
import { initContract } from '@ts-rest/core'
import { z } from 'zod'
import { CreateParkingSpotBookingRequestSchema, ParkingSpotBookingSchema } from 'src/lib/model/ParkingSpotBooking'

const c = initContract()

export const parkingSpotBookingContract = c.router({
  post: {
    method: 'POST',
    path: '/parkingSpots/:parkingSpotId/bookings',
    pathParams: z.object({
      parkingSpotId: z.string().uuid(),
    }),
    body: CreateParkingSpotBookingRequestSchema,
    responses: ContractBuilder.buildPostResponses(ParkingSpotBookingSchema),
    summary: 'Book a parking spot',
  },
})
