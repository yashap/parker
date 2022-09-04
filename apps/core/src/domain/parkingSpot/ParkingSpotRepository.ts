import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ParkingSpot as PrismaParkingSpot } from '@prisma/client'
import { isEmpty } from 'lodash'
import { BaseRepository } from '../../db/BaseRepository'
import { GeoJsonPoint, Point } from '../geography'
import { ParkingSpot, ParkingSpotProps } from './ParkingSpot'

type CreateParkingSpotInput = Omit<ParkingSpotProps, 'id'>
type UpdateParkingSpotInput = Partial<CreateParkingSpotInput>

// TODO: everything in transactions
@Injectable()
export class ParkingSpotRepository extends BaseRepository {
  public async create(payload: CreateParkingSpotInput): Promise<ParkingSpot> {
    const { location, ...otherPayload } = payload
    const prismaParkingSpot = await this.parkingSpot.create({ data: otherPayload })
    await this.updateLocation(prismaParkingSpot.id, location)
    return ParkingSpotRepository.parkingSpotToDomain(prismaParkingSpot, location)
  }

  public async findById(id: string): Promise<ParkingSpot | undefined> {
    const prismaParkingSpot = await this.parkingSpot.findUnique({ where: { id } })
    if (prismaParkingSpot === null) {
      return undefined
    }
    const location = await this.getLocation(id)
    return ParkingSpotRepository.parkingSpotToDomain(prismaParkingSpot, location)
  }

  public async update(id: string, updates: UpdateParkingSpotInput): Promise<ParkingSpot> {
    const { location, ...otherUpdates } = updates
    if (location) {
      await this.updateLocation(id, location)
    }
    if (!isEmpty(otherUpdates)) {
      await this.parkingSpot.update({ where: { id }, data: updates })
    }
    const parkingSpot = await this.findById(id)
    if (!parkingSpot) {
      // TODO: centralize errors
      throw new InternalServerErrorException(`ParkingSpot ${id} not found`)
    }
    return parkingSpot
  }

  public async delete(id: string): Promise<void> {
    await this.parkingSpot.delete({ where: { id } })
  }

  private async getLocation(id: string): Promise<Point> {
    const locations = await this.$queryRaw<
      Array<{ locationJson: GeoJsonPoint }>
    >`SELECT ST_AsGeoJSON("location")::JSONB AS "locationJson" FROM "ParkingSpot" WHERE "id" = UUID(${id})`
    const location = locations[0]
    if (location === undefined) {
      // TODO: centralize errors
      throw new InternalServerErrorException(`ParkingSpot ${id} did not have a location`)
    }
    const [longitude, latitude] = location.locationJson.coordinates
    return { longitude, latitude }
  }

  private async updateLocation(id: string, { longitude, latitude }: Point): Promise<void> {
    const rowsModified = await this
      .$executeRaw`UPDATE "ParkingSpot" SET "location" = ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326) WHERE "id" = UUID(${id})`
    if (rowsModified < 1) {
      // TODO: centralize errors
      throw new InternalServerErrorException(`ParkingSpot ${id} not found`)
    }
  }

  private static parkingSpotToDomain(prismaParkingSpot: PrismaParkingSpot, location: Point): ParkingSpot {
    return new ParkingSpot({ ...prismaParkingSpot, location })
  }
}
