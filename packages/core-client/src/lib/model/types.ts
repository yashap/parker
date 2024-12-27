import { z } from 'zod'
import {
  CreateParkingSpotRequestSchema,
  ListParkingSpotsClosestToPointRequestSchema,
  ListParkingSpotsResponseSchema,
  ListParkingSpotsRequestSchema,
  ParkingSpotSchema,
  UpdateParkingSpotRequestSchema,
  ListParkingSpotsClosestToPointResponseSchema,
} from 'src/lib/model/ParkingSpot'
import {
  BookingStatusSchema,
  CreateParkingSpotBookingRequestSchema,
  ParkingSpotBookingSchema,
} from 'src/lib/model/ParkingSpotBooking'
import { TimeRuleSchema } from 'src/lib/model/TimeRule'
import { TimeRuleOverrideSchema } from 'src/lib/model/TimeRuleOverride'

// Requests
export type CreateParkingSpotRequest = z.infer<typeof CreateParkingSpotRequestSchema>
export type ListParkingSpotsRequest = z.infer<typeof ListParkingSpotsRequestSchema>
export type ListParkingSpotsClosestToPointRequest = z.infer<typeof ListParkingSpotsClosestToPointRequestSchema>
export type UpdateParkingSpotRequest = z.infer<typeof UpdateParkingSpotRequestSchema>
export type CreateParkingSpotBookingRequest = z.infer<typeof CreateParkingSpotBookingRequestSchema>

// Responses
export type ListParkingSpotsClosestToPointResponse = z.infer<typeof ListParkingSpotsClosestToPointResponseSchema>
export type ListParkingSpotsResponse = z.infer<typeof ListParkingSpotsResponseSchema>

// Data Models
export type ParkingSpotDto = z.infer<typeof ParkingSpotSchema>
export type TimeRuleDto = z.infer<typeof TimeRuleSchema>
export type TimeRuleOverrideDto = z.infer<typeof TimeRuleOverrideSchema>
export type ParkingSpotBookingDto = z.infer<typeof ParkingSpotBookingSchema>
export type BookingStatusDto = z.infer<typeof BookingStatusSchema>
export const BookingStatusValues = BookingStatusSchema.Enum
export const BookingStatusAllValues = BookingStatusSchema.options
