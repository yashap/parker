import { z } from 'zod'

export const BookingStatusSchema = z.enum(['Accepted', 'InProgress', 'Cancelled'])

export const ParkingSpotBookingSchema = z.object({
  id: z.string().uuid(),
  parkingSpotId: z.string().uuid(),
  bookedByUserId: z.string().uuid(),
  bookingStartsAt: z.string().datetime({ offset: true }),
  bookingEndsAt: z.string().datetime({ offset: true }).optional(),
  status: BookingStatusSchema,
})

export const CreateParkingSpotBookingRequestSchema = ParkingSpotBookingSchema.omit({
  id: true, // Generated on the backend
  bookedByUserId: true, // Implied from session
  parkingSpotId: true, // Provided in the URL path
  status: true, // Generated on the backend
})
