import { OmitType, PartialType } from '@nestjs/mapped-types'
import { IsNotEmpty, IsUUID } from 'class-validator'
import { ParkingSpot } from './ParkingSpot'

export class ParkingSpotDto {
  constructor(id: string, name: string) {
    this.id = id
    this.name = name
  }

  public static buildFromDomain(parkingSpot: ParkingSpot): ParkingSpotDto {
    return new ParkingSpotDto(parkingSpot.id, parkingSpot.name)
  }

  @IsUUID()
  public readonly id: string

  @IsNotEmpty()
  public readonly name: string
}

export class CreateParkingSpotDto extends OmitType(ParkingSpotDto, ['id'] as const) {}

export class UpdateParkingSpotDto extends PartialType(CreateParkingSpotDto) {}
