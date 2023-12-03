import { z } from 'zod'
import {
  CreateParkingSpotRequestSchema,
  ListParkingSpotsClosestToPointRequestSchema,
  ListParkingSpotsClosestToPointResponseSchema,
  ParkingSpotSchema,
  TimeRuleSchema,
  UpdateParkingSpotRequestSchema,
} from './ParkingSpot'

// Requests
export type CreateParkingSpotRequest = z.infer<typeof CreateParkingSpotRequestSchema>
export type ListParkingSpotsClosestToPointRequest = z.infer<typeof ListParkingSpotsClosestToPointRequestSchema>
export type UpdateParkingSpotRequest = z.infer<typeof UpdateParkingSpotRequestSchema>

// Responses
export type ListParkingSpotsClosestToPointResponse = z.infer<typeof ListParkingSpotsClosestToPointResponseSchema>

// Data Models
export type { PaginationDto } from '@parker/api-client-utils'
export type { PointDto } from '@parker/api-client-utils'
export type { ServerErrorDto } from '@parker/api-client-utils'
export type ParkingSpotDto = z.infer<typeof ParkingSpotSchema>
export type TimeRuleDto = z.infer<typeof TimeRuleSchema>
