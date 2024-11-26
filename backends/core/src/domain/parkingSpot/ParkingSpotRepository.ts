import { Injectable } from '@nestjs/common'
import { OrderDirectionValues } from '@parker/api-client-utils'
import { ListParkingSpotsRequest } from '@parker/core-client'
import { required } from '@parker/errors'
import { Point } from '@parker/geography'
import { and, asc, desc, eq, gt, inArray, lt, or, sql } from 'drizzle-orm'
import { PgColumn } from 'drizzle-orm/pg-core'
import { groupBy, isEmpty, isString, omit } from 'lodash'
import { BaseRepository } from '../../db/BaseRepository'
import { Db } from '../../db/Db'
import { parkingSpotTable, timeRuleOverrideTable, timeRuleTable } from '../../db/schema'
import { ParkingSpotDao, ParkingSpotInputDao } from '../../db/types'
import { TimeZoneLookup } from '../time/TimeZoneLookup'
import { TimeRule } from '../timeRule'
import { TimeRuleOverride } from '../timeRuleOverride'
import { ListParkingSpotCursor, ListParkingSpotPagination, ParkingSpot } from './ParkingSpot'

export type CreateParkingSpotInput = Omit<ParkingSpotInputDao, 'timeZone'> & {
  timeRules: TimeRule[]
  timeRuleOverrides: TimeRuleOverride[]
}

export type UpdateParkingSpotInput = Partial<Omit<CreateParkingSpotInput, 'ownerUserId'>>

export type ListParkingSpotFilters = Pick<ListParkingSpotsRequest, 'ownerUserId'>

@Injectable()
export class ParkingSpotRepository extends BaseRepository {
  public async create(payload: CreateParkingSpotInput): Promise<ParkingSpot> {
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
          .values(
            timeRuleOverridesInput.map((timeRuleOverride) => ({
              ...timeRuleOverride,
              parkingSpotId,
            }))
          )
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
    return this.enrichSpot(parkingSpot)
  }

  // TODO: once I get Drizzle query mode working, switch to it here
  public async list(
    { ownerUserId }: ListParkingSpotFilters,
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
    return this.enrichSpots(parkingSpots)
  }

  public async listParkingSpotsClosestToLocation(location: Point, limit: number): Promise<ParkingSpot[]> {
    if (limit === 0) {
      return []
    }

    const { longitude, latitude } = location
    const parkingSpots = await Db.db()
      .select()
      .from(parkingSpotTable)
      .orderBy(asc(sql`${parkingSpotTable.location} <-> ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`))
      .limit(limit)
    return this.enrichSpots(parkingSpots)
  }

  public update(id: string, update: UpdateParkingSpotInput): Promise<ParkingSpot> {
    const { timeRules, timeRuleOverrides, ...parkingSpotUpdate } = update
    return Db.runWithTransaction(async () => {
      if (timeRules) {
        await Db.db().delete(timeRuleTable).where(eq(timeRuleTable.parkingSpotId, id))
        if (timeRules.length > 0) {
          await Db.db()
            .insert(timeRuleTable)
            .values(timeRules.map((timeRule) => ({ ...timeRule, parkingSpotId: id })))
        }
      }
      if (timeRuleOverrides) {
        await Db.db().delete(timeRuleOverrideTable).where(eq(timeRuleOverrideTable.parkingSpotId, id))
        if (timeRuleOverrides.length > 0) {
          await Db.db()
            .insert(timeRuleOverrideTable)
            .values(timeRuleOverrides.map((timeRuleOverride) => ({ ...timeRuleOverride, parkingSpotId: id })))
        }
      }
      if (!isEmpty(parkingSpotUpdate)) {
        await Db.db()
        .update(parkingSpotTable)
        .set({
          ...parkingSpotUpdate,
          ...(parkingSpotUpdate.location && {
            timeZone: TimeZoneLookup.getTimeZoneForPoint(parkingSpotUpdate.location),
          }),
        })
        .where(eq(parkingSpotTable.id, id))
      }
      return required(await this.getById(id))
    })
  }

  public async delete(id: string): Promise<void> {
    await Db.db().delete(parkingSpotTable).where(eq(parkingSpotTable.id, id))
  }

  private async enrichSpots(parkingSpots: ParkingSpotDao[]): Promise<ParkingSpot[]> {
    if (parkingSpots.length === 0) {
      return []
    }
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

  private async enrichSpot(parkingSpot: ParkingSpotDao): Promise<ParkingSpot> {
    const enriched = await this.enrichSpots([parkingSpot])
    return required(enriched[0])
  }
}
