import { z } from 'zod'

export const BookingStatusSchema = z.enum(['Accepted', 'InProgress', 'Cancelled'])

export const ParkingSpotBookingSchema = z.object({
  id: z.string().uuid(),
  parkingSpotId: z.string().uuid(),
  bookedByUserId: z.string().uuid(),
  bookingStartsAt: z.string().datetime(),
  bookingEndsAt: z.string().datetime(),
  status: BookingStatusSchema,
})

export const CreateParkingSpotBookingRequestSchema = ParkingSpotBookingSchema.omit({
  id: true,
  parkingSpotId: true,
  status: true,
})
