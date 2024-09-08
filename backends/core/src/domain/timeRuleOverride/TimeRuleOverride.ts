import { Temporal } from '@js-temporal/polyfill'
import { TimeRuleOverrideDto } from '@parker/core-client'

export type TimeRuleOverride = Omit<TimeRuleOverrideDto, 'startsAt' | 'endsAt'> & {
  startsAt: Temporal.Instant
  endsAt: Temporal.Instant
}

export const timeRuleOverrideFromDto = (timeRuleOverride: TimeRuleOverrideDto): TimeRuleOverride => {
  return {
    ...timeRuleOverride,
    startsAt: Temporal.Instant.from(timeRuleOverride.startsAt),
    endsAt: Temporal.Instant.from(timeRuleOverride.endsAt),
  }
}

export const timeRuleOverridesFromDto = (timeRuleOverrides: TimeRuleOverrideDto[]): TimeRuleOverride[] =>
  timeRuleOverrides.map(timeRuleOverrideFromDto)

export const timeRuleOverrideToDto = (timeRuleOverride: TimeRuleOverride): TimeRuleOverrideDto => {
  return {
    ...timeRuleOverride,
    startsAt: timeRuleOverride.startsAt.toString(),
    endsAt: timeRuleOverride.endsAt.toString(),
  }
}
