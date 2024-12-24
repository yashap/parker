import { BookingStatusDto, ParkingSpotBookingDto } from '@parker/core-client'
import { formatInstantFields } from '@parker/time'
import { ParkingSpotBookingDao } from '../../db/types'

export type BookingStatus = BookingStatusDto

export type ParkingSpotBooking = ParkingSpotBookingDao

export const parkingSpotBookingToDto = (booking: ParkingSpotBooking): ParkingSpotBookingDto => {
  return {
    ...booking,
    ...formatInstantFields(booking, ['createdAt', 'updatedAt', 'bookingStartsAt']),
    bookingEndsAt: booking.bookingEndsAt?.toString(),
  }
}
