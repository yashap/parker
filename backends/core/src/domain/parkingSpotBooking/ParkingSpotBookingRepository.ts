import { Temporal } from '@js-temporal/polyfill'
import { Injectable } from '@nestjs/common'
import { BookingStatusValues, CreateParkingSpotBookingRequest } from '@parker/core-client'
import { QueryUtils } from '@parker/kysely-utils'
import { Selectable } from 'kysely'
import { BaseRepository } from '../../db/BaseRepository'
import { ParkingSpotBooking as ParkingSpotBookingDao } from '../../db/generated/db'
import { BookingStatus, ParkingSpotBooking } from './ParkingSpotBooking'

export type CreateParkingSpotBookingInput = Omit<
  CreateParkingSpotBookingRequest,
  'bookingStartsAt' | 'bookingEndsAt'
> & {
  parkingSpotId: string
  bookedByUserId: string
  bookingStartsAt: Temporal.Instant
  bookingEndsAt?: Temporal.Instant
  status?: BookingStatus
}

@Injectable()
export class ParkingSpotBookingRepository extends BaseRepository {
  public async create(payload: CreateParkingSpotBookingInput): Promise<ParkingSpotBooking> {
    const bookingDao = await this.db()
      .insertInto('ParkingSpotBooking')
      .values({
        ...payload,
        ...QueryUtils.updatedAt(),
        status: payload.status ?? BookingStatusValues.Accepted,
        bookingStartsAt: payload.bookingStartsAt.toString(),
        bookingEndsAt: payload.bookingEndsAt ? payload.bookingEndsAt.toString() : null,
      })
      .returningAll()
      .executeTakeFirstOrThrow()
    return this.bookingToDomain(bookingDao)
  }

  public async getById(id: string): Promise<ParkingSpotBooking | undefined> {
    const bookingDao = await this.db()
      .selectFrom('ParkingSpotBooking')
      .selectAll()
      .where('id', '=', id)
      .executeTakeFirst()
    return bookingDao ? this.bookingToDomain(bookingDao) : undefined
  }

  private bookingToDomain(booking: Selectable<ParkingSpotBookingDao>): ParkingSpotBooking {
    return {
      ...QueryUtils.withoutSystemTimestamps(booking),
      status: booking.status as BookingStatus,
      bookingStartsAt: Temporal.Instant.fromEpochMilliseconds(booking.bookingStartsAt.valueOf()),
      bookingEndsAt: booking.bookingEndsAt
        ? Temporal.Instant.fromEpochMilliseconds(booking.bookingEndsAt.valueOf())
        : undefined,
    }
  }
}
