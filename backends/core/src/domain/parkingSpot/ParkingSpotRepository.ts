import { Injectable } from '@nestjs/common'
import { InternalServerError } from '@parker/errors'
import { Point } from '@parker/geography'
import { ParkingSpot as PrismaParkingSpot, Prisma } from '@prisma/client'
import { compact, isEmpty } from 'lodash'
import { BaseRepository } from '../../db/BaseRepository'
import { GeoJsonPoint } from '../geography'
import { ParkingSpot, ParkingSpotProps } from './ParkingSpot'

type CreateParkingSpotInput = Omit<ParkingSpotProps, 'id'>
type UpdateParkingSpotInput = Partial<CreateParkingSpotInput>

@Injectable()
export class ParkingSpotRepository extends BaseRepository {
  public async create(payload: CreateParkingSpotInput): Promise<ParkingSpot> {
    const { location, ...otherPayload } = payload
    return await this.prisma.$transaction(
      async (transaction) => {
        const prismaParkingSpot = await transaction.parkingSpot.create({ data: otherPayload })
        await this.updateLocation(transaction, prismaParkingSpot.id, location)
        return ParkingSpotRepository.parkingSpotToDomain(prismaParkingSpot, location)
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead }
    )
  }

  public async getById(id: string): Promise<ParkingSpot | undefined> {
    return (await this.getByIds([id]))[0]
  }

  public async getByIds(ids: string[]): Promise<ParkingSpot[]> {
    if (ids.length === 0) {
      return []
    }
    return await this.prisma.$transaction(async (transaction) => {
      const [prismaParkingSpots, locationsMap] = await Promise.all([
        transaction.parkingSpot.findMany({ where: { id: { in: ids } } }),
        this.getLocations(transaction, ids),
      ])
      return prismaParkingSpots.map((prismaParkingSpot) => {
        const location = locationsMap.get(prismaParkingSpot.id)!
        return ParkingSpotRepository.parkingSpotToDomain(prismaParkingSpot, location)
      })
    })
  }

  public async listParkingSpotsClosestToLocation(location: Point, limit: number): Promise<ParkingSpot[]> {
    if (limit === 0) {
      return []
    }
    return await this.prisma.$transaction(
      async (transaction) => {
        const { longitude, latitude } = location
        const closestIds = await transaction.$queryRaw<Array<{ id: string }>>`
          SELECT
            "id"
            , "location" <-> ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326) AS "distanceToPoint"
          FROM
            "ParkingSpot"
          ORDER BY
            "distanceToPoint" ASC
          LIMIT
            ${limit}
        `
        const closestSpots = await Promise.all(closestIds.map(({ id }) => this.getById(id)))
        return compact(closestSpots)
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead }
    )
  }

  public async update(id: string, updates: UpdateParkingSpotInput): Promise<ParkingSpot> {
    const { location, ...otherUpdates } = updates
    return await this.prisma.$transaction(
      async (transaction) => {
        if (location) {
          await this.updateLocation(transaction, id, location)
        }
        if (!isEmpty(otherUpdates)) {
          await transaction.parkingSpot.update({ where: { id }, data: updates })
        }
        const parkingSpot = await this.getById(id) // TODO: no nested transaction
        if (!parkingSpot) {
          throw new InternalServerError(`ParkingSpot ${id} not found`)
        }
        return parkingSpot
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.RepeatableRead }
    )
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.parkingSpot.delete({ where: { id } })
  }

  private async getLocations(
    transaction: Prisma.TransactionClient,
    parkingSpotIds: string[]
  ): Promise<Map<string, Point>> {
    if (parkingSpotIds.length === 0) {
      return new Map()
    }
    const locations = await transaction.$queryRawUnsafe<Array<{ id: string; locationJson: GeoJsonPoint }>>(
      `SELECT
        "id"
        , ST_AsGeoJSON("location")::JSONB AS "locationJson"
        FROM
          "ParkingSpot"
        WHERE
          "id" IN (${parkingSpotIds.map((id) => `UUID('${id}')`).join(', ')})
      `
    )
    return new Map(
      locations.map(({ id, locationJson }) => {
        const [longitude, latitude] = locationJson.coordinates
        return [id, { longitude, latitude }]
      })
    )
  }

  private async updateLocation(
    transaction: Prisma.TransactionClient,
    id: string,
    { longitude, latitude }: Point
  ): Promise<void> {
    const rowsModified =
      await transaction.$executeRaw`UPDATE "ParkingSpot" SET "location" = ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326) WHERE "id" = UUID(${id})`
    if (rowsModified < 1) {
      throw new InternalServerError(`ParkingSpot ${id} not found`)
    }
  }

  private static parkingSpotToDomain(prismaParkingSpot: PrismaParkingSpot, location: Point): ParkingSpot {
    return new ParkingSpot({ ...prismaParkingSpot, location })
  }
}
