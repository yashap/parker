import { Injectable } from '@nestjs/common'
import { buildPaginationQuery } from '@parker/drizzle-utils'
import { required } from '@parker/errors'
import { Point } from '@parker/geography'
import { ListParkingSpotsRequest } from '@parker/parking-client'
import { and, asc, eq, sql } from 'drizzle-orm'
import { isEmpty, omit } from 'lodash'
import { Db } from 'src/db/Db'
import { parkingSpotTable, timeRuleOverrideTable, timeRuleTable } from 'src/db/schema'
import { ParkingSpotDao, ParkingSpotInputDao, TimeRuleDao, TimeRuleOverrideDao } from 'src/db/types'
import { ListParkingSpotPagination, ParkingSpot } from 'src/domain/parkingSpot/ParkingSpot'
import { TimeZoneLookup } from 'src/domain/time/TimeZoneLookup'
import { TimeRule } from 'src/domain/timeRule'
import { TimeRuleOverride } from 'src/domain/timeRuleOverride'

export type CreateParkingSpotInput = Omit<ParkingSpotInputDao, 'timeZone'> & {
  timeRules: TimeRule[]
  timeRuleOverrides: TimeRuleOverride[]
}

export type UpdateParkingSpotInput = Partial<Omit<CreateParkingSpotInput, 'ownerUserId'>>

export type ListParkingSpotFilters = Pick<ListParkingSpotsRequest, 'ownerUserId'>

@Injectable()
export class ParkingSpotRepository {
  constructor(private readonly db: Db) {}

  public async create(payload: CreateParkingSpotInput): Promise<ParkingSpot> {
    const { timeRules: timeRulesInput, timeRuleOverrides: timeRuleOverridesInput, ...parkingSpotInput } = payload
    return this.db.runWithTransaction(async () => {
      const result = await this.db
        .db()
        .insert(parkingSpotTable)
        .values({
          ...parkingSpotInput,
          timeZone: TimeZoneLookup.getTimeZoneForPoint(parkingSpotInput.location),
        })
        .returning()
      const parkingSpotId = required(result[0]).id
      if (timeRulesInput.length > 0) {
        await this.db
          .db()
          .insert(timeRuleTable)
          .values(timeRulesInput.map((timeRule) => ({ ...timeRule, parkingSpotId })))
      }
      if (timeRuleOverridesInput.length > 0) {
        await this.db
          .db()
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

  public async getById(id: string): Promise<ParkingSpot | undefined> {
    const parkingSpot = await this.db.db().query.parkingSpotTable.findFirst({
      where: eq(parkingSpotTable.id, id),
      with: {
        timeRules: true,
        timeRuleOverrides: true,
      },
    })
    return parkingSpot ? this.toDomain(parkingSpot) : undefined
  }

  public async list(
    { ownerUserId }: ListParkingSpotFilters,
    pagination?: ListParkingSpotPagination
  ): Promise<ParkingSpot[]> {
    if (pagination?.limit === 0) {
      return []
    }
    const { where, orderBy, limit } = buildPaginationQuery(parkingSpotTable, pagination)
    const parkingSpots = await this.db.db().query.parkingSpotTable.findMany({
      where: and(ownerUserId ? eq(parkingSpotTable.ownerUserId, ownerUserId) : undefined, where),
      orderBy,
      limit,
      with: {
        timeRules: true,
        timeRuleOverrides: true,
      },
    })
    return parkingSpots.map((parkingSpot) => this.toDomain(parkingSpot))
  }

  public async listParkingSpotsClosestToLocation(location: Point, limit: number): Promise<ParkingSpot[]> {
    if (limit === 0) {
      return []
    }
    const { longitude, latitude } = location
    const parkingSpots = await this.db.db().query.parkingSpotTable.findMany({
      where: undefined,
      orderBy: asc(sql`${parkingSpotTable.location} <-> ST_SetSRID(ST_MakePoint(${longitude}, ${latitude}), 4326)`),
      limit,
      with: {
        timeRules: true,
        timeRuleOverrides: true,
      },
    })
    return parkingSpots.map((parkingSpot) => this.toDomain(parkingSpot))
  }

  public update(id: string, update: UpdateParkingSpotInput): Promise<ParkingSpot> {
    const { timeRules, timeRuleOverrides, ...parkingSpotUpdate } = update
    return this.db.runWithTransaction(async () => {
      if (timeRules) {
        await this.db.db().delete(timeRuleTable).where(eq(timeRuleTable.parkingSpotId, id))
        if (timeRules.length > 0) {
          await this.db
            .db()
            .insert(timeRuleTable)
            .values(timeRules.map((timeRule) => ({ ...timeRule, parkingSpotId: id })))
        }
      }
      if (timeRuleOverrides) {
        await this.db.db().delete(timeRuleOverrideTable).where(eq(timeRuleOverrideTable.parkingSpotId, id))
        if (timeRuleOverrides.length > 0) {
          await this.db
            .db()
            .insert(timeRuleOverrideTable)
            .values(timeRuleOverrides.map((timeRuleOverride) => ({ ...timeRuleOverride, parkingSpotId: id })))
        }
      }
      if (!isEmpty(parkingSpotUpdate)) {
        await this.db
          .db()
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
    await this.db.db().delete(parkingSpotTable).where(eq(parkingSpotTable.id, id))
  }

  private toDomain(
    parkingSpot: ParkingSpotDao & {
      timeRules: TimeRuleDao[]
      timeRuleOverrides: TimeRuleOverrideDao[]
    }
  ): ParkingSpot {
    return {
      ...parkingSpot,
      timeRules: parkingSpot.timeRules.map((timeRule) =>
        omit(timeRule, ['id', 'createdAt', 'updatedAt', 'parkingSpotId'])
      ),
      timeRuleOverrides: parkingSpot.timeRuleOverrides.map((timeRuleOverride) =>
        omit(timeRuleOverride, ['id', 'createdAt', 'updatedAt', 'parkingSpotId'])
      ),
    }
  }
}
