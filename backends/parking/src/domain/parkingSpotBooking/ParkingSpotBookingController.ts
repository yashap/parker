import { Temporal } from '@js-temporal/polyfill'
import { Controller, UseGuards } from '@nestjs/common'
import { required } from '@parker/errors'
import { AuthGuard, BaseController, Endpoint, HandlerResult, HttpStatus, Session, handler } from '@parker/nest-utils'
import { BookingStatusValues, contract as rootContract } from '@parker/parking-client'
import { SessionContainer } from 'supertokens-node/recipe/session'
import { Db } from 'src/db/Db'
import { parkingSpotBookingTable } from 'src/db/schema'
import { ParkingSpotBookingInputDao } from 'src/db/types'
import { parkingSpotBookingToDto } from 'src/domain/parkingSpotBooking/ParkingSpotBooking'

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
