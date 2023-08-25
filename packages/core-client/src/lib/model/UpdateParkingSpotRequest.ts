import { ParkingSpotSchema } from './ParkingSpot'

export const UpdateParkingSpotRequestSchema = ParkingSpotSchema.omit({ id: true, ownerUserId: true }).partial()
