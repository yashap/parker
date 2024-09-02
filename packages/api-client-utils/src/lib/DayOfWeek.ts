import { z } from 'zod'

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'] as const

export const DayOfWeekSchema = z.enum(daysOfWeek)

export type DayOfWeekDto = z.infer<typeof DayOfWeekSchema>

export const DayOfWeekValues = DayOfWeekSchema.Enum

export const fromNumericDayOfWeek = (dayOfWeek: number): DayOfWeekDto => {
  if (dayOfWeek < 1 || dayOfWeek > 7 || !Number.isInteger(dayOfWeek)) {
    throw new Error(`Invalid day of week: ${dayOfWeek}. Must be an integer from 1 to 7`)
  }
  return daysOfWeek[dayOfWeek - 1]!
}

export const toNumericDayOfWeek = (dayOfWeek: DayOfWeekDto): number => {
  const index = daysOfWeek.indexOf(dayOfWeek)
  if (index === -1) {
    throw new Error(`Invalid day of week: ${dayOfWeek}. Must be one of: ${daysOfWeek.join(', ')}`)
  }
  return index + 1
}
