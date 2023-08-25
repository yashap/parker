import { z } from 'zod'

export const ListParkingSpotsClosestToPointRequestSchema = z.object({
  latitude: z.coerce.number().min(-90).max(90),
  longitude: z.coerce.number().min(-180).max(180),
  limit: z.coerce.number().min(1).max(100),
})
