import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { ParkingSpot as PrismaParkingSpot, Prisma } from '@prisma/client'
import { isEmpty } from 'lodash'
import { BaseRepository } from '../../db/BaseRepository'
import { GeoJsonPoint, Point } from '../geography'
import { ParkingSpot, ParkingSpotProps } from './ParkingSpot'

type CreateParkingSpotInput = Omit<ParkingSpotProps, 'id'>
type UpdateParkingSpotInput = Partial<CreateParkingSpotInput>

@Injectable()
export class ParkingSpotRepository extends BaseRepository {
  public async create(payload: CreateParkingSpotInput): Promise<ParkingSpot> {
    const { location, ...otherPayload } = payload
    return await this.$transaction(
      async (transaction) => {
        const prismaParkingSpot = await transaction.parkingSpot.create({ data: otherPayload })
        await this.updateLocation(transaction, prismaParkingSpot.id, location)
        return ParkingSpotRepository.parkingSpotToDomain(prismaParkingSpot, location)
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead }
    )
  }

  public async findById(id: string): Promise<ParkingSpot | undefined> {
    return await this.$transaction(
      async (transaction) => {
        const prismaParkingSpot = await transaction.parkingSpot.findUnique({ where: { id } })
        if (prismaParkingSpot === null) {
          return undefined
        }
        const location = await this.getLocation(transaction, id)
        return ParkingSpotRepository.parkingSpotToDomain(prismaParkingSpot, location)
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead }
    )
  }

  public async update(id: string, updates: UpdateParkingSpotInput): Promise<ParkingSpot> {
    const { location, ...otherUpdates } = updates
    return await this.$transaction(
      async (transaction) => {
        if (location) {
          await this.updateLocation(transaction, id, location)
        }
        if (!isEmpty(otherUpdates)) {
          await transaction.parkingSpot.update({ where: { id }, data: updates })
        }
        const parkingSpot = await this.findById(id) // TODO: no nested transaction
        if (!parkingSpot) {
          // TODO: centralize errors
          throw new InternalServerErrorException(`ParkingSpot ${id} not found`)
        }
        return parkingSpot
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead }
    )
  }

  public async delete(id: string): Promise<void> {
    await this.parkingSpot.delete({ where: { id } })
  }

  private async getLocation(transaction: Prisma.TransactionClient, id: string): Promise<Point> {
    const locations = await transaction.$queryRaw<
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

  private async updateLocation(
    transaction: Prisma.TransactionClient,
    id: string,
    { longitude, latitude }: Point
  ): Promise<void> {
    const rowsModified =
      await transaction.$executeRaw`UPDATE "ParkingSpot" SET "location" = ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326) WHERE "id" = UUID(${id})`
    if (rowsModified < 1) {
      // TODO: centralize errors
      throw new InternalServerErrorException(`ParkingSpot ${id} not found`)
    }
  }

  private static parkingSpotToDomain(prismaParkingSpot: PrismaParkingSpot, location: Point): ParkingSpot {
    return new ParkingSpot({ ...prismaParkingSpot, location })
  }
}
