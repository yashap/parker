import { Injectable } from '@nestjs/common'
import { required } from '@parker/errors'
import { eq } from 'drizzle-orm'
import { Db } from '../../db/Db'
import { parkingSpotBookingTable } from '../../db/schema'
import { ParkingSpotBookingDao, ParkingSpotBookingInputDao } from '../../db/types'
import { ParkingSpotBooking } from './ParkingSpotBooking'

@Injectable()
export class ParkingSpotBookingRepository {
  public async create(payload: ParkingSpotBookingInputDao): Promise<ParkingSpotBooking> {
    const result = await Db.db().insert(parkingSpotBookingTable).values(payload).returning()
    return this.bookingToDomain(required(result[0]))
  }

  public async getById(id: string): Promise<ParkingSpotBooking | undefined> {
    const bookingDaos = await Db.db().select().from(parkingSpotBookingTable).where(eq(parkingSpotBookingTable.id, id))
    const bookingDao = bookingDaos[0]
    return bookingDao ? this.bookingToDomain(bookingDao) : undefined
  }

  private bookingToDomain(booking: ParkingSpotBookingDao): ParkingSpotBooking {
    return {
      ...booking,
      bookingEndsAt: booking.bookingEndsAt ?? undefined,
    }
  }
}
