import { DayOfWeekSchema, TimeSchema } from '@parker/api-client-utils'
import { z } from 'zod'

export const TimeRuleSchema = z.object({
  day: DayOfWeekSchema,
  startTime: TimeSchema,
  endTime: TimeSchema,
})
