import { Temporal } from '@js-temporal/polyfill'
import { Injectable } from '@nestjs/common'
import { OrderDirectionValues } from '@parker/api-client-utils'
import { CreateParkingSpotRequest, ListParkingSpotsRequest, UpdateParkingSpotRequest } from '@parker/core-client'
import { required } from '@parker/errors'
import { GeoJsonPoint, Point, geoJsonToPoint } from '@parker/geography'
import { QueryUtils } from '@parker/kysely-utils'
import { eq } from 'drizzle-orm'
import { ExpressionBuilder, Selectable, sql } from 'kysely'
import { jsonArrayFrom } from 'kysely/helpers/postgres'
import { isString, omit } from 'lodash'
import { BaseRepository } from '../../db/BaseRepository'
import { Db } from '../../db/Db'
import { DB, ParkingSpot as ParkingSpotGeneratedDao } from '../../db/generated/db'
import { parkingSpots, timeRuleOverrides, timeRules } from '../../db/schema'
import { TimeZoneLookup } from '../time/TimeZoneLookup'
import { TimeRule, TimeRuleDao as LegacyTimeRuleDao, TimeRuleRepository } from '../timeRule'
import {
  TimeRuleOverride,
  TimeRuleOverrideDao as LegacyTimeRuleOverrideDao,
  TimeRuleOverrideRepository,
} from '../timeRuleOverride'
import { ListParkingSpotCursor, ListParkingSpotPagination, ParkingSpot } from './ParkingSpot'

type LegacyParkingSpotDao = Selectable<ParkingSpotGeneratedDao> & {
  timeRules: LegacyTimeRuleDao[]
  timeRuleOverrides: LegacyTimeRuleOverrideDao[]
}

export type LegacyCreateParkingSpotInput = Omit<CreateParkingSpotRequest, 'timeRules' | 'timeRuleOverrides'> & {
  ownerUserId: string
  timeRules: TimeRule[]
  timeRuleOverrides: TimeRuleOverride[]
}

export type LegacyUpdateParkingSpotInput = Omit<UpdateParkingSpotRequest, 'timeRules' | 'timeRuleOverrides'> & {
  timeRules?: TimeRule[]
  timeRuleOverrides?: TimeRuleOverride[]
}

export type LegacyListParkingSpotFilters = Pick<ListParkingSpotsRequest, 'ownerUserId'>

@Injectable()
export class ParkingSpotRepository extends BaseRepository {
  constructor(
    private timeRuleRepository: TimeRuleRepository,
    private timeRuleOverrideRepository: TimeRuleOverrideRepository
  ) {
    super()
  }

  public async create(payload: LegacyCreateParkingSpotInput): Promise<ParkingSpot> {
    const { location, timeRules, timeRuleOverrides, ...rest } = payload
    const parkingSpotId = await this.legacyWithTransaction(async () => {
      const { id: parkingSpotId } = await this.legacyDb()
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
      return parkingSpotId
    })
    const parkingSpot = await this.getById(parkingSpotId)
    return required(parkingSpot)
  }

  public async getById(id: string): Promise<ParkingSpot | undefined> {
    const parkingSpotList = await Db.db().select().from(parkingSpots).where(eq(parkingSpots.id, id))
    const parkingSpot = parkingSpotList[0]
    if (!parkingSpot) {
      return undefined
    }
    const timeRuleList = await Db.db().select().from(timeRules).where(eq(timeRules.parkingSpotId, parkingSpot.id))
    const timeRuleOverrideList = await Db.db()
      .select()
      .from(timeRuleOverrides)
      .where(eq(timeRuleOverrides.parkingSpotId, parkingSpot.id))
    return {
      ...parkingSpot,
      timeRules: timeRuleList.map((timeRule) => omit(timeRule, ['id', 'createdAt', 'updatedAt', 'parkingSpotId'])),
      timeRuleOverrides: timeRuleOverrideList.map((timeRuleOverride) =>
        omit(timeRuleOverride, ['id', 'createdAt', 'updatedAt', 'parkingSpotId'])
      ),
    }
  }

  public async list(
    { ownerUserId }: LegacyListParkingSpotFilters,
    pagination?: ListParkingSpotPagination
  ): Promise<ParkingSpot[]> {
    if (pagination?.limit === 0) {
      return []
    }

    let query = this.legacyDb()
      .selectFrom('ParkingSpot')
      .select((eb) => this.buildFields(eb))

    if (ownerUserId) {
      query = query.where('ownerUserId', '=', ownerUserId)
    }

    if (pagination) {
      query = query.orderBy(pagination.orderBy, pagination.orderDirection).limit(pagination.limit)
    }

    const cursor = pagination as ListParkingSpotCursor
    if (cursor.lastOrderValueSeen) {
      const inequality = cursor.orderDirection === OrderDirectionValues.desc ? '<' : '>'
      query = query.where((eb) =>
        eb.or([
          // TODO: is this even correct?
          // Should I be dealing with createdAt as not a number, but a Temporal.PlainTime?
          eb('createdAt', inequality, new Date(cursor.lastOrderValueSeen)),
          eb.and([eb('createdAt', '=', new Date(cursor.lastOrderValueSeen)), eb('id', inequality, cursor.lastIdSeen)]),
        ])
      )
    }

    const parkingSpotDaos = await query.execute()
    return parkingSpotDaos.map((dao) => this.parkingSpotToDomain(dao))
  }

  public async listParkingSpotsClosestToLocation(location: Point, limit: number): Promise<ParkingSpot[]> {
    if (limit === 0) {
      return []
    }
    const { longitude, latitude } = location
    const parkingSpotDaos = await this.legacyDb()
      .selectFrom('ParkingSpot')
      .select((eb) => this.buildFields(eb))
      .orderBy(sql`"location" <-> ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`, 'asc')
      .limit(limit)
      .execute()
    return parkingSpotDaos.map((dao) => this.parkingSpotToDomain(dao))
  }

  public update(id: string, update: LegacyUpdateParkingSpotInput): Promise<ParkingSpot> {
    const { location, timeRules, timeRuleOverrides, ...rest } = update
    return this.legacyWithTransaction(async () => {
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
      const parkingSpotDao = await this.legacyDb()
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
    await this.legacyDb().deleteFrom('ParkingSpot').where('id', '=', id).execute()
  }

  private buildFields(eb: ExpressionBuilder<DB, 'ParkingSpot'>) {
    const timeRulesFields = [
      'id',
      'createdAt',
      'updatedAt',
      'ownerUserId',
      'address',
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

  private parkingSpotToDomain(parkingSpotDao: LegacyParkingSpotDao): ParkingSpot {
    const { id, createdAt, updatedAt, ownerUserId, address, location, timeRules, timeRuleOverrides, timeZone } =
      parkingSpotDao
    const locationGeoJson = JSON.parse(location) as GeoJsonPoint
    return {
      id,
      createdAt: Temporal.Instant.fromEpochMilliseconds(createdAt.valueOf()),
      updatedAt: Temporal.Instant.fromEpochMilliseconds(updatedAt.valueOf()),
      ownerUserId,
      address,
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
