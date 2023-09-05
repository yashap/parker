import { PointSchema } from '@parker/api-client-utils'
import { z } from 'zod'

export const ParkingSpotSchema = z.object({
  id: z.string().uuid(),
  ownerUserId: z.string().uuid(),
  location: PointSchema,
})
