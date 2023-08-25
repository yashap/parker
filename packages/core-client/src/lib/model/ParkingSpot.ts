import { z } from 'zod'
import { PointSchema } from './Point'

export const ParkingSpotSchema = z.object({
  id: z.string().uuid(),
  ownerUserId: z.string().uuid(),
  location: PointSchema,
})
