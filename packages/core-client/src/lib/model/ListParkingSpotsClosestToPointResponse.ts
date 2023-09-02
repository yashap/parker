import { z } from 'zod'
import { PaginationSchema } from './Pagination'
import { ParkingSpotSchema } from './ParkingSpot'

export const ListParkingSpotsClosestToPointResponseSchema = z.object({
  data: z.array(ParkingSpotSchema),
  pagination: PaginationSchema.optional(),
})
