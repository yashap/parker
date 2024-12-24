import { Temporal } from '@js-temporal/polyfill'
import { Controller, UseGuards } from '@nestjs/common'
import { BookingStatusValues, contract as rootContract } from '@parker/core-client'
import { required } from '@parker/errors'
import { BaseController, Endpoint, HandlerResult, HttpStatus, handler } from '@parker/nest-utils'
import { SessionContainer } from 'supertokens-node/recipe/session'
import { AuthGuard, Session } from '../../auth'
import { Db } from '../../db/Db'
import { parkingSpotBookingTable } from '../../db/schema'
import { ParkingSpotBookingInputDao } from '../../db/types'
import { parkingSpotBookingToDto } from './ParkingSpotBooking'

const contract = rootContract.parkingSpotBookings

@Controller()
export class ParkingSpotBookingController extends BaseController {
  constructor(private readonly db: Db) {
    super('ParkingSpotBooking')
  }

  @Endpoint(contract.post)
  @UseGuards(new AuthGuard())
  public create(@Session() session: SessionContainer): HandlerResult<typeof contract.post> {
    return handler(contract.post, async ({ params: { parkingSpotId }, body }) => {
      // TODO: ACTUAL BUSINESS LOGIC VERIFYING THAT THIS SPOT CAN BE BOOKED AT THIS TIME!
      //  - Probably split this out into a "service" class, that verifies time rules, availability, etc.
      const input: ParkingSpotBookingInputDao = {
        ...body,
        bookedByUserId: session.getUserId(),
        parkingSpotId,
        status: BookingStatusValues.Accepted,
        bookingStartsAt: Temporal.Instant.from(body.bookingStartsAt),
        bookingEndsAt: body.bookingEndsAt ? Temporal.Instant.from(body.bookingEndsAt) : null,
      }
      const bookings = await this.db.db().insert(parkingSpotBookingTable).values(input).returning()
      return { status: HttpStatus.CREATED, body: parkingSpotBookingToDto(required(bookings[0])) }
    })
  }
}
