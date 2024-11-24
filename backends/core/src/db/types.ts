import { parkingSpotBookings, parkingSpots, timeRuleOverrides, timeRules } from './schema'

export type ParkingSpotDao = typeof parkingSpots.$inferSelect
export type ParkingSpotInputDao = typeof parkingSpots.$inferInsert

export type ParkingSpotBookingDao = typeof parkingSpotBookings.$inferSelect
export type ParkingSpotBookingInputDao = typeof parkingSpotBookings.$inferInsert

export type TimeRuleDao = typeof timeRules.$inferSelect
export type TimeRuleInputDao = typeof timeRules.$inferInsert

export type TimeRuleOverrideDao = typeof timeRuleOverrides.$inferSelect
export type TimeRuleOverrideInputDao = typeof timeRuleOverrides.$inferInsert
