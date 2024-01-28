import { z } from 'zod'
import {
  CreateParkingSpotRequestSchema,
  ListParkingSpotsClosestToPointRequestSchema,
  ListParkingSpotsClosestToPointResponseSchema,
  ParkingSpotSchema,
  TimeRuleSchema,
  UpdateParkingSpotRequestSchema,
} from './ParkingSpot'
import {
  BookingStatusSchema,
  CreateParkingSpotBookingRequestSchema,
  ParkingSpotBookingSchema,
} from './ParkingSpotBooking'

// Requests
export type CreateParkingSpotRequest = z.infer<typeof CreateParkingSpotRequestSchema>
export type ListParkingSpotsClosestToPointRequest = z.infer<typeof ListParkingSpotsClosestToPointRequestSchema>
export type UpdateParkingSpotRequest = z.infer<typeof UpdateParkingSpotRequestSchema>
export type CreateParkingSpotBookingRequest = z.infer<typeof CreateParkingSpotBookingRequestSchema>

// Responses
export type ListParkingSpotsClosestToPointResponse = z.infer<typeof ListParkingSpotsClosestToPointResponseSchema>

// Data Models
export type { DayOfWeekDto } from '@parker/api-client-utils'
export type { PaginationDto } from '@parker/api-client-utils'
export type { PointDto } from '@parker/api-client-utils'
export type { ServerErrorDto } from '@parker/api-client-utils'
export type ParkingSpotDto = z.infer<typeof ParkingSpotSchema>
export type TimeRuleDto = z.infer<typeof TimeRuleSchema>
export type ParkingSpotBookingDto = z.infer<typeof ParkingSpotBookingSchema>
export type BookingStatusDto = z.infer<typeof BookingStatusSchema>
