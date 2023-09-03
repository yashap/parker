import { PaginationSchema } from '@parker/api-client-utils'
import { z } from 'zod'
import { ParkingSpotSchema } from './ParkingSpot'

export const ListParkingSpotsClosestToPointResponseSchema = z.object({
  data: z.array(ParkingSpotSchema),
  pagination: PaginationSchema.optional(),
})
