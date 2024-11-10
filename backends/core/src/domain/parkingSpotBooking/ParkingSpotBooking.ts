import { Temporal } from '@js-temporal/polyfill'
import { BookingStatusDto, ParkingSpotBookingDto } from '@parker/core-client'
import { formatInstantFields } from '@parker/time'

export type BookingStatus = BookingStatusDto

export type ParkingSpotBooking = Omit<
  ParkingSpotBookingDto,
  'createdAt' | 'updatedAt' | 'status' | 'bookingStartsAt' | 'bookingEndsAt'
> & {
  status: BookingStatus
  createdAt: Temporal.Instant
  updatedAt: Temporal.Instant
  bookingStartsAt: Temporal.Instant
  bookingEndsAt?: Temporal.Instant
}

export const parkingSpotBookingToDto = (booking: ParkingSpotBooking): ParkingSpotBookingDto => {
  return {
    ...booking,
    ...formatInstantFields(booking, ['createdAt', 'updatedAt', 'bookingStartsAt']),
    bookingEndsAt: booking.bookingEndsAt?.toString(),
  }
}
