import { Temporal } from '@js-temporal/polyfill'
import { InstantStringSchema } from '@parker/api-client-utils'
import { ParkingSpotDto } from '@parker/core-client'
import { Cursor } from '@parker/pagination'
import { formatInstantFields } from '@parker/time'
import { z } from 'zod'
import { ParkingSpotDao } from 'src/db/types'
import { TimeRule, timeRuleToDto } from 'src/domain/timeRule'
import { TimeRuleOverride, timeRuleOverrideToDto } from 'src/domain/timeRuleOverride'

export type ParkingSpot = ParkingSpotDao & {
  timeRules: TimeRule[]
  timeRuleOverrides: TimeRuleOverride[]
}

export type ListParkingSpotCursor = Cursor<'createdAt', Temporal.Instant>

const ListParkingSpotOrderingSchema = z.object({
  orderBy: z.literal('createdAt'),
  lastOrderValueSeen: InstantStringSchema,
})

export const parseParkingSpotOrdering = (ordering: {
  orderBy: unknown
  lastOrderValueSeen: unknown
}): Pick<ListParkingSpotCursor, 'orderBy' | 'lastOrderValueSeen'> => {
  return ListParkingSpotOrderingSchema.parse(ordering)
}

export type ListParkingSpotPagination =
  | ListParkingSpotCursor
  | Omit<ListParkingSpotCursor, 'lastOrderValueSeen' | 'lastIdSeen'>

export const parkingSpotToDto = (parkingSpot: ParkingSpot): ParkingSpotDto => {
  return {
    ...parkingSpot,
    ...formatInstantFields(parkingSpot, ['createdAt', 'updatedAt']),
    timeRules: parkingSpot.timeRules.map(timeRuleToDto),
    timeRuleOverrides: parkingSpot.timeRuleOverrides.map(timeRuleOverrideToDto),
  }
}
