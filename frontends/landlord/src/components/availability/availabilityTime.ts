import { Temporal } from '@js-temporal/polyfill'

/**
 * Helpers for the "Configure Availability" screen.
 *
 * Two distinct time concepts live here:
 *  - Weekly time rules use a wall-clock time-of-day string (`HH:MM:SS`), matching the backend `TimeSchema`.
 *  - Overrides use absolute instants (ISO strings), interpreted in the parking spot's own IANA `timeZone`.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
// Temporal `dayOfWeek` is 1 (Monday) through 7 (Sunday)
const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

// --- Time-of-day helpers (weekly time rules) ---

/** `HH:MM:SS` -> `HH:MM` for display. */
export const formatTimeOfDay = (time: string): string => time.substring(0, 5)

/** Build a `HH:MM:SS` string from picker output. */
export const timeOfDayFromHoursMinutes = (hours: number, minutes: number): string => {
  const hh = String(hours).padStart(2, '0')
  const mm = String(minutes).padStart(2, '0')
  return `${hh}:${mm}:00`
}

/** `HH:MM:SS` -> `{ hours, minutes }` for seeding a TimePickerModal. */
export const timeOfDayToHoursMinutes = (time: string): { hours: number; minutes: number } => {
  const plainTime = Temporal.PlainTime.from(time)
  return { hours: plainTime.hour, minutes: plainTime.minute }
}

/**
 * Whether `endTime` is strictly after `startTime` (both `HH:MM:SS`).
 * The backend evaluates time rules within a single calendar day (see `TimeRuleChecker`), so overnight
 * windows (end <= start) are not supported and must be rejected here.
 */
export const isTimeOfDayEndAfterStart = (startTime: string, endTime: string): boolean =>
  Temporal.PlainTime.compare(Temporal.PlainTime.from(startTime), Temporal.PlainTime.from(endTime)) < 0

// --- Instant / timezone helpers (overrides) ---

/** Format an ISO instant in the spot's timezone, e.g. "Mon, Jul 28, 2:00 PM". */
export const formatInstantInZone = (iso: string, timeZone: string): string => {
  const zoned = Temporal.Instant.from(iso).toZonedDateTimeISO(timeZone)
  const weekday = WEEKDAYS[zoned.dayOfWeek - 1]
  const month = MONTHS[zoned.month - 1]
  const meridiem = zoned.hour >= 12 ? 'PM' : 'AM'
  const hour12 = zoned.hour % 12 === 0 ? 12 : zoned.hour % 12
  const minute = String(zoned.minute).padStart(2, '0')
  return `${weekday}, ${month} ${zoned.day}, ${hour12}:${minute} ${meridiem}`
}

/** Format a local `Date`'s calendar day, e.g. "Jul 28, 2026". */
export const formatWallClockDate = (date: Date): string =>
  `${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`

/** Format a 24-hour clock time, e.g. "14:00". */
export const formatClockTime = (hours: number, minutes: number): string =>
  `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`

export interface WallClockParts {
  /** Local `Date` at midnight of the intended calendar day, for seeding a DatePickerModal. */
  date: Date
  hours: number
  minutes: number
}

/** Split an ISO instant into wall-clock parts in the spot's timezone, for seeding the editor's pickers. */
export const instantToWallClockParts = (iso: string, timeZone: string): WallClockParts => {
  const zoned = Temporal.Instant.from(iso).toZonedDateTimeISO(timeZone)
  return {
    date: new Date(zoned.year, zoned.month - 1, zoned.day),
    hours: zoned.hour,
    minutes: zoned.minute,
  }
}

/**
 * Combine a picked calendar day (`date`, read via its local components) and a picked time into an absolute
 * instant, interpreting the wall-clock value in the spot's timezone.
 */
export const wallClockToInstant = (parts: WallClockParts, timeZone: string): string => {
  const zoned = Temporal.ZonedDateTime.from({
    timeZone,
    year: parts.date.getFullYear(),
    month: parts.date.getMonth() + 1,
    day: parts.date.getDate(),
    hour: parts.hours,
    minute: parts.minutes,
    second: 0,
  })
  return zoned.toInstant().toString()
}

/** The current instant as an ISO string. */
export const nowInstant = (): string => Temporal.Now.instant().toString()

/** `iso` shifted forward by `hours`, as an ISO string. */
export const instantPlusHours = (iso: string, hours: number): string =>
  Temporal.Instant.from(iso).add({ hours }).toString()

/** Whether `laterIso` is strictly after `earlierIso`. */
export const isInstantAfter = (laterIso: string, earlierIso: string): boolean =>
  Temporal.Instant.compare(Temporal.Instant.from(laterIso), Temporal.Instant.from(earlierIso)) > 0
