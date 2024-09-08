import { Temporal } from '@js-temporal/polyfill'
import { Injectable } from '@nestjs/common'
import { QueryUtils } from '@parker/kysely-utils'
import { Insertable, Selectable } from 'kysely'
import { BaseRepository } from '../../db/BaseRepository'
import { TimeRule as TimeRuleGeneratedDao } from '../../db/generated/db'
import { DayOfWeek } from '../time/DayOfWeek'
import { TimeRule, timeRuleToDto } from '../timeRule'

export type TimeRuleDao = Pick<Selectable<TimeRuleGeneratedDao>, 'day' | 'startTime' | 'endTime'>

@Injectable()
export class TimeRuleRepository extends BaseRepository {
  public async create(parkingSpotId: string, timeRules: TimeRule[]): Promise<TimeRule[]> {
    const createdTimeRules = await this.db()
      .insertInto('TimeRule')
      .values(timeRules.map((timeRule) => this.timeRuleToInsertableDao(timeRule, parkingSpotId)))
      .returningAll()
      .execute()
    return createdTimeRules.map((timeRule) => this.timeRuleToDomain(timeRule))
  }

  public async deleteByParkingSpotId(parkingSpotId: string): Promise<void> {
    await this.db().deleteFrom('TimeRule').where('parkingSpotId', '=', parkingSpotId).execute()
  }

  public timeRuleToDomain(timeRuleDao: TimeRuleDao): TimeRule {
    return {
      day: timeRuleDao.day as DayOfWeek,
      startTime: Temporal.PlainTime.from(timeRuleDao.startTime),
      endTime: Temporal.PlainTime.from(timeRuleDao.endTime),
    }
  }

  private timeRuleToInsertableDao(timeRule: TimeRule, parkingSpotId: string): Insertable<TimeRuleGeneratedDao> {
    return {
      ...timeRuleToDto(timeRule),
      ...QueryUtils.updatedAt(),
      parkingSpotId,
    }
  }
}
