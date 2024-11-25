import { DayOfWeekAllValues } from '@parker/api-client-utils'
import { BookingStatusAllValues } from '@parker/core-client'
import { instant, plainTime, point } from '@parker/drizzle-utils'
import { relations, sql } from 'drizzle-orm'
import { uuid, pgTable, text, boolean, index } from 'drizzle-orm/pg-core'

const standardFields = {
  // TODO: confirm if this is what I want, and also move id, createdAt and updatedAt into drizzle-utils
  // TODO: maybe switch default to app-side uuid gen
  id: uuid().primaryKey().default('uuid_generate_v1()'),
  createdAt: instant()
    .notNull()
    .default(sql`(NOW() AT TIME ZONE 'utc'::text)`),
  updatedAt: instant()
    .notNull()
    .default(sql`(NOW() AT TIME ZONE 'utc'::text)`)
    .$onUpdate(() => sql`(NOW() AT TIME ZONE 'utc'::text)`),
}

export const parkingSpots = pgTable(
  'ParkingSpot',
  {
    ...standardFields,
    ownerUserId: uuid().notNull(),
    address: text().notNull(),
    location: point().notNull(),
    timeZone: text().notNull(),
  },
  (table) => [
    index('ParkingSpot_ownerUserId_idx').on(table.ownerUserId),
    index('ParkingSpot_location_idx').using('gist', table.location),
  ]
)

export const parkingSpotsRelations = relations(parkingSpots, ({ many }) => ({
  bookings: many(parkingSpotBookings),
  timeRules: many(timeRules),
  timeRuleOverrides: many(timeRuleOverrides),
}))

export const parkingSpotBookings = pgTable(
  'ParkingSpotBooking',
  {
    ...standardFields,
    parkingSpotId: uuid()
      .notNull()
      .references(() => parkingSpots.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    bookedByUserId: uuid().notNull(),
    bookingStartsAt: instant().notNull(),
    bookingEndsAt: instant(),
    status: text({ enum: BookingStatusAllValues })
      .notNull()
      .references(() => _values_parkingSpotBookingStatus.status),
  },
  (table) => [
    index('ParkingSpotBooking_bookedByUserId_idx').on(table.bookedByUserId),
    index('ParkingSpotBooking_parkingSpotId_idx').on(table.parkingSpotId),
  ]
)

export const parkingSpotBookingsRelations = relations(parkingSpotBookings, ({ one }) => ({
  parkingSpot: one(parkingSpots, {
    fields: [parkingSpotBookings.parkingSpotId],
    references: [parkingSpots.id],
  }),
}))

// Accepted, Cancelled, InProgress
export const _values_parkingSpotBookingStatus = pgTable('values_ParkingSpotBooking_status', {
  status: text().primaryKey(),
})

export const timeRules = pgTable(
  'TimeRule',
  {
    ...standardFields,
    parkingSpotId: uuid()
      .notNull()
      .references(() => parkingSpots.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    day: text({ enum: DayOfWeekAllValues })
      .notNull()
      .references(() => _values_timeRuleDay.day),
    startTime: plainTime().notNull(),
    endTime: plainTime().notNull(),
  },
  (table) => [index('TimeRule_parkingSpotId_idx').on(table.parkingSpotId)]
)

export const timeRulesRelations = relations(timeRules, ({ one }) => ({
  parkingSpot: one(parkingSpots, {
    fields: [timeRules.parkingSpotId],
    references: [parkingSpots.id],
  }),
}))

// Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday
export const _values_timeRuleDay = pgTable('values_TimeRule_day', {
  day: text().primaryKey(),
})

export const timeRuleOverrides = pgTable(
  'TimeRuleOverride',
  {
    ...standardFields,
    parkingSpotId: uuid()
      .notNull()
      .references(() => parkingSpots.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
    startsAt: instant().notNull(),
    endsAt: instant().notNull(),
    isAvailable: boolean().notNull(),
  },
  (table) => [index('TimeRuleOverride_parkingSpotId_idx').on(table.parkingSpotId)]
)

export const timeRuleOverridesRelations = relations(timeRuleOverrides, ({ one }) => ({
  parkingSpot: one(parkingSpots, {
    fields: [timeRuleOverrides.parkingSpotId],
    references: [parkingSpots.id],
  }),
}))
