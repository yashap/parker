import { Temporal } from '@js-temporal/polyfill'
import { TimeRuleDto } from '@parker/parking-client'
import { TimeRuleDao } from 'src/db/types'

export type TimeRule = Omit<TimeRuleDao, 'id' | 'createdAt' | 'updatedAt' | 'parkingSpotId'>

export const timeRuleFromDto = (timeRule: TimeRuleDto): TimeRule => {
  return {
    ...timeRule,
    startTime: Temporal.PlainTime.from(timeRule.startTime),
    endTime: Temporal.PlainTime.from(timeRule.endTime),
  }
}

export const timeRulesFromDto = (timeRules: TimeRuleDto[]): TimeRule[] => timeRules.map(timeRuleFromDto)

export const timeRuleToDto = (timeRule: TimeRule): TimeRuleDto => {
  return {
    ...timeRule,
    startTime: timeRule.startTime.toString({ smallestUnit: 'seconds' }),
    endTime: timeRule.endTime.toString({ smallestUnit: 'seconds' }),
  }
}
