import { z } from 'zod'

export const TimeRuleOverrideSchema = z.object({
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  isAvailable: z.boolean(),
})
