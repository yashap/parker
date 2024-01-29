import { Temporal } from '@js-temporal/polyfill'
import { TimeRuleDto } from '@parker/core-client'

export type TimeRule = Omit<TimeRuleDto, 'startTime' | 'endTime'> & {
  startTime: Temporal.PlainTime
  endTime: Temporal.PlainTime
}

export const timeRuleFromDto = (timeRule: TimeRuleDto): TimeRule => {
  return {
    ...timeRule,
    startTime: Temporal.PlainTime.from(timeRule.startTime),
    endTime: Temporal.PlainTime.from(timeRule.endTime),
  }
}

export const timeRuleToDto = (timeRule: TimeRule): TimeRuleDto => {
  return {
    ...timeRule,
    startTime: timeRule.startTime.toString({ smallestUnit: 'seconds' }),
    endTime: timeRule.endTime.toString({ smallestUnit: 'seconds' }),
  }
}
