import { Temporal } from '@js-temporal/polyfill'
import { required } from '@parker/errors'
import { getSessionUserId, tsRestPluginOptions } from '@parker/fastify-utils'
import { BookingStatusValues, contract as rootContract } from '@parker/parking-client'
import { initServer } from '@ts-rest/fastify'
import type { FastifyInstance } from 'fastify'
import { Db } from 'src/db/Db'
import { parkingSpotBookingTable } from 'src/db/schema'
import { ParkingSpotBookingInputDao } from 'src/db/types'
import { parkingSpotBookingToDto } from 'src/domain/parkingSpotBooking/ParkingSpotBooking'

const contract = rootContract.parkingSpotBookings

export interface ParkingSpotBookingRoutesDeps {
  db: Db
}

export const registerParkingSpotBookingRoutes = async (
  app: FastifyInstance,
  deps: ParkingSpotBookingRoutesDeps
): Promise<void> => {
  const { db } = deps
  const s = initServer()

  const router = s.router(contract, {
    post: async ({ params: { parkingSpotId }, body, request }) => {
      // TODO: ACTUAL BUSINESS LOGIC VERIFYING THAT THIS SPOT CAN BE BOOKED AT THIS TIME!
      //  - Probably split this out into a "service" class, that verifies time rules, availability, etc.
      const input: ParkingSpotBookingInputDao = {
        ...body,
        bookedByUserId: getSessionUserId(request),
        parkingSpotId,
        status: BookingStatusValues.Accepted,
        bookingStartsAt: Temporal.Instant.from(body.bookingStartsAt),
        bookingEndsAt: body.bookingEndsAt ? Temporal.Instant.from(body.bookingEndsAt) : null,
      }
      const bookings = await db.db().insert(parkingSpotBookingTable).values(input).returning()
      return { status: 201, body: parkingSpotBookingToDto(required(bookings[0])) }
    },
  })

  await app.register(s.plugin(router), tsRestPluginOptions)
}
