import { Temporal } from '@js-temporal/polyfill'
import { TimeRuleOverrideDto } from '@parker/core-client'
import { formatInstantFields, parseInstantFields } from '@parker/time'

export type TimeRuleOverride = Omit<TimeRuleOverrideDto, 'startsAt' | 'endsAt'> & {
  startsAt: Temporal.Instant
  endsAt: Temporal.Instant
}

export const timeRuleOverrideFromDto = (timeRuleOverride: TimeRuleOverrideDto): TimeRuleOverride => {
  return {
    ...timeRuleOverride,
    ...parseInstantFields(timeRuleOverride, ['startsAt', 'endsAt']),
  }
}

export const timeRuleOverridesFromDto = (timeRuleOverrides: TimeRuleOverrideDto[]): TimeRuleOverride[] =>
  timeRuleOverrides.map(timeRuleOverrideFromDto)

export const timeRuleOverrideToDto = (timeRuleOverride: TimeRuleOverride): TimeRuleOverrideDto => {
  return {
    ...timeRuleOverride,
    ...formatInstantFields(timeRuleOverride, ['startsAt', 'endsAt']),
  }
}
