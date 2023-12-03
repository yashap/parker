import { DayOfWeekSchema, PointSchema, SchemaBuilder, TimeSchema } from '@parker/api-client-utils'
import { z } from 'zod'

export const TimeRuleSchema = z.object({
  day: DayOfWeekSchema,
  startTime: TimeSchema,
  endTime: TimeSchema,
})

export const ParkingSpotSchema = z.object({
  id: z.string().uuid(),
  ownerUserId: z.string().uuid(),
  location: PointSchema,
  timeRules: z.array(TimeRuleSchema),
})

export const CreateParkingSpotRequestSchema = ParkingSpotSchema.omit({ id: true, ownerUserId: true })

export const UpdateParkingSpotRequestSchema = ParkingSpotSchema.omit({ id: true, ownerUserId: true }).partial()

export const ListParkingSpotsClosestToPointRequestSchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  limit: z.coerce.number().min(1).max(100),
})

export const ListParkingSpotsClosestToPointResponseSchema = SchemaBuilder.buildListResponse(ParkingSpotSchema)
