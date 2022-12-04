import { OmitType, PartialType } from '@nestjs/mapped-types'
import { CreateParkingSpotDto, ParkingSpotDto, UpdateParkingSpotDto } from '@parker/core-client'
import { IsUUID, ValidateNested } from 'class-validator'
import { PointDto } from '../geography'
import { ParkingSpot } from './ParkingSpot'

export class ParkingSpotValidatingDto implements ParkingSpotDto {
  constructor({ id, ownerUserId, location }: ParkingSpotDto) {
    this.id = id
    this.ownerUserId = ownerUserId
    this.location = location
  }

  public static buildFromDomain(parkingSpot: ParkingSpot): ParkingSpotValidatingDto {
    return new ParkingSpotValidatingDto(parkingSpot)
  }

  @IsUUID()
  public readonly id: string

  @IsUUID()
  public readonly ownerUserId: string

  @ValidateNested()
  public readonly location: PointDto
}

export class CreateParkingSpotValidatingDto
  extends OmitType(ParkingSpotValidatingDto, ['id'] as const)
  implements CreateParkingSpotDto {}

export class UpdateParkingSpotValidatingDto
  extends PartialType(OmitType(CreateParkingSpotValidatingDto, ['ownerUserId'] as const))
  implements UpdateParkingSpotDto {}
