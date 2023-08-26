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

export interface User {
  id: Generated<string>
  createdAt: Generated<Timestamp>
  updatedAt: Timestamp
  email: string
  fullName: string
}

export interface DB {
  ParkingSpot: ParkingSpot
  User: User
}
