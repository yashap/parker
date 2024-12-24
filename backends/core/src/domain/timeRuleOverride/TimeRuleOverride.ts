import { TimeRuleOverrideDto } from '@parker/core-client'
import { formatInstantFields, parseInstantFields } from '@parker/time'
import { TimeRuleOverrideDao } from '../../db/types'

export type TimeRuleOverride = Omit<TimeRuleOverrideDao, 'id' | 'createdAt' | 'updatedAt' | 'parkingSpotId'>

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
