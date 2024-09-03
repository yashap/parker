import { Temporal } from '@js-temporal/polyfill'
import { Point } from '@parker/geography'
import { orderBy } from 'lodash'
import { v4 as uuid } from 'uuid'
import { DayOfWeek } from '../time/DayOfWeek'
import { ParkingSpot } from './ParkingSpot'
import { CreateParkingSpotInput, ParkingSpotRepository } from './ParkingSpotRepository'

describe(ParkingSpotRepository.name, () => {
  let parkingSpotRepository: ParkingSpotRepository
  let createParkingSpotInput: CreateParkingSpotInput
  let spot: ParkingSpot
  let userId: string

  beforeEach(async () => {
    parkingSpotRepository = new ParkingSpotRepository()
    userId = uuid()
    createParkingSpotInput = {
      ownerUserId: userId,
      location: { longitude: 10, latitude: 20 },
      timeRules: [],
    }
    spot = await parkingSpotRepository.create(createParkingSpotInput)
    expect(spot).toStrictEqual({
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
          parkingSpotRepository.create({ ownerUserId: userId, location: { longitude: i, latitude: i }, timeRules: [] })
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
      expect(await parkingSpotRepository.getById(spot.id)).toEqual({
        ...spot,
        timeZone: 'Etc/GMT+3',
        location: { longitude: -50, latitude: 50 },
      })
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
  })

  describe('delete', () => {
    it('should delete a parking spot', async () => {
      expect(await parkingSpotRepository.getById(spot.id)).toBeDefined()
      await parkingSpotRepository.delete(spot.id)
      expect(await parkingSpotRepository.getById(spot.id)).toBeUndefined()
    })
  })
})
