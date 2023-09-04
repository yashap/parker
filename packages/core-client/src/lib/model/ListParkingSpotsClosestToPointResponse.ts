import { SchemaBuilder } from '@parker/api-client-utils'
import { ParkingSpotSchema } from './ParkingSpot'

export const ListParkingSpotsClosestToPointResponseSchema = SchemaBuilder.buildListResponse(ParkingSpotSchema)
