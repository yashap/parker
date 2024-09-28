import { Injectable } from '@nestjs/common'
import { CreateParkingSpotRequest, UpdateParkingSpotRequest } from '@parker/core-client'
import { required } from '@parker/errors'
import { GeoJsonPoint, Point, geoJsonToPoint } from '@parker/geography'
import { QueryUtils } from '@parker/kysely-utils'
import { ExpressionBuilder, Selectable, sql } from 'kysely'
import { jsonArrayFrom } from 'kysely/helpers/postgres'
import { isString } from 'lodash'
import { BaseRepository } from '../../db/BaseRepository'
import { DB, ParkingSpot as ParkingSpotGeneratedDao } from '../../db/generated/db'
import { TimeZoneLookup } from '../time/TimeZoneLookup'
import { TimeRule, TimeRuleDao, TimeRuleRepository } from '../timeRule'
import { TimeRuleOverride, TimeRuleOverrideDao, TimeRuleOverrideRepository } from '../timeRuleOverride'
import { ParkingSpot } from './ParkingSpot'

type ParkingSpotDao = Pick<Selectable<ParkingSpotGeneratedDao>, 'id' | 'ownerUserId' | 'location' | 'timeZone'> & {
  timeRules: TimeRuleDao[]
  timeRuleOverrides: TimeRuleOverrideDao[]
}

export type CreateParkingSpotInput = Omit<CreateParkingSpotRequest, 'timeRules' | 'timeRuleOverrides'> & {
  ownerUserId: string
  timeRules: TimeRule[]
  timeRuleOverrides: TimeRuleOverride[]
}

export type UpdateParkingSpotInput = Omit<UpdateParkingSpotRequest, 'timeRules' | 'timeRuleOverrides'> & {
  timeRules?: TimeRule[]
  timeRuleOverrides?: TimeRuleOverride[]
}

@Injectable()
export class ParkingSpotRepository extends BaseRepository {
  constructor(
    private timeRuleRepository: TimeRuleRepository,
    private timeRuleOverrideRepository: TimeRuleOverrideRepository
  ) {
    super()
  }

  public create(payload: CreateParkingSpotInput): Promise<ParkingSpot> {
    const { location, timeRules, timeRuleOverrides, ...rest } = payload
    return this.runWithTransaction(async () => {
      const { id: parkingSpotId } = await this.db()
        .insertInto('ParkingSpot')
        .values({
          ...rest,
          location: QueryUtils.pointToSql(location),
          timeZone: TimeZoneLookup.getTimeZoneForPoint(location),
          ...QueryUtils.updatedAt(),
        })
        .returning(['id'])
        .executeTakeFirstOrThrow()
      if (timeRules.length > 0) {
        await this.timeRuleRepository.create(parkingSpotId, timeRules)
      }
      if (timeRuleOverrides.length > 0) {
        await this.timeRuleOverrideRepository.create(parkingSpotId, timeRuleOverrides)
      }
      const parkingSpot = await this.getById(parkingSpotId)
      return required(parkingSpot)
    })
  }

  public async getById(id: string): Promise<ParkingSpot | undefined> {
    const parkingSpotDao = await this.db()
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
    const parkingSpotDaos = await this.db()
      .selectFrom('ParkingSpot')
      .select((eb) => this.buildFields(eb))
      .orderBy(sql`"location" <-> ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`, 'asc')
      .limit(limit)
      .execute()
    return parkingSpotDaos.map((dao) => this.parkingSpotToDomain(dao))
  }

  public update(id: string, update: UpdateParkingSpotInput): Promise<ParkingSpot> {
    const { location, timeRules, timeRuleOverrides, ...rest } = update
    return this.runWithTransaction(async () => {
      if (timeRules) {
        await this.timeRuleRepository.deleteByParkingSpotId(id)
        if (timeRules.length > 0) {
          await this.timeRuleRepository.create(id, timeRules)
        }
      }
      if (timeRuleOverrides) {
        await this.timeRuleOverrideRepository.deleteByParkingSpotId(id)
        if (timeRuleOverrides.length > 0) {
          await this.timeRuleOverrideRepository.create(id, timeRuleOverrides)
        }
      }
      const parkingSpotDao = await this.db()
        .updateTable('ParkingSpot')
        .set({
          ...rest,
          ...(location && { location: QueryUtils.pointToSql(location) }),
          ...(location && { timeZone: TimeZoneLookup.getTimeZoneForPoint(location) }),
          ...QueryUtils.updatedAt(),
        })
        .where('id', '=', id)
        .returning((eb) => this.buildFields(eb))
        .executeTakeFirstOrThrow()
      return this.parkingSpotToDomain(parkingSpotDao)
    })
  }

  public async delete(id: string): Promise<void> {
    await this.db().deleteFrom('ParkingSpot').where('id', '=', id).execute()
  }

  private buildFields(eb: ExpressionBuilder<DB, 'ParkingSpot'>) {
    const timeRulesFields = [
      'id',
      'ownerUserId',
      QueryUtils.pointFieldToGeoJson('location').as('location'),
      jsonArrayFrom(
        eb
          .selectFrom('TimeRule')
          .select(['TimeRule.day', 'TimeRule.startTime', 'TimeRule.endTime'])
          .whereRef('TimeRule.parkingSpotId', '=', 'ParkingSpot.id')
          // TODO: maybe better ordering? Like day of week ascending, then start time, then end time, then id as a tie breaker?
          .orderBy(['TimeRule.createdAt', 'TimeRule.id'])
      ).as('timeRules'),
      jsonArrayFrom(
        eb
          .selectFrom('TimeRuleOverride')
          .select(['TimeRuleOverride.isAvailable', 'TimeRuleOverride.startsAt', 'TimeRuleOverride.endsAt'])
          .whereRef('TimeRuleOverride.parkingSpotId', '=', 'ParkingSpot.id')
          .orderBy(['TimeRuleOverride.startsAt', 'TimeRuleOverride.endsAt', 'TimeRuleOverride.id'])
      ).as('timeRuleOverrides'),
      'timeZone',
    ] as const
    return timeRulesFields
  }

  private parkingSpotToDomain(parkingSpotDao: ParkingSpotDao): ParkingSpot {
    const { id, ownerUserId, location, timeRules, timeRuleOverrides, timeZone } = parkingSpotDao
    const locationGeoJson = JSON.parse(location) as GeoJsonPoint
    return {
      id,
      ownerUserId,
      location: geoJsonToPoint(locationGeoJson),
      timeRules: timeRules.map((timeRule) => this.timeRuleRepository.timeRuleToDomain(timeRule)),
      timeRuleOverrides: timeRuleOverrides.map((timeRuleOverride) => {
        // Seems like when we select them out using jsonArrayFrom, the timestamps are strings, not Date objects
        const { startsAt, endsAt, ...rest } = timeRuleOverride
        const startsAtDate = isString(startsAt) ? new Date(startsAt) : startsAt
        const endsAtDate = isString(endsAt) ? new Date(endsAt) : endsAt
        return this.timeRuleOverrideRepository.timeRuleOverrideToDomain({
          startsAt: startsAtDate,
          endsAt: endsAtDate,
          ...rest,
        })
      }),
      timeZone,
    }
  }
}
