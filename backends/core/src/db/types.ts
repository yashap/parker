import { Temporal } from '@js-temporal/polyfill'
import { parkingSpotBookingTable, parkingSpotTable, timeRuleOverrideTable, timeRuleTable } from './schema'

type InputDao<T extends { id?: string; createdAt?: Temporal.Instant; updatedAt?: Temporal.Instant }> = Omit<
  T,
  'id' | 'createdAt' | 'updatedAt'
>

export type ParkingSpotDao = typeof parkingSpotTable.$inferSelect
export type ParkingSpotInputDao = InputDao<typeof parkingSpotTable.$inferInsert>

export type ParkingSpotBookingDao = typeof parkingSpotBookingTable.$inferSelect
export type ParkingSpotBookingInputDao = InputDao<typeof parkingSpotBookingTable.$inferInsert>

export type TimeRuleDao = typeof timeRuleTable.$inferSelect
export type TimeRuleInputDao = InputDao<typeof timeRuleTable.$inferInsert>

export type TimeRuleOverrideDao = typeof timeRuleOverrideTable.$inferSelect
export type TimeRuleOverrideInputDao = InputDao<typeof timeRuleOverrideTable.$inferInsert>
