import { Point } from '@parker/geography'

export interface ParkingSpotDto {
  id: string
  ownerUserId: string
  location: Point
}

// TODO: also exclude ownerUserId once that's inferred from the auth token
export type CreateParkingSpotDto = Exclude<ParkingSpotDto, 'id'>

export type UpdateParkingSpotDto = Exclude<CreateParkingSpotDto, 'ownerUserId'>
