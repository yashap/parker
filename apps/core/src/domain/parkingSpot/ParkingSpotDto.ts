import { OmitType, PartialType } from '@nestjs/mapped-types'
import { IsUUID } from 'class-validator'
import { ParkingSpot, ParkingSpotProps } from './ParkingSpot'

export type ParkingSpotDtoProps = ParkingSpotProps

export class ParkingSpotDto {
  constructor({ id, landlordId }: ParkingSpotProps) {
    this.id = id
    this.landlordId = landlordId
  }

  public static buildFromDomain(parkingSpot: ParkingSpot): ParkingSpotDto {
    return new ParkingSpotDto(parkingSpot)
  }

  @IsUUID()
  public readonly id: string

  @IsUUID()
  public readonly landlordId: string
}

export class CreateParkingSpotDto extends OmitType(ParkingSpotDto, ['id'] as const) {}

export class UpdateParkingSpotDto extends PartialType(OmitType(CreateParkingSpotDto, ['landlordId'] as const)) {}
