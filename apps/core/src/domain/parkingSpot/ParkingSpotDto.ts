import { OmitType, PartialType } from '@nestjs/mapped-types'
import { IsUUID, ValidateNested } from 'class-validator'
import { PointDto } from '../geography/PointDto'
import { ParkingSpot, ParkingSpotProps } from './ParkingSpot'

export type ParkingSpotDtoProps = ParkingSpotProps

export class ParkingSpotDto {
  constructor({ id, ownerUserId, location }: ParkingSpotProps) {
    this.id = id
    this.ownerUserId = ownerUserId
    this.location = location
  }

  public static buildFromDomain(parkingSpot: ParkingSpot): ParkingSpotDto {
    return new ParkingSpotDto(parkingSpot)
  }

  @IsUUID()
  public readonly id: string

  @IsUUID()
  public readonly ownerUserId: string

  @ValidateNested()
  public readonly location: PointDto
}

export class CreateParkingSpotDto extends OmitType(ParkingSpotDto, ['id'] as const) {}

export class UpdateParkingSpotDto extends PartialType(OmitType(CreateParkingSpotDto, ['ownerUserId'] as const)) {}
