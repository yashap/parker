import { ParkingSpotDto } from '@parker/core-client'
import { TimeRule, timeRuleToDto } from '../timeRule'

export type ParkingSpot = Omit<ParkingSpotDto, 'timeRules'> & {
  timeRules: TimeRule[]
}

export const parkingSpotToDto = (parkingSpot: ParkingSpot): ParkingSpotDto => {
  return {
    ...parkingSpot,
    timeRules: parkingSpot.timeRules.map(timeRuleToDto),
  }
}
