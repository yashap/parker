import type { ColumnType } from 'kysely'

export type Generated<T> =
  T extends ColumnType<infer S, infer I, infer U> ? ColumnType<S, I | undefined, U> : ColumnType<T, T | undefined, T>

export type Timestamp = ColumnType<Date, Date | string, Date | string>

export interface ParkingSpot {
  createdAt: Generated<Timestamp>
  id: Generated<string>
  location: string
  ownerUserId: string
  timeZone: string
  updatedAt: Timestamp
}

export interface ParkingSpotBooking {
  bookedByUserId: string
  bookingEndsAt: Timestamp | null
  bookingStartsAt: Timestamp
  createdAt: Generated<Timestamp>
  id: Generated<string>
  parkingSpotId: string
  status: string
  updatedAt: Timestamp
}

export interface TimeRule {
  createdAt: Generated<Timestamp>
  day: string
  endTime: string
  id: Generated<string>
  parkingSpotId: string
  startTime: string
  updatedAt: Timestamp
}

export interface ValuesParkingSpotBookingStatus {
  status: string
}

export interface ValuesTimeRuleDay {
  day: string
}

export interface DB {
  ParkingSpot: ParkingSpot
  ParkingSpotBooking: ParkingSpotBooking
  TimeRule: TimeRule
  values_ParkingSpotBooking_status: ValuesParkingSpotBookingStatus
  values_TimeRule_day: ValuesTimeRuleDay
}
