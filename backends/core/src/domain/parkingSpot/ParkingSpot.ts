import { Temporal } from '@js-temporal/polyfill'
import { Cursor } from '@parker/api-client-utils'
import { ParkingSpotDto } from '@parker/core-client'
import { formatInstantFields } from '@parker/time'
import { TimeRule, timeRuleToDto } from '../timeRule'
import { TimeRuleOverride, timeRuleOverrideToDto } from '../timeRuleOverride'

export type ParkingSpot = Omit<ParkingSpotDto, 'createdAt' | 'updatedAt' | 'timeRules' | 'timeRuleOverrides'> & {
  createdAt: Temporal.Instant
  updatedAt: Temporal.Instant
  timeRules: TimeRule[]
  timeRuleOverrides: TimeRuleOverride[]
}

export type ListParkingSpotCursor = Cursor<'createdAt', string>

export type ListParkingSpotPagination =
  | ListParkingSpotCursor
  | Omit<ListParkingSpotCursor, 'lastOrderValueSeen' | 'lastIdSeen'>

export const parkingSpotToDto = (parkingSpot: ParkingSpot): ParkingSpotDto => {
  return {
    ...parkingSpot,
    ...formatInstantFields(parkingSpot, ['createdAt', 'updatedAt']),
    timeRules: parkingSpot.timeRules.map(timeRuleToDto),
    timeRuleOverrides: parkingSpot.timeRuleOverrides.map(timeRuleOverrideToDto),
  }
}
