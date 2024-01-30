import { Temporal } from '@js-temporal/polyfill'
import { Controller, UseGuards } from '@nestjs/common'
import { ParkingSpotBookingDto, contract as rootContract } from '@parker/core-client'
import { BaseController, Endpoint, HandlerResult, HttpStatus, handler } from '@parker/nest-utils'
import { SessionContainer } from 'supertokens-node/recipe/session'
import { AuthGuard, Session } from '../../auth'
import { ParkingSpotBooking } from './ParkingSpotBooking'
import { ParkingSpotBookingRepository } from './ParkingSpotBookingRepository'

const contract = rootContract.parkingSpotBookings

@Controller()
export class ParkingSpotBookingController extends BaseController {
  constructor(private readonly parkingSpotBookingRepository: ParkingSpotBookingRepository) {
    super('ParkingSpotBooking')
  }

  @Endpoint(contract.post)
  @UseGuards(new AuthGuard())
  public create(@Session() session: SessionContainer): HandlerResult<typeof contract.post> {
    return handler(contract.post, async ({ params: { parkingSpotId }, body }) => {
      // TODO: ACTUAL BUSINESS LOGIC VERIFYING THAT THIS SPOT CAN BE BOOKED AT THIS TIME!
      //  - Probably split this out into a "service" class, that verifies time rules, availability, etc.
      const parkingSpot = await this.parkingSpotBookingRepository.create({
        ...body,
        bookedByUserId: session.getUserId(),
        parkingSpotId,
        bookingStartsAt: Temporal.Instant.from(body.bookingStartsAt),
        bookingEndsAt: Temporal.Instant.from(body.bookingStartsAt),
      })
      return { status: HttpStatus.CREATED, body: this.bookingToDto(parkingSpot) }
    })
  }

  private bookingToDto(booking: ParkingSpotBooking): ParkingSpotBookingDto {
    return {
      ...booking,
      bookingStartsAt: booking.bookingStartsAt.toString(),
      bookingEndsAt: booking.bookingEndsAt?.toString(),
    }
  }
}
