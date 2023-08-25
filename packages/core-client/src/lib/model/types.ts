import { z } from 'zod'
import { CreateParkingSpotRequestSchema } from './CreateParkingSpotRequest'
import { CreateUserRequestSchema } from './CreateUserRequest'
import { ListParkingSpotsClosestToPointRequestSchema } from './ListParkingSpotsClosestToPointRequest'
import { ListParkingSpotsClosestToPointResponseSchema } from './ListParkingSpotsClosestToPointResponse'
import { PaginationSchema } from './Pagination'
import { ParkingSpotSchema } from './ParkingSpot'
import { PointSchema } from './Point'
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
export type PaginationDto = z.infer<typeof PaginationSchema>
export type ParkingSpotDto = z.infer<typeof ParkingSpotSchema>
export type PointDto = z.infer<typeof PointSchema>
export type UserDto = z.infer<typeof UserSchema>
