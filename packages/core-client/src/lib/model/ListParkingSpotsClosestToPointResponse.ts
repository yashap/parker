import { buildListResponseSchema } from '@parker/api-client-utils'
import { ParkingSpotSchema } from './ParkingSpot'

export const ListParkingSpotsClosestToPointResponseSchema = buildListResponseSchema(ParkingSpotSchema)
