import { ParkingSpotDto } from '@parker/core-client'
import { TimeRule, timeRuleToDto } from '../timeRule'
import { TimeRuleOverride, timeRuleOverrideToDto } from '../timeRuleOverride'

export type ParkingSpot = Omit<ParkingSpotDto, 'timeRules' | 'timeRuleOverrides'> & {
  timeRules: TimeRule[]
  timeRuleOverrides: TimeRuleOverride[]
}

export const parkingSpotToDto = (parkingSpot: ParkingSpot): ParkingSpotDto => {
  return {
    ...parkingSpot,
    timeRules: parkingSpot.timeRules.map(timeRuleToDto),
    timeRuleOverrides: parkingSpot.timeRuleOverrides.map(timeRuleOverrideToDto),
  }
}
