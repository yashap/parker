import { INestApplication } from '@nestjs/common'
import { SupertestInstance } from '@parker/api-client-test-utils'
import { CoreClient, CreateParkingSpotRequest, ParkingSpotDto, UpdateParkingSpotRequest } from '@parker/core-client'
import { NotFoundError } from '@parker/errors'
import { Point } from '@parker/geography'
import { omit, orderBy } from 'lodash'
import { v4 as uuid } from 'uuid'
import { AuthGuard } from '../../auth'
import { buildTestApp } from '../../test/buildTestApp'
import { expectSystemTimestampStrings } from '../../test/expectSystemTimestamp'
import { TestDbTeardown } from '../../test/TestDbTeardown'
import { ParkingSpotController } from './ParkingSpotController'

describe(ParkingSpotController.name, () => {
  let app: INestApplication
  let landlordUserId: string
  let renterUserId: string
  let landlordCoreClient: CoreClient
  let renterCoreClient: CoreClient
  let parkingSpot: ParkingSpotDto

  beforeEach(async () => {
    landlordUserId = uuid()
    renterUserId = uuid()

    app = await buildTestApp()
    landlordCoreClient = new CoreClient(
      new SupertestInstance(app.getHttpServer(), AuthGuard.buildTestAuthHeaders(landlordUserId))
    )
    renterCoreClient = new CoreClient(
      new SupertestInstance(app.getHttpServer(), AuthGuard.buildTestAuthHeaders(renterUserId))
    )

    // Setup test parking spot
    const parkingSpotPostBody: CreateParkingSpotRequest = {
      location: { longitude: 10, latitude: 20 },
      timeRules: [],
      timeRuleOverrides: [],
    }
    parkingSpot = await landlordCoreClient.parkingSpots.create(parkingSpotPostBody)
    const { id: parkingSpotId, ownerUserId, timeZone, createdAt, updatedAt, ...otherParkingSpotData } = parkingSpot
    expect(parkingSpotId).toBeDefined()
    expect(ownerUserId).toBe(landlordUserId)
    expect(timeZone).toBe('Africa/Lagos')
    expectSystemTimestampStrings({ createdAt, updatedAt })
    expect(otherParkingSpotData).toStrictEqual(parkingSpotPostBody)
  })

  describe('getById', () => {
    it('landlord should be able to get own parking spot by id', async () => {
      expect(await landlordCoreClient.parkingSpots.get(parkingSpot.id)).toStrictEqual(parkingSpot)
    })

    it('renter should be able to get parking spot by id', async () => {
      expect(await renterCoreClient.parkingSpots.get(parkingSpot.id)).toStrictEqual(parkingSpot)
    })

    it('should verify that a parking spot does not exist', async () => {
      expect(await landlordCoreClient.parkingSpots.get(uuid())).toBeUndefined()
    })

    it('should work for a parking spot with time rules and time rule overrides', async () => {
      const input: CreateParkingSpotRequest = {
        location: { longitude: 10, latitude: 20 },
        timeRules: [
          {
            day: 'Monday',
            startTime: '01:00:00',
            endTime: '23:00:00',
          },
          {
            day: 'Tuesday',
            startTime: '13:30:00',
            endTime: '15:20:00',
          },
        ],
        timeRuleOverrides: [
          {
            startsAt: '2024-09-20T01:10:15Z',
            endsAt: '2024-09-20T23:30:45Z',
            isAvailable: false,
          },
          {
            startsAt: '2024-09-27T01:10:15Z',
            endsAt: '2024-09-27T23:30:45Z',
            isAvailable: true,
          },
        ],
      }
      parkingSpot = await landlordCoreClient.parkingSpots.create(input)
      expect(await landlordCoreClient.parkingSpots.get(parkingSpot.id)).toStrictEqual(parkingSpot)
      expect(parkingSpot.timeRules).toStrictEqual(input.timeRules)
      expect(parkingSpot.timeRuleOverrides).toStrictEqual(input.timeRuleOverrides)
    })
  })

  describe('update', () => {
    it('landlord should be able to update a parking spot', async () => {
      const update: UpdateParkingSpotRequest = { location: { longitude: 2, latitude: 3 } }
      expect(omit(await landlordCoreClient.parkingSpots.update(parkingSpot.id, update), ['updatedAt'])).toStrictEqual({
        ...omit(parkingSpot, ['updatedAt']),
        ...update,
        timeZone: 'Etc/GMT',
      })
    })

    it('renter should not be able to update a parking spot', async () => {
      const update: UpdateParkingSpotRequest = { location: { longitude: 2, latitude: 3 } }
      await expect(renterCoreClient.parkingSpots.update(parkingSpot.id, update)).rejects.toThrow(NotFoundError)

      // And assert it wasn't modified
      expect(await renterCoreClient.parkingSpots.get(parkingSpot.id)).toStrictEqual(parkingSpot)
    })

    it('should be able to replace time rules and time rule overrides', async () => {
      const update1: UpdateParkingSpotRequest = {
        timeRules: [
          {
            day: 'Saturday',
            startTime: '03:00:00',
            endTime: '22:00:00',
          },
        ],
        timeRuleOverrides: [
          {
            startsAt: '2023-09-20T01:10:15Z',
            endsAt: '2023-09-20T23:30:45Z',
            isAvailable: false,
          },
        ],
      }
      const parkingSpotWithUpdate1 = await landlordCoreClient.parkingSpots.update(parkingSpot.id, update1)
      expect(omit(parkingSpotWithUpdate1, ['updatedAt'])).toStrictEqual({
        ...omit(parkingSpot, ['updatedAt']),
        ...update1,
      })
      expect(await landlordCoreClient.parkingSpots.get(parkingSpot.id)).toStrictEqual(parkingSpotWithUpdate1)

      const update2: UpdateParkingSpotRequest = {
        timeRules: [
          {
            day: 'Monday',
            startTime: '01:00:00',
            endTime: '23:00:00',
          },
          {
            day: 'Tuesday',
            startTime: '13:30:00',
            endTime: '15:20:00',
          },
        ],
        timeRuleOverrides: [
          {
            startsAt: '2024-09-20T01:10:15Z',
            endsAt: '2024-09-20T23:30:45Z',
            isAvailable: false,
          },
          {
            startsAt: '2024-09-27T01:10:15Z',
            endsAt: '2024-09-27T23:30:45Z',
            isAvailable: true,
          },
        ],
      }
      const parkingSpotWithUpdate2 = await landlordCoreClient.parkingSpots.update(parkingSpot.id, update2)
      expect(omit(parkingSpotWithUpdate2, ['updatedAt'])).toStrictEqual({
        ...omit(parkingSpot, ['updatedAt']),
        ...update2,
      })
      expect(await landlordCoreClient.parkingSpots.get(parkingSpot.id)).toStrictEqual(parkingSpotWithUpdate2)
    })
  })

  describe('delete', () => {
    it('landlord should be able to delete a parking spot', async () => {
      expect(await landlordCoreClient.parkingSpots.get(parkingSpot.id)).toBeDefined()
      await landlordCoreClient.parkingSpots.delete(parkingSpot.id)

      // And assert it's deleted
      expect(await landlordCoreClient.parkingSpots.get(parkingSpot.id)).toBeUndefined()
    })

    it('renter should not be able to delete a parking spot', async () => {
      expect(await renterCoreClient.parkingSpots.get(parkingSpot.id)).toBeDefined()
      await expect(renterCoreClient.parkingSpots.delete(parkingSpot.id)).rejects.toThrow(NotFoundError)

      // And assert it's not deleted
      expect(await renterCoreClient.parkingSpots.get(parkingSpot.id)).toBeDefined()
    })
  })

  describe('listClosestToPoint', () => {
    it('landlord should be able to list the parking spots closest to a given point', async () => {
      // We prefer to setup this test from scratch
      await new TestDbTeardown().clearTable('ParkingSpot')

      // Create 20 spots
      const allSpots: ParkingSpotDto[] = []
      for (let idx = 0; idx < 20; idx++) {
        allSpots.push(
          await landlordCoreClient.parkingSpots.create({
            location: { longitude: idx, latitude: idx },
            timeRules: [],
            timeRuleOverrides: [],
          })
        )
      }

      // But we're only going to get the 5 closest to a given point
      const location: Point = { longitude: 10, latitude: 10 }
      const fiveClosestSpots = allSpots.filter((spot) => [8, 9, 10, 11, 12].includes(spot.location.longitude))
      expect(fiveClosestSpots).toHaveLength(5) // Make sure we didn't screw up the test setup

      // Then get those 5 spots, verify they're the 5 closest
      const { data: foundSpots } = await landlordCoreClient.parkingSpots.listClosestToPoint({
        longitude: location.longitude,
        latitude: location.latitude,
        limit: 5,
      })
      expect(orderBy(foundSpots, (spot) => spot.location.longitude)).toStrictEqual(fiveClosestSpots)
    })

    it('renter should be able to list the parking spots closest to a given point', async () => {
      // We prefer to setup this test from scratch
      await new TestDbTeardown().clearTable('ParkingSpot')

      // Create 20 spots
      const allSpots: ParkingSpotDto[] = []
      for (let idx = 0; idx < 20; idx++) {
        allSpots.push(
          await landlordCoreClient.parkingSpots.create({
            location: { longitude: idx, latitude: idx },
            timeRules: [],
            timeRuleOverrides: [],
          })
        )
      }

      // But we're only going to get the 5 closest to a given point
      const location: Point = { longitude: 10, latitude: 10 }
      const fiveClosestSpots = allSpots.filter((spot) => [8, 9, 10, 11, 12].includes(spot.location.longitude))
      expect(fiveClosestSpots).toHaveLength(5) // Make sure we didn't screw up the test setup

      // Then get those 5 spots, verify they're the 5 closest
      const { data: foundSpots } = await renterCoreClient.parkingSpots.listClosestToPoint({
        longitude: location.longitude,
        latitude: location.latitude,
        limit: 5,
      })
      expect(orderBy(foundSpots, (spot) => spot.location.longitude)).toStrictEqual(fiveClosestSpots)
    })
  })
})
