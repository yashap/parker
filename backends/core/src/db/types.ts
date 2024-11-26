import { parkingSpotBookingTable, parkingSpotTable, timeRuleOverrideTable, timeRuleTable } from './schema'

export type ParkingSpotDao = typeof parkingSpotTable.$inferSelect
export type ParkingSpotInputDao = typeof parkingSpotTable.$inferInsert

export type ParkingSpotBookingDao = typeof parkingSpotBookingTable.$inferSelect
export type ParkingSpotBookingInputDao = typeof parkingSpotBookingTable.$inferInsert

export type TimeRuleDao = typeof timeRuleTable.$inferSelect
export type TimeRuleInputDao = typeof timeRuleTable.$inferInsert

export type TimeRuleOverrideDao = typeof timeRuleOverrideTable.$inferSelect
export type TimeRuleOverrideInputDao = typeof timeRuleOverrideTable.$inferInsert
