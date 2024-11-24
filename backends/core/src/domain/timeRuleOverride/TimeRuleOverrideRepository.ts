import { Temporal } from '@js-temporal/polyfill'
import { Injectable } from '@nestjs/common'
import { QueryUtils } from '@parker/kysely-utils'
import { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../../db/BaseRepository'
import { TimeRuleOverride as TimeRuleOverrideGeneratedDao } from '../../db/generated/db'
import { TimeRuleOverride, timeRuleOverrideToDto } from './TimeRuleOverride'

export type TimeRuleOverrideDao = Pick<Selectable<TimeRuleOverrideGeneratedDao>, 'startsAt' | 'endsAt' | 'isAvailable'>

@Injectable()
export class TimeRuleOverrideRepository extends BaseRepository {
  public async create(parkingSpotId: string, timeRuleOverrides: TimeRuleOverride[]): Promise<TimeRuleOverride[]> {
    const createdTimeRuleOverrides = await this.legacyDb()
      .insertInto('TimeRuleOverride')
      .values(
        timeRuleOverrides.map((timeRuleOverride) =>
          this.timeRuleOverrideToInsertableDao(timeRuleOverride, parkingSpotId)
        )
      )
      .returningAll()
      .execute()
    return createdTimeRuleOverrides.map((timeRule) => this.timeRuleOverrideToDomain(timeRule))
  }

  public async deleteByParkingSpotId(parkingSpotId: string): Promise<void> {
    await this.legacyDb().deleteFrom('TimeRuleOverride').where('parkingSpotId', '=', parkingSpotId).execute()
  }

  public timeRuleOverrideToDomain(timeRuleOverrideDao: TimeRuleOverrideDao): TimeRuleOverride {
    return {
      startsAt: Temporal.Instant.fromEpochMilliseconds(timeRuleOverrideDao.startsAt.valueOf()),
      endsAt: Temporal.Instant.fromEpochMilliseconds(timeRuleOverrideDao.endsAt.valueOf()),
      isAvailable: timeRuleOverrideDao.isAvailable,
    }
  }

  private timeRuleOverrideToInsertableDao(
    timeRuleOverride: TimeRuleOverride,
    parkingSpotId: string
  ): Insertable<TimeRuleOverrideGeneratedDao> {
    return {
      ...timeRuleOverrideToDto(timeRuleOverride),
      ...QueryUtils.updatedAt(),
      parkingSpotId,
    }
  }
}
