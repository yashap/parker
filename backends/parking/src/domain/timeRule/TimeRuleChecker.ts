import { Temporal } from '@js-temporal/polyfill'
import { fromNumericDayOfWeek } from '@parker/api-client-utils'
import { TimeRule } from 'src/domain/timeRule/TimeRule'

export class TimeRuleChecker {
  public static satisfiesTimeRule(timeRule: TimeRule, timestamp: Temporal.Instant, timezone: string): boolean {
    const zonedDateTime = timestamp.toZonedDateTimeISO(timezone)
    const dayOfWeek = fromNumericDayOfWeek(zonedDateTime.dayOfWeek)
    if (dayOfWeek !== timeRule.day) {
      return false
    }
    const baseZonedDateTime = {
      timeZone: timezone,
      year: zonedDateTime.year,
      month: zonedDateTime.month,
      day: zonedDateTime.day,
    }
    const timeRuleStart: Temporal.Instant = Temporal.ZonedDateTime.from({
      ...baseZonedDateTime,
      hour: timeRule.startTime.hour,
      minute: timeRule.startTime.minute,
      second: timeRule.startTime.second,
      millisecond: timeRule.startTime.millisecond,
      microsecond: timeRule.startTime.microsecond,
      nanosecond: timeRule.startTime.nanosecond,
    }).toInstant()
    const timeRuleEnd: Temporal.Instant = Temporal.ZonedDateTime.from({
      ...baseZonedDateTime,
      hour: timeRule.endTime.hour,
      minute: timeRule.endTime.minute,
      second: timeRule.endTime.second,
      millisecond: timeRule.endTime.millisecond,
      microsecond: timeRule.endTime.microsecond,
      nanosecond: timeRule.endTime.nanosecond,
    }).toInstant()
    return (
      timestamp.epochMilliseconds >= timeRuleStart.epochMilliseconds &&
      timestamp.epochMilliseconds <= timeRuleEnd.epochMilliseconds
    )
  }

  public static satisfiesAnyTimeRule(timeRules: TimeRule[], timestamp: Temporal.Instant, timezone: string): boolean {
    return timeRules.some((timeRule) => this.satisfiesTimeRule(timeRule, timestamp, timezone))
  }
}
