import { Injectable } from '@nestjs/common'
import { CreateParkingSpotRequest, UpdateParkingSpotRequest } from '@parker/core-client'
import { required } from '@parker/errors'
import { GeoJsonPoint, Point, geoJsonToPoint } from '@parker/geography'
import { ExpressionBuilder, Selectable, sql } from 'kysely'
import { jsonArrayFrom } from 'kysely/helpers/postgres'
import { BaseRepository } from '../../db/BaseRepository'
import { DB, ParkingSpot as ParkingSpotDao, TimeRule as TimeRuleDao } from '../../db/generated/db'
import { DayOfWeek, ParkingSpot } from './ParkingSpot'

export interface CreateParkingSpotInput extends CreateParkingSpotRequest {
  ownerUserId: string
}

export type UpdateParkingSpotInput = UpdateParkingSpotRequest

@Injectable()
export class ParkingSpotRepository extends BaseRepository {
  public async create(payload: CreateParkingSpotInput): Promise<ParkingSpot> {
    const { location, timeRules, ...rest } = payload
    const { id: parkingSpotId } = await this.db
      .insertInto('ParkingSpot')
      .values({
        ...rest,
        location: this.pointToSql(location),
        ...this.updatedAt(),
      })
      .returning(['id'])
      .executeTakeFirstOrThrow()
    if (timeRules.length > 0) {
      await this.db
        .insertInto('TimeRule')
        .values(timeRules.map((timeRule) => ({ ...timeRule, ...this.updatedAt(), parkingSpotId })))
        .execute()
    }
    const parkingSpot = await this.getById(parkingSpotId)
    return required(parkingSpot)
  }

  public async getById(id: string): Promise<ParkingSpot | undefined> {
    const parkingSpotDao = await this.db
      .selectFrom('ParkingSpot')
      .select((eb) => this.buildFields(eb))
      .where('id', '=', id)
      .executeTakeFirst()
    return parkingSpotDao ? this.parkingSpotToDomain(parkingSpotDao) : undefined
  }

  public async listParkingSpotsClosestToLocation(location: Point, limit: number): Promise<ParkingSpot[]> {
    if (limit === 0) {
      return []
    }
    const { longitude, latitude } = location
    const parkingSpotDaos = await this.db
      .selectFrom('ParkingSpot')
      .select((eb) => this.buildFields(eb))
      .orderBy(sql`"location" <-> ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`, 'asc')
      .limit(limit)
      .execute()
    return parkingSpotDaos.map((dao) => this.parkingSpotToDomain(dao))
  }

  public async update(id: string, update: UpdateParkingSpotInput): Promise<ParkingSpot> {
    const { location, timeRules, ...rest } = update
    if (timeRules) {
      await this.db.deleteFrom('TimeRule').where('parkingSpotId', '=', id).execute()
      if (timeRules.length > 0) {
        await this.db
          .insertInto('TimeRule')
          .values(timeRules.map((timeRule) => ({ ...timeRule, ...this.updatedAt(), parkingSpotId: id })))
          .execute()
      }
    }
    const parkingSpotDao = await this.db
      .updateTable('ParkingSpot')
      .set({
        ...rest,
        ...(location && { location: this.pointToSql(location) }),
        ...this.updatedAt(),
      })
      .where('id', '=', id)
      .returning((eb) => this.buildFields(eb))
      .executeTakeFirstOrThrow()
    return this.parkingSpotToDomain(parkingSpotDao)
  }

  public async delete(id: string): Promise<void> {
    await this.db.deleteFrom('ParkingSpot').where('id', '=', id).execute()
  }

  private buildFields(eb: ExpressionBuilder<DB, 'ParkingSpot'>) {
    const timeRulesFields = [
      'id',
      'ownerUserId',
      this.pointFieldToGeoJson('location').as('location'),
      jsonArrayFrom(
        eb
          .selectFrom('TimeRule')
          .select(['TimeRule.day', 'TimeRule.startTime', 'TimeRule.endTime'])
          .whereRef('TimeRule.parkingSpotId', '=', 'ParkingSpot.id')
          // TODO: maybe better ordering? Like day of week ascending, then start time, then end time, then id as a tie breaker?
          .orderBy(['TimeRule.createdAt', 'TimeRule.id'])
      ).as('timeRules'),
    ] as const
    return timeRulesFields
  }

  private parkingSpotToDomain(
    parkingSpotDao: Pick<Selectable<ParkingSpotDao>, 'id' | 'ownerUserId' | 'location'> & {
      timeRules: Array<Pick<Selectable<TimeRuleDao>, 'day' | 'startTime' | 'endTime'>>
    }
  ): ParkingSpot {
    const { id, ownerUserId, location, timeRules } = parkingSpotDao
    const locationGeoJson = JSON.parse(location) as GeoJsonPoint
    return {
      id,
      ownerUserId,
      location: geoJsonToPoint(locationGeoJson),
      timeRules: timeRules.map((timeRule) => ({
        day: timeRule.day as DayOfWeek,
        startTime: timeRule.startTime,
        endTime: timeRule.endTime,
      })),
    }
  }
}
