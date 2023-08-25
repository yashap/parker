import { ParkingSpotSchema } from './ParkingSpot'

export const CreateParkingSpotRequestSchema = ParkingSpotSchema.omit({ id: true })
