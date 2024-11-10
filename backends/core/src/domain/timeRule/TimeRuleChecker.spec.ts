import { Temporal } from '@js-temporal/polyfill'
import { DayOfWeekValues } from '@parker/api-client-utils'
import { TimeRule } from './TimeRule'
import { TimeRuleChecker } from './TimeRuleChecker'

describe(TimeRuleChecker.name, () => {
  // Wed Aug 28 2024 13:00:00 EDT
  const timestamp = Temporal.Instant.fromEpochSeconds(1724864400)
  const timezone = 'America/Toronto'

  describe(TimeRuleChecker.satisfiesTimeRule.name, () => {
    it('returns true if the timestamp is within the time rule', () => {
      const timeRule: TimeRule = {
        day: DayOfWeekValues.Wednesday,
        startTime: Temporal.PlainTime.from('12:00:00'),
        endTime: Temporal.PlainTime.from('14:00:00'),
      }
      expect(TimeRuleChecker.satisfiesTimeRule(timeRule, timestamp, timezone)).toBe(true)
    })

    it('returns false if the timestamp is before the time rule, on the same day of the week', () => {
      const timeRule: TimeRule = {
        day: DayOfWeekValues.Wednesday,
        startTime: Temporal.PlainTime.from('10:00:00'),
        endTime: Temporal.PlainTime.from('12:00:00'),
      }
      expect(TimeRuleChecker.satisfiesTimeRule(timeRule, timestamp, timezone)).toBe(false)
    })

    it('returns false if the timestamp is after the time rule, on the same day of the week', () => {
      const timeRule: TimeRule = {
        day: DayOfWeekValues.Wednesday,
        startTime: Temporal.PlainTime.from('14:00:00'),
        endTime: Temporal.PlainTime.from('16:00:00'),
      }
      expect(TimeRuleChecker.satisfiesTimeRule(timeRule, timestamp, timezone)).toBe(false)
    })

    it('returns false if the timestamp is on a different day of the week', () => {
      for (const day of [
        DayOfWeekValues.Monday,
        DayOfWeekValues.Tuesday,
        DayOfWeekValues.Thursday,
        DayOfWeekValues.Friday,
        DayOfWeekValues.Saturday,
        DayOfWeekValues.Sunday,
      ]) {
        const timeRule: TimeRule = {
          day,
          startTime: Temporal.PlainTime.from('12:00:00'),
          endTime: Temporal.PlainTime.from('14:00:00'),
        }
        expect(TimeRuleChecker.satisfiesTimeRule(timeRule, timestamp, timezone)).toBe(false)
      }
    })
  })

  describe(TimeRuleChecker.satisfiesAnyTimeRule.name, () => {
    it('returns true if the timestamp is within any of the time rules', () => {
      const timeRules: TimeRule[] = [
        {
          day: DayOfWeekValues.Wednesday,
          startTime: Temporal.PlainTime.from('12:00:00'),
          endTime: Temporal.PlainTime.from('14:00:00'),
        },
        {
          day: DayOfWeekValues.Thursday,
          startTime: Temporal.PlainTime.from('12:00:00'),
          endTime: Temporal.PlainTime.from('14:00:00'),
        },
      ]
      expect(TimeRuleChecker.satisfiesAnyTimeRule(timeRules, timestamp, timezone)).toBe(true)
    })

    it('returns false if the timestamp is not within any of the time rules', () => {
      const timeRules: TimeRule[] = [
        {
          day: DayOfWeekValues.Tuesday,
          startTime: Temporal.PlainTime.from('12:00:00'),
          endTime: Temporal.PlainTime.from('14:00:00'),
        },
        {
          day: DayOfWeekValues.Wednesday,
          startTime: Temporal.PlainTime.from('10:00:00'),
          endTime: Temporal.PlainTime.from('12:59:59'),
        },
        {
          day: DayOfWeekValues.Wednesday,
          startTime: Temporal.PlainTime.from('13:00:01'),
          endTime: Temporal.PlainTime.from('16:00:00'),
        },
        {
          day: DayOfWeekValues.Thursday,
          startTime: Temporal.PlainTime.from('12:00:00'),
          endTime: Temporal.PlainTime.from('14:00:00'),
        },
      ]
      expect(TimeRuleChecker.satisfiesAnyTimeRule(timeRules, timestamp, timezone)).toBe(false)
    })
  })
})
