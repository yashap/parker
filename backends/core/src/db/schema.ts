import { instant } from '@parker/drizzle-utils'
import { sql } from 'drizzle-orm'
import { uuid, pgTable, text, geometry, index, time, boolean } from 'drizzle-orm/pg-core'

const standardFields = {
  // TODO: confirm if this is what I want, and also move id, createdAt and updatedAt into drizzle-utils
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
    // TODO: maybe a custom type for this, that'll fit my personal coord type?
    location: geometry({ type: 'point', mode: 'xy', srid: 4326 }).notNull(),
    timeZone: text().notNull(),
  },
  (table) => [
    index('ParkingSpot_ownerUserId_idx').on(table.ownerUserId),
    index('ParkingSpot_location_idx').using('gist', table.location),
  ]
)

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
    status: text()
      .notNull()
      .references(() => _values_parkingSpotBookingStatus.status),
  },
  (table) => [
    index('ParkingSpotBooking_bookedByUserId_idx').on(table.bookedByUserId),
    index('ParkingSpotBooking_parkingSpotId_idx').on(table.parkingSpotId),
  ]
)

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
    day: text()
      .notNull()
      .references(() => _values_timeRuleDay.day),
    startTime: time({ withTimezone: false }).notNull(),
    endTime: time({ withTimezone: false }).notNull(),
  },
  (table) => [index('TimeRule_parkingSpotId_idx').on(table.parkingSpotId)]
)

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

// CREATE TABLE "TimeRuleOverride" (
//   id uuid DEFAULT uuid_generate_v1() PRIMARY KEY,
//   "createdAt" timestamp(3) with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   "updatedAt" timestamp(3) with time zone NOT NULL,
//   "parkingSpotId" uuid NOT NULL REFERENCES "ParkingSpot"(id) ON DELETE CASCADE ON UPDATE CASCADE,
//   "startsAt" timestamp(3) with time zone NOT NULL,
//   "endsAt" timestamp(3) with time zone NOT NULL,
//   "isAvailable" boolean NOT NULL
// );

// CREATE TABLE "ParkingSpot" (
//   id uuid DEFAULT uuid_generate_v1() PRIMARY KEY,
//   "createdAt" timestamp(3) with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   "updatedAt" timestamp(3) with time zone NOT NULL,
//   "ownerUserId" uuid NOT NULL,
//   address text NOT NULL,
//   location geometry(Point,4326) NOT NULL,
//   "timeZone" text NOT NULL
// );
// CREATE UNIQUE INDEX "ParkingSpot_pkey" ON "ParkingSpot"(id uuid_ops);
// CREATE INDEX "ParkingSpot_ownerUserId_idx" ON "ParkingSpot"("ownerUserId" uuid_ops);
// CREATE INDEX "ParkingSpot_location_idx" ON "ParkingSpot" USING GIST (location gist_geometry_ops_2d);

// CREATE TABLE "ParkingSpotBooking" (
//   id uuid DEFAULT uuid_generate_v1() PRIMARY KEY,
//   "createdAt" timestamp(3) with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   "updatedAt" timestamp(3) with time zone NOT NULL,
//   "parkingSpotId" uuid NOT NULL REFERENCES "ParkingSpot"(id) ON DELETE CASCADE ON UPDATE CASCADE,
//   "bookedByUserId" uuid NOT NULL,
//   "bookingStartsAt" timestamp(3) with time zone NOT NULL,
//   "bookingEndsAt" timestamp(3) with time zone,
//   status text NOT NULL REFERENCES "values_ParkingSpotBooking_status"(status)
// );
// CREATE UNIQUE INDEX "ParkingSpotBooking_pkey" ON "ParkingSpotBooking"(id uuid_ops);
// CREATE INDEX "ParkingSpotBooking_bookedByUserId_idx" ON "ParkingSpotBooking"("bookedByUserId" uuid_ops);
// CREATE INDEX "ParkingSpotBooking_parkingSpotId_idx" ON "ParkingSpotBooking"("parkingSpotId" uuid_ops);

// CREATE TABLE "TimeRule" (
//   id uuid DEFAULT uuid_generate_v1() PRIMARY KEY,
//   "createdAt" timestamp(3) with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   "updatedAt" timestamp(3) with time zone NOT NULL,
//   "parkingSpotId" uuid NOT NULL REFERENCES "ParkingSpot"(id) ON DELETE CASCADE ON UPDATE CASCADE,
//   day text NOT NULL REFERENCES "values_TimeRule_day"(day),
//   "startTime" time without time zone NOT NULL,
//   "endTime" time without time zone NOT NULL
// );
// CREATE UNIQUE INDEX "TimeRule_pkey" ON "TimeRule"(id uuid_ops);
// CREATE INDEX "TimeRule_parkingSpotId_idx" ON "TimeRule"("parkingSpotId" uuid_ops);

// CREATE TABLE "TimeRuleOverride" (
//   id uuid DEFAULT uuid_generate_v1() PRIMARY KEY,
//   "createdAt" timestamp(3) with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   "updatedAt" timestamp(3) with time zone NOT NULL,
//   "parkingSpotId" uuid NOT NULL REFERENCES "ParkingSpot"(id) ON DELETE CASCADE ON UPDATE CASCADE,
//   "startsAt" timestamp(3) with time zone NOT NULL,
//   "endsAt" timestamp(3) with time zone NOT NULL,
//   "isAvailable" boolean NOT NULL
// );
// CREATE UNIQUE INDEX "TimeRuleOverride_pkey" ON "TimeRuleOverride"(id uuid_ops);
// CREATE INDEX "TimeRuleOverride_parkingSpotId_idx" ON "TimeRuleOverride"("parkingSpotId" uuid_ops);

// CREATE TABLE "values_ParkingSpotBooking_status" (
//   status text PRIMARY KEY
// );
// CREATE UNIQUE INDEX "values_ParkingSpotBooking_status_pkey" ON "values_ParkingSpotBooking_status"(status text_ops);

// CREATE TABLE "values_TimeRule_day" (
//   day text PRIMARY KEY
// );
// CREATE UNIQUE INDEX "values_TimeRule_day_pkey" ON "values_TimeRule_day"(day text_ops);
