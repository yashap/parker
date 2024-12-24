import { Cursor } from '@parker/api-client-utils'
import { ParkingSpotDto } from '@parker/core-client'
import { formatInstantFields } from '@parker/time'
import { ParkingSpotDao } from '../../db/types'
import { TimeRule, timeRuleToDto } from '../timeRule'
import { TimeRuleOverride, timeRuleOverrideToDto } from '../timeRuleOverride'

export type ParkingSpot = ParkingSpotDao & {
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
