import { Max, Min } from 'class-validator'
import { Point } from './Point'

export type PointDtoProps = Point

export class PointDto {
  constructor({ latitude, longitude }: PointDtoProps) {
    this.latitude = latitude
    this.longitude = longitude
  }

  public static buildFromDomain(point: Point): PointDto {
    return new PointDto(point)
  }

  @Min(-90)
  @Max(90)
  public readonly latitude: number

  @Min(-180)
  @Max(180)
  public readonly longitude: number
}
