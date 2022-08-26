import { IsNotEmpty, IsUUID } from 'class-validator'

export class ParkingSpotDto {
  constructor(id: string, name: string) {
    this.id = id
    this.name = name
  }

  @IsUUID()
  public readonly id: string

  @IsNotEmpty()
  public readonly name: string
}
