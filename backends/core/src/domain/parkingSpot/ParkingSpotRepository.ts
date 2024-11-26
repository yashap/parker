import { Temporal } from '@js-temporal/polyfill'
import { Injectable } from '@nestjs/common'
import { OrderDirectionValues } from '@parker/api-client-utils'
import { CreateParkingSpotRequest, ListParkingSpotsRequest, UpdateParkingSpotRequest } from '@parker/core-client'
import { required } from '@parker/errors'
import { GeoJsonPoint, Point, geoJsonToPoint } from '@parker/geography'
import { QueryUtils } from '@parker/kysely-utils'
import { and, asc, desc, eq, gt, inArray, lt, or, sql } from 'drizzle-orm'
import { PgColumn } from 'drizzle-orm/pg-core'
import { ExpressionBuilder, Selectable, sql as kyselySql } from 'kysely'
import { jsonArrayFrom } from 'kysely/helpers/postgres'
import { groupBy, isString, omit } from 'lodash'
import { BaseRepository } from '../../db/BaseRepository'
import { Db } from '../../db/Db'
import { DB, ParkingSpot as ParkingSpotGeneratedDao } from '../../db/generated/db'
import { parkingSpotTable, timeRuleOverrideTable, timeRuleTable } from '../../db/schema'
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
    const { timeRules: timeRulesInput, timeRuleOverrides: timeRuleOverridesInput, ...parkingSpotInput } = payload
    return Db.runWithTransaction(async () => {
      const result = await Db.db()
        .insert(parkingSpotTable)
        .values({
          ...parkingSpotInput,
          timeZone: TimeZoneLookup.getTimeZoneForPoint(parkingSpotInput.location),
        })
        .returning()
      const parkingSpotId = required(result[0]).id
      if (timeRulesInput.length > 0) {
        await Db.db()
          .insert(timeRuleTable)
          .values(timeRulesInput.map((timeRule) => ({ ...timeRule, parkingSpotId })))
      }
      if (timeRuleOverridesInput.length > 0) {
        await Db.db()
          .insert(timeRuleOverrideTable)
          .values(timeRuleOverridesInput.map((timeRuleOverride) => ({ ...timeRuleOverride, parkingSpotId })))
      }
      return required(await this.getById(parkingSpotId))
    })
  }

  // TODO: once I get Drizzle query mode working, switch to it here
  public async getById(id: string): Promise<ParkingSpot | undefined> {
    const parkingSpots = await Db.db().select().from(parkingSpotTable).where(eq(parkingSpotTable.id, id))
    const parkingSpot = parkingSpots[0]
    if (!parkingSpot) {
      return undefined
    }
    const timeRules = await Db.db().select().from(timeRuleTable).where(eq(timeRuleTable.parkingSpotId, parkingSpot.id))
    const timeRuleOverrides = await Db.db()
      .select()
      .from(timeRuleOverrideTable)
      .where(eq(timeRuleOverrideTable.parkingSpotId, parkingSpot.id))
    return {
      ...parkingSpot,
      timeRules: timeRules.map((timeRule) => omit(timeRule, ['id', 'createdAt', 'updatedAt', 'parkingSpotId'])),
      timeRuleOverrides: timeRuleOverrides.map((timeRuleOverride) =>
        omit(timeRuleOverride, ['id', 'createdAt', 'updatedAt', 'parkingSpotId'])
      ),
    }
  }

  // TODO: once I get Drizzle query mode working, switch to it here
  public async list(
    { ownerUserId }: LegacyListParkingSpotFilters,
    pagination?: ListParkingSpotPagination
  ): Promise<ParkingSpot[]> {
    if (pagination?.limit === 0) {
      return []
    }

    let query = Db.db().select().from(parkingSpotTable).$dynamic()

    if (ownerUserId) {
      query = query.where(eq(parkingSpotTable.ownerUserId, ownerUserId))
    }

    // TODO-lib-cursor: extract this "cursor to Drizzle" stuff into a lib
    if (pagination) {
      const direction = pagination.orderDirection === OrderDirectionValues.asc ? asc : desc
      const cursor = pagination as Partial<ListParkingSpotCursor>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const field = required(
        (parkingSpotTable as unknown as Record<string, PgColumn>)[
          cursor.orderBy ?? (pagination.orderBy as string | undefined) ?? 'createdAt'
        ]
      )
      query = query.orderBy(direction(field)).limit(pagination.limit)

      if (cursor.lastOrderValueSeen && cursor.lastIdSeen) {
        const inequality = cursor.orderDirection === OrderDirectionValues.desc ? lt : gt
        const lastSeenIsString = isString(cursor.lastOrderValueSeen)
        // TODO-lib-cursor: maybe it'd be better to pass a function that, depending on the field, converts the value to the correct type?
        // e.g. "parseCursor" could take a function like this?
        const lastSeenSql = lastSeenIsString
          ? sql.raw(`'${cursor.lastOrderValueSeen}'`)
          : sql.raw(cursor.lastOrderValueSeen)
        query = query.where(
          or(
            and(eq(field, lastSeenSql), inequality(parkingSpotTable.id, cursor.lastIdSeen)),
            inequality(field, lastSeenSql)
          )
        )
      }
    }

    const parkingSpots = await query.execute()
    const parkingSpotIds = parkingSpots.map((parkingSpot) => parkingSpot.id)
    const timeRules = await Db.db()
      .select()
      .from(timeRuleTable)
      .where(inArray(timeRuleTable.parkingSpotId, parkingSpotIds))
    const timeRulesByParkingSpotId = groupBy(timeRules, 'parkingSpotId')
    const timeRuleOverrides = await Db.db()
      .select()
      .from(timeRuleOverrideTable)
      .where(inArray(timeRuleOverrideTable.parkingSpotId, parkingSpotIds))
    const timeRuleOverridesByParkingSpotId = groupBy(timeRuleOverrides, 'parkingSpotId')
    return parkingSpots.map((parkingSpot) => ({
      ...parkingSpot,
      timeRules:
        timeRulesByParkingSpotId[parkingSpot.id]?.map((timeRule) =>
          omit(timeRule, ['id', 'createdAt', 'updatedAt', 'parkingSpotId'])
        ) ?? [],
      timeRuleOverrides:
        timeRuleOverridesByParkingSpotId[parkingSpot.id]?.map((timeRuleOverride) =>
          omit(timeRuleOverride, ['id', 'createdAt', 'updatedAt', 'parkingSpotId'])
        ) ?? [],
    }))
  }

  public async listParkingSpotsClosestToLocation(location: Point, limit: number): Promise<ParkingSpot[]> {
    if (limit === 0) {
      return []
    }
    const { longitude, latitude } = location
    const parkingSpotDaos = await this.legacyDb()
      .selectFrom('ParkingSpot')
      .select((eb) => this.buildFields(eb))
      .orderBy(kyselySql`"location" <-> ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`, 'asc')
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
