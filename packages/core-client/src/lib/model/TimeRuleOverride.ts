import { z } from 'zod'

export const TimeRuleOverrideSchema = z.object({
  startsAt: z.string().datetime({ offset: true }),
  endsAt: z.string().datetime({ offset: true }),
  isAvailable: z.boolean(),
})
