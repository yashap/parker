import { Temporal } from '@js-temporal/polyfill'
import { Point } from '@parker/geography'
import { omit, orderBy } from 'lodash'
import { v4 as uuid } from 'uuid'
import { Db } from 'src/db/Db'
import { ParkingSpot } from 'src/domain/parkingSpot/ParkingSpot'
import { CreateParkingSpotInput, ParkingSpotRepository } from 'src/domain/parkingSpot/ParkingSpotRepository'
import { DayOfWeek } from 'src/domain/time/DayOfWeek'
import { expectSystemTimestamps } from 'src/test/expectSystemTimestamp'

describe(ParkingSpotRepository.name, () => {
  let parkingSpotRepository: ParkingSpotRepository
  let createParkingSpotInput: CreateParkingSpotInput
  let spot: ParkingSpot
  let userId: string

  beforeEach(async () => {
    parkingSpotRepository = new ParkingSpotRepository(new Db())
    userId = uuid()
    createParkingSpotInput = {
      ownerUserId: userId,
      address: '90210 Fancy Street',
      location: { longitude: 10, latitude: 20 },
      timeRules: [],
      timeRuleOverrides: [],
    }
    spot = await parkingSpotRepository.create(createParkingSpotInput)
    expectSystemTimestamps(spot)
    expect(omit(spot, ['createdAt', 'updatedAt'])).toStrictEqual({
      id: spot.id,
      timeZone: spot.timeZone,
      ...createParkingSpotInput,
    })
  })

  describe('create', () => {
    it('creates a parking spot with time rules', async () => {
      const spotWithTimeRules = await parkingSpotRepository.create({
        ...createParkingSpotInput,
        timeRules: [
          {
            day: 'Monday',
            startTime: Temporal.PlainTime.from('01:00:00'),
            endTime: Temporal.PlainTime.from('23:00:00'),
          },
          {
            day: 'Tuesday',
            startTime: Temporal.PlainTime.from('13:30:00'),
            endTime: Temporal.PlainTime.from('15:20:00'),
          },
        ],
      })
      expect(spotWithTimeRules.timeRules).toStrictEqual([
        { day: 'Monday', startTime: Temporal.PlainTime.from('01:00:00'), endTime: Temporal.PlainTime.from('23:00:00') },
        {
          day: 'Tuesday',
          startTime: Temporal.PlainTime.from('13:30:00'),
          endTime: Temporal.PlainTime.from('15:20:00'),
        },
      ])
      expect(await parkingSpotRepository.getById(spotWithTimeRules.id)).toStrictEqual(spotWithTimeRules)
    })

    it('rejects time rules with invalid day of week', async () => {
      await expect(
        parkingSpotRepository.create({
          ...createParkingSpotInput,
          timeRules: [
            {
              day: 'Christmas' as DayOfWeek,
              startTime: Temporal.PlainTime.from('01:00:00'),
              endTime: Temporal.PlainTime.from('23:00:00'),
            },
          ],
        })
      ).rejects.toThrow()
    })

    it('creates a parking spot with time rule overrides', async () => {
      const spotWithTimeRules = await parkingSpotRepository.create({
        ...createParkingSpotInput,
        timeRuleOverrides: [
          {
            startsAt: Temporal.Instant.from('2024-09-20T01:10:15-07:00'),
            endsAt: Temporal.Instant.from('2024-09-20T23:30:45-07:00'),
            isAvailable: false,
          },
          {
            startsAt: Temporal.Instant.from('2024-09-27T01:10:15-07:00'),
            endsAt: Temporal.Instant.from('2024-09-27T23:30:45-07:00'),
            isAvailable: true,
          },
        ],
      })
      expect(spotWithTimeRules.timeRuleOverrides).toStrictEqual([
        {
          startsAt: Temporal.Instant.from('2024-09-20T01:10:15-07:00'),
          endsAt: Temporal.Instant.from('2024-09-20T23:30:45-07:00'),
          isAvailable: false,
        },
        {
          startsAt: Temporal.Instant.from('2024-09-27T01:10:15-07:00'),
          endsAt: Temporal.Instant.from('2024-09-27T23:30:45-07:00'),
          isAvailable: true,
        },
      ])
      expect(await parkingSpotRepository.getById(spotWithTimeRules.id)).toStrictEqual(spotWithTimeRules)
    })
  })

  describe('getById', () => {
    it('should get a parking spot by id', async () => {
      expect(await parkingSpotRepository.getById(spot.id)).toStrictEqual(spot)
    })

    it('should return undefined if the parking spot does not exist', async () => {
      expect(await parkingSpotRepository.getById(uuid())).toBeUndefined()
    })
  })

  describe('listParkingSpotsClosestToLocation', () => {
    it('should list the parking spots closest to a given location', async () => {
      // Create 20 spots
      const ints: number[] = Array.from({ length: 20 }, (_, idx) => idx)
      const allSpots: ParkingSpot[] = await Promise.all(
        ints.map((i) =>
          parkingSpotRepository.create({
            ownerUserId: userId,
            address: '90210 Fancy Street',
            location: { longitude: i, latitude: i },
            timeRules: [],
            timeRuleOverrides: [],
          })
        )
      )

      // But we're only going to get the 5 closest to a given point
      const location: Point = { longitude: 10, latitude: 10 }
      const fiveClosestSpots = allSpots.filter((spot) => [8, 9, 10, 11, 12].includes(spot.location.longitude))
      expect(fiveClosestSpots).toHaveLength(5) // Make sure we didn't screw up the test setup

      // Then get those 5 spots, verify they're the 5 closest
      const foundSpots = await parkingSpotRepository.listParkingSpotsClosestToLocation(location, 5)
      expect(orderBy(foundSpots, (spot) => spot.location.longitude)).toStrictEqual(fiveClosestSpots)
    })
  })

  describe('update', () => {
    it('should update a parking spot', async () => {
      await parkingSpotRepository.update(spot.id, { location: { longitude: -50, latitude: 50 } })
      const actualAfterUpdate = await parkingSpotRepository.getById(spot.id)
      const expectedAfterUpdate = {
        ...spot,
        timeZone: 'Etc/GMT+3',
        location: { longitude: -50, latitude: 50 },
      }
      expect(omit(actualAfterUpdate, ['updatedAt'])).toEqual(omit(expectedAfterUpdate, ['updatedAt']))
    })

    it('completely replaces time rules, if updating the time rules', async () => {
      let spotWithTimeRules = await parkingSpotRepository.create({
        ...createParkingSpotInput,
        timeRules: [
          {
            day: 'Monday',
            startTime: Temporal.PlainTime.from('01:00:00'),
            endTime: Temporal.PlainTime.from('23:00:00'),
          },
          {
            day: 'Tuesday',
            startTime: Temporal.PlainTime.from('13:30:00'),
            endTime: Temporal.PlainTime.from('15:20:00'),
          },
        ],
      })
      expect(spotWithTimeRules.timeRules).toStrictEqual([
        { day: 'Monday', startTime: Temporal.PlainTime.from('01:00:00'), endTime: Temporal.PlainTime.from('23:00:00') },
        {
          day: 'Tuesday',
          startTime: Temporal.PlainTime.from('13:30:00'),
          endTime: Temporal.PlainTime.from('15:20:00'),
        },
      ])
      expect(await parkingSpotRepository.getById(spotWithTimeRules.id)).toStrictEqual(spotWithTimeRules)

      spotWithTimeRules = await parkingSpotRepository.update(spotWithTimeRules.id, {
        timeRules: [
          {
            day: 'Wednesday',
            startTime: Temporal.PlainTime.from('03:30:00'),
            endTime: Temporal.PlainTime.from('16:45:00'),
          },
        ],
      })
      expect(spotWithTimeRules.timeRules).toStrictEqual([
        {
          day: 'Wednesday',
          startTime: Temporal.PlainTime.from('03:30:00'),
          endTime: Temporal.PlainTime.from('16:45:00'),
        },
      ])
      expect(await parkingSpotRepository.getById(spotWithTimeRules.id)).toStrictEqual(spotWithTimeRules)
    })

    it('does not touch the time rules, if not updating the time rules', async () => {
      let spotWithTimeRules = await parkingSpotRepository.create({
        ...createParkingSpotInput,
        timeRules: [
          {
            day: 'Monday',
            startTime: Temporal.PlainTime.from('01:00:00'),
            endTime: Temporal.PlainTime.from('23:00:00'),
          },
          {
            day: 'Tuesday',
            startTime: Temporal.PlainTime.from('13:30:00'),
            endTime: Temporal.PlainTime.from('15:20:00'),
          },
        ],
      })
      expect(spotWithTimeRules.timeRules).toStrictEqual([
        { day: 'Monday', startTime: Temporal.PlainTime.from('01:00:00'), endTime: Temporal.PlainTime.from('23:00:00') },
        {
          day: 'Tuesday',
          startTime: Temporal.PlainTime.from('13:30:00'),
          endTime: Temporal.PlainTime.from('15:20:00'),
        },
      ])
      expect(spotWithTimeRules.location).toStrictEqual({ longitude: 10, latitude: 20 })
      expect(await parkingSpotRepository.getById(spotWithTimeRules.id)).toStrictEqual(spotWithTimeRules)

      spotWithTimeRules = await parkingSpotRepository.update(spotWithTimeRules.id, {
        location: { longitude: -50, latitude: 50 },
      })
      expect(spotWithTimeRules.timeRules).toStrictEqual([
        { day: 'Monday', startTime: Temporal.PlainTime.from('01:00:00'), endTime: Temporal.PlainTime.from('23:00:00') },
        {
          day: 'Tuesday',
          startTime: Temporal.PlainTime.from('13:30:00'),
          endTime: Temporal.PlainTime.from('15:20:00'),
        },
      ])
      expect(spotWithTimeRules.location).toStrictEqual({ longitude: -50, latitude: 50 })
      expect(await parkingSpotRepository.getById(spotWithTimeRules.id)).toStrictEqual(spotWithTimeRules)
    })

    it('completely replaces time rule overrides, if updating the time rule overrides', async () => {
      let spotWithTimeRuleOverrides = await parkingSpotRepository.create({
        ...createParkingSpotInput,
        timeRuleOverrides: [
          {
            startsAt: Temporal.Instant.from('2024-09-20T01:10:15-07:00'),
            endsAt: Temporal.Instant.from('2024-09-20T23:30:45-07:00'),
            isAvailable: false,
          },
          {
            startsAt: Temporal.Instant.from('2024-09-27T01:10:15-07:00'),
            endsAt: Temporal.Instant.from('2024-09-27T23:30:45-07:00'),
            isAvailable: true,
          },
        ],
      })
      expect(spotWithTimeRuleOverrides.timeRuleOverrides).toStrictEqual([
        {
          startsAt: Temporal.Instant.from('2024-09-20T01:10:15-07:00'),
          endsAt: Temporal.Instant.from('2024-09-20T23:30:45-07:00'),
          isAvailable: false,
        },
        {
          startsAt: Temporal.Instant.from('2024-09-27T01:10:15-07:00'),
          endsAt: Temporal.Instant.from('2024-09-27T23:30:45-07:00'),
          isAvailable: true,
        },
      ])
      expect(await parkingSpotRepository.getById(spotWithTimeRuleOverrides.id)).toStrictEqual(spotWithTimeRuleOverrides)

      spotWithTimeRuleOverrides = await parkingSpotRepository.update(spotWithTimeRuleOverrides.id, {
        timeRuleOverrides: [
          {
            startsAt: Temporal.Instant.from('2024-09-25T01:10:15-07:00'),
            endsAt: Temporal.Instant.from('2024-09-25T23:30:45-07:00'),
            isAvailable: true,
          },
        ],
      })
      expect(spotWithTimeRuleOverrides.timeRuleOverrides).toStrictEqual([
        {
          startsAt: Temporal.Instant.from('2024-09-25T01:10:15-07:00'),
          endsAt: Temporal.Instant.from('2024-09-25T23:30:45-07:00'),
          isAvailable: true,
        },
      ])
      expect(await parkingSpotRepository.getById(spotWithTimeRuleOverrides.id)).toStrictEqual(spotWithTimeRuleOverrides)
    })

    it('does not touch the time rule overrides, if not updating the time rule overrides', async () => {
      let spotWithTimeRuleOverrides = await parkingSpotRepository.create({
        ...createParkingSpotInput,
        timeRuleOverrides: [
          {
            startsAt: Temporal.Instant.from('2024-09-20T01:10:15-07:00'),
            endsAt: Temporal.Instant.from('2024-09-20T23:30:45-07:00'),
            isAvailable: false,
          },
          {
            startsAt: Temporal.Instant.from('2024-09-27T01:10:15-07:00'),
            endsAt: Temporal.Instant.from('2024-09-27T23:30:45-07:00'),
            isAvailable: true,
          },
        ],
      })
      expect(spotWithTimeRuleOverrides.timeRuleOverrides).toStrictEqual([
        {
          startsAt: Temporal.Instant.from('2024-09-20T01:10:15-07:00'),
          endsAt: Temporal.Instant.from('2024-09-20T23:30:45-07:00'),
          isAvailable: false,
        },
        {
          startsAt: Temporal.Instant.from('2024-09-27T01:10:15-07:00'),
          endsAt: Temporal.Instant.from('2024-09-27T23:30:45-07:00'),
          isAvailable: true,
        },
      ])
      expect(spotWithTimeRuleOverrides.location).toStrictEqual({ longitude: 10, latitude: 20 })
      expect(await parkingSpotRepository.getById(spotWithTimeRuleOverrides.id)).toStrictEqual(spotWithTimeRuleOverrides)

      spotWithTimeRuleOverrides = await parkingSpotRepository.update(spotWithTimeRuleOverrides.id, {
        location: { longitude: -50, latitude: 50 },
      })
      expect(spotWithTimeRuleOverrides.timeRuleOverrides).toStrictEqual([
        {
          startsAt: Temporal.Instant.from('2024-09-20T01:10:15-07:00'),
          endsAt: Temporal.Instant.from('2024-09-20T23:30:45-07:00'),
          isAvailable: false,
        },
        {
          startsAt: Temporal.Instant.from('2024-09-27T01:10:15-07:00'),
          endsAt: Temporal.Instant.from('2024-09-27T23:30:45-07:00'),
          isAvailable: true,
        },
      ])
      expect(spotWithTimeRuleOverrides.location).toStrictEqual({ longitude: -50, latitude: 50 })
      expect(await parkingSpotRepository.getById(spotWithTimeRuleOverrides.id)).toStrictEqual(spotWithTimeRuleOverrides)
    })
  })

  describe('delete', () => {
    it('should delete a parking spot', async () => {
      expect(await parkingSpotRepository.getById(spot.id)).toBeDefined()
      await parkingSpotRepository.delete(spot.id)
      expect(await parkingSpotRepository.getById(spot.id)).toBeUndefined()
    })
  })
})
