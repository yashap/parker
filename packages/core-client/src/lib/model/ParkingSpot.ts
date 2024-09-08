import { PointSchema, SchemaBuilder } from '@parker/api-client-utils'
import { z } from 'zod'
import { TimeRuleSchema } from './TimeRule'
import { TimeRuleOverrideSchema } from './TimeRuleOverride'

export const ParkingSpotSchema = z.object({
  id: z.string().uuid(),
  ownerUserId: z.string().uuid(),
  location: PointSchema,
  timeRules: z.array(TimeRuleSchema),
  timeRuleOverrides: z.array(TimeRuleOverrideSchema),
  timeZone: z.string(),
})

export const CreateParkingSpotRequestSchema = ParkingSpotSchema.omit({ id: true, ownerUserId: true, timeZone: true })

export const UpdateParkingSpotRequestSchema = ParkingSpotSchema.omit({
  id: true,
  ownerUserId: true,
  timeZone: true,
}).partial()

export const ListParkingSpotsClosestToPointRequestSchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  limit: z.coerce.number().min(1).max(100),
})

export const ListParkingSpotsClosestToPointResponseSchema = SchemaBuilder.buildListResponse(ParkingSpotSchema)
