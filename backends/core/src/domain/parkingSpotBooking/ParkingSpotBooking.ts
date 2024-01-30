import { Temporal } from '@js-temporal/polyfill'
import { BookingStatusDto, ParkingSpotBookingDto } from '@parker/core-client'

export type BookingStatus = BookingStatusDto

export type ParkingSpotBooking = Omit<ParkingSpotBookingDto, 'status' | 'bookingStartsAt' | 'bookingEndsAt'> & {
  status: BookingStatus
  bookingStartsAt: Temporal.Instant
  bookingEndsAt?: Temporal.Instant
}

export const parkingSpotBookingToDto = (booking: ParkingSpotBooking): ParkingSpotBookingDto => {
  return {
    ...booking,
    bookingStartsAt: booking.bookingStartsAt.toString(),
    bookingEndsAt: booking.bookingEndsAt?.toString(),
  }
}
