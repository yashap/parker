import { InputDao } from '@parker/drizzle-utils'
import { parkingSpotBookingTable, parkingSpotTable, timeRuleOverrideTable, timeRuleTable } from './schema'

export type ParkingSpotDao = typeof parkingSpotTable.$inferSelect
export type ParkingSpotInputDao = InputDao<ParkingSpotDao>

export type ParkingSpotBookingDao = typeof parkingSpotBookingTable.$inferSelect
export type ParkingSpotBookingInputDao = InputDao<ParkingSpotBookingDao>

export type TimeRuleDao = typeof timeRuleTable.$inferSelect
export type TimeRuleInputDao = InputDao<TimeRuleDao>

export type TimeRuleOverrideDao = typeof timeRuleOverrideTable.$inferSelect
export type TimeRuleOverrideInputDao = InputDao<TimeRuleOverrideDao>
