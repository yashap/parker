import { z } from 'zod'
import { CreateParkingSpotRequestSchema } from './CreateParkingSpotRequest'
import { CreateUserRequestSchema } from './CreateUserRequest'
import { ListParkingSpotsClosestToPointRequestSchema } from './ListParkingSpotsClosestToPointRequest'
import { ListParkingSpotsClosestToPointResponseSchema } from './ListParkingSpotsClosestToPointResponse'
import { ParkingSpotSchema } from './ParkingSpot'
import { UpdateParkingSpotRequestSchema } from './UpdateParkingSpotRequest'
import { UpdateUserRequestSchema } from './UpdateUserRequest'
import { UserSchema } from './User'

// Requests
export type CreateParkingSpotRequest = z.infer<typeof CreateParkingSpotRequestSchema>
export type CreateUserRequest = z.infer<typeof CreateUserRequestSchema>
export type ListParkingSpotsClosestToPointRequest = z.infer<typeof ListParkingSpotsClosestToPointRequestSchema>
export type UpdateParkingSpotRequest = z.infer<typeof UpdateParkingSpotRequestSchema>
export type UpdateUserRequest = z.infer<typeof UpdateUserRequestSchema>

// Responses
export type ListParkingSpotsClosestToPointResponse = z.infer<typeof ListParkingSpotsClosestToPointResponseSchema>

// Data Models
export type { PaginationDto } from '@parker/api-client-utils'
export type { PointDto } from '@parker/api-client-utils'
export type { ServerErrorDto } from '@parker/api-client-utils'
export type ParkingSpotDto = z.infer<typeof ParkingSpotSchema>
export type UserDto = z.infer<typeof UserSchema>
