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
    const createdTimeRules = await this.db()
      .insertInto('TimeRuleOverride')
      .values(
        timeRuleOverrides.map((timeRuleOverride) => this.timeRuleToInsertableDao(timeRuleOverride, parkingSpotId))
      )
      .returningAll()
      .execute()
    return createdTimeRules.map((timeRule) => this.timeRuleOverrideToDomain(timeRule))
  }

  public async deleteByParkingSpotId(parkingSpotId: string): Promise<void> {
    await this.db().deleteFrom('TimeRule').where('parkingSpotId', '=', parkingSpotId).execute()
  }

  public timeRuleOverrideToDomain(timeRuleOverrideDao: TimeRuleOverrideDao): TimeRuleOverride {
    return {
      startsAt: Temporal.Instant.fromEpochMilliseconds(timeRuleOverrideDao.startsAt.valueOf()),
      endsAt: Temporal.Instant.fromEpochMilliseconds(timeRuleOverrideDao.endsAt.valueOf()),
      isAvailable: timeRuleOverrideDao.isAvailable,
    }
  }

  private timeRuleToInsertableDao(
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
