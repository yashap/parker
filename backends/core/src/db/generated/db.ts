import type { ColumnType } from 'kysely'

export type Generated<T> = T extends ColumnType<infer S, infer I, infer U>
  ? ColumnType<S, I | undefined, U>
  : ColumnType<T, T | undefined, T>

export type Timestamp = ColumnType<Date, Date | string, Date | string>

export interface ParkingSpot {
  id: Generated<string>
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
  ownerUserId: string
  location: string
}

export interface TimeRule {
  id: Generated<string>
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
  parkingSpotId: string
  day: string
  startTime: string
  endTime: string
}

export interface ValuesTimeRuleDay {
  day: string
}

export interface DB {
  ParkingSpot: ParkingSpot
  TimeRule: TimeRule
  values_TimeRule_day: ValuesTimeRuleDay
}
