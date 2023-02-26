import { Injectable } from '@nestjs/common'
import { Point } from '@parker/geography'
import { Selectable, sql } from 'kysely'
import { BaseRepository } from '../../db/BaseRepository'
import { ParkingSpot as ParkingSpotDao } from '../../db/generated/db'
import { GeoJsonPoint, toPoint } from '../geography'
import { ParkingSpot } from './ParkingSpot'

type CreateParkingSpotInput = Omit<ParkingSpot, 'id'>
type UpdateParkingSpotInput = Partial<CreateParkingSpotInput>

@Injectable()
export class ParkingSpotRepository extends BaseRepository {
  public async create(payload: CreateParkingSpotInput): Promise<ParkingSpot> {
    const { location, ...rest } = payload
    const parkingSpotDao = await this.db
      .insertInto('ParkingSpot')
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
      .selectFrom('ParkingSpot')
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
      .selectFrom('ParkingSpot')
      .select(['id', 'ownerUserId', this.pointFieldToGeoJson('location').as('location')])
      .orderBy(sql`"location" <-> ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`, 'asc')
      .limit(limit)
      .execute()
    return parkingSpotDaos.map((dao) => ParkingSpotRepository.parkingSpotToDomain(dao))
  }

  public async update(id: string, updates: UpdateParkingSpotInput): Promise<ParkingSpot> {
    const { location, ...rest } = updates
    const userDao = await this.db
      .updateTable('ParkingSpot')
      .set({
        ...rest,
        ...(location && { location: this.pointToSql(location) }),
        ...this.updatedAt(),
      })
      .where('id', '=', id)
      .returning(['id', 'ownerUserId', this.pointFieldToGeoJson('location').as('location')])
      .executeTakeFirstOrThrow()
    return ParkingSpotRepository.parkingSpotToDomain(userDao)
  }

  public async delete(id: string): Promise<void> {
    await this.db.deleteFrom('ParkingSpot').where('id', '=', id).executeTakeFirst()
  }

  private static parkingSpotToDomain(
    parkingSpotDao: Pick<Selectable<ParkingSpotDao>, 'id' | 'ownerUserId' | 'location'>
  ): ParkingSpot {
    const { id, ownerUserId, location } = parkingSpotDao
    const locationGeoJson = JSON.parse(location!) as GeoJsonPoint // TODO: remove the ! once I make the DB field non-nullable
    return { id, ownerUserId, location: toPoint(locationGeoJson) }
  }
}
