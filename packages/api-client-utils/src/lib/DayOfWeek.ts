import { z } from 'zod'

export const DayOfWeekSchema = z.enum(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'])

export type DayOfWeekDto = z.infer<typeof DayOfWeekSchema>

export const DayOfWeekValues = DayOfWeekSchema.Enum
