import { Injectable } from '@nestjs/common'
import { CreateParkingSpotRequest, UpdateParkingSpotRequest } from '@parker/core-client'
import { GeoJsonPoint, Point, geoJsonToPoint } from '@parker/geography'
import { Selectable, sql } from 'kysely'
import { BaseRepository } from '../../db/BaseRepository'
import { ParkingSpot as ParkingSpotDao } from '../../db/generated/db'
import { ParkingSpot } from './ParkingSpot'

type CreateParkingSpotInput = CreateParkingSpotRequest
type UpdateParkingSpotInput = UpdateParkingSpotRequest

@Injectable()
export class ParkingSpotRepository extends BaseRepository {
  private readonly tableName = 'ParkingSpot' as const

  public async create(payload: CreateParkingSpotInput): Promise<ParkingSpot> {
    const { location, ...rest } = payload
    const parkingSpotDao = await this.db
      .insertInto(this.tableName)
      .values({
        ...rest,
        location: this.pointToSql(location),
        ...this.updatedAt(),
      })
      .returning(['id', 'ownerUserId', this.pointFieldToGeoJson('location').as('location')])
      .executeTakeFirstOrThrow()

    return ParkingSpotRepository.parkingSpotToDomain(parkingSpotDao)
  }

  public async getById(id: string): Promise<ParkingSpot | undefined> {
    return (await this.getByIds([id]))[0]
  }

  public async getByIds(ids: string[]): Promise<ParkingSpot[]> {
    if (ids.length === 0) {
      return []
    }
    const parkingSpotDaos = await this.db
      .selectFrom(this.tableName)
      .select(['id', 'ownerUserId', this.pointFieldToGeoJson('location').as('location')])
      .where('id', 'in', ids)
      .execute()
    return parkingSpotDaos.map((dao) => ParkingSpotRepository.parkingSpotToDomain(dao))
  }

  public async listParkingSpotsClosestToLocation(location: Point, limit: number): Promise<ParkingSpot[]> {
    if (limit === 0) {
      return []
    }
    const { longitude, latitude } = location
    const parkingSpotDaos = await this.db
      .selectFrom(this.tableName)
      .select(['id', 'ownerUserId', this.pointFieldToGeoJson('location').as('location')])
      .orderBy(sql`"location" <-> ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`, 'asc')
      .limit(limit)
      .execute()
    return parkingSpotDaos.map((dao) => ParkingSpotRepository.parkingSpotToDomain(dao))
  }

  public async update(id: string, update: UpdateParkingSpotInput): Promise<ParkingSpot> {
    const { location, ...rest } = update
    const parkingSpotDao = await this.db
      .updateTable(this.tableName)
      .set({
        ...rest,
        ...(location && { location: this.pointToSql(location) }),
        ...this.updatedAt(),
      })
      .where('id', '=', id)
      .returning(['id', 'ownerUserId', this.pointFieldToGeoJson('location').as('location')])
      .executeTakeFirstOrThrow()
    return ParkingSpotRepository.parkingSpotToDomain(parkingSpotDao)
  }

  public async delete(id: string): Promise<void> {
    await this.db.deleteFrom(this.tableName).where('id', '=', id).executeTakeFirst()
  }

  private static parkingSpotToDomain(
    parkingSpotDao: Pick<Selectable<ParkingSpotDao>, 'id' | 'ownerUserId' | 'location'>
  ): ParkingSpot {
    const { id, ownerUserId, location } = parkingSpotDao
    const locationGeoJson = JSON.parse(location) as GeoJsonPoint
    return { id, ownerUserId, location: geoJsonToPoint(locationGeoJson) }
  }
}
