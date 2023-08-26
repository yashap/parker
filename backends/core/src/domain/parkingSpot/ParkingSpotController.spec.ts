import { INestApplication } from '@nestjs/common'
import { SupertestInstance } from '@parker/api-client-test-utils'
import { CoreClient, ParkingSpotDto, UserDto } from '@parker/core-client'
import { Point } from '@parker/geography'
import { orderBy } from 'lodash'
import { v4 as uuid } from 'uuid'
import { buildTestApp } from '../../test/buildTestApp'
import { TestDbTeardown } from '../../test/TestDbTeardown'
import { ParkingSpotController } from './ParkingSpotController'

describe(ParkingSpotController.name, () => {
  let app: INestApplication
  let coreClient: CoreClient
  let user: UserDto
  let parkingSpot: ParkingSpotDto

  beforeEach(async () => {
    app = await buildTestApp()
    coreClient = new CoreClient(new SupertestInstance(app.getHttpServer()))

    // Setup test user
    const userPostBody = { email: 'donald.duck@example.com', fullName: 'Donald Duck' }
    user = await coreClient.users.create(userPostBody)
    const { id: userId, ...otherUserData } = user
    expect(userId).toBeDefined()
    expect(otherUserData).toStrictEqual(userPostBody)

    // Setup test parking spot
    const parkingSpotPostBody = { ownerUserId: user.id, location: { longitude: 10, latitude: 20 } }
    parkingSpot = await coreClient.parkingSpots.create(parkingSpotPostBody)
    const { id: parkingSpotId, ...otherParkingSpotData } = parkingSpot
    expect(parkingSpotId).toBeDefined()
    expect(otherParkingSpotData).toStrictEqual(parkingSpotPostBody)
  })

  describe('getById', () => {
    it('should get a parking spot by id', async () => {
      const maybeParkingSpot = await coreClient.parkingSpots.get(parkingSpot.id)
      expect(maybeParkingSpot).toStrictEqual(parkingSpot)
    })

    it('should verify that a parking spot does not exist', async () => {
      const maybeParkingSpot = await coreClient.parkingSpots.get(uuid())
      expect(maybeParkingSpot).toBeUndefined()
    })
  })

  describe('update', () => {
    it('should update a parking spot', async () => {
      const update = { location: { longitude: 2, latitude: 3 } }
      const maybeParkingSpot = await coreClient.parkingSpots.update(parkingSpot.id, update)
      expect(maybeParkingSpot).toStrictEqual({ ...parkingSpot, ...update })
    })
  })

  describe('delete', () => {
    it('should delete a parking spot', async () => {
      let maybeParkingSpot = await coreClient.parkingSpots.get(parkingSpot.id)
      expect(maybeParkingSpot).toBeDefined()
      await coreClient.parkingSpots.delete(parkingSpot.id)
      maybeParkingSpot = await coreClient.parkingSpots.get(parkingSpot.id)
      expect(maybeParkingSpot).toBeUndefined()
    })
  })

  describe('listClosestToPoint', () => {
    it('should list the parking spots closest to a given point', async () => {
      // We prefer to setup this test from scratch
      await new TestDbTeardown().clearTable('ParkingSpot')

      // Create 20 spots
      const ints: number[] = Array.from({ length: 20 }, (_, idx) => idx)
      const allSpots: ParkingSpotDto[] = await Promise.all(
        ints.map((i) =>
          coreClient.parkingSpots.create({ ownerUserId: user.id, location: { longitude: i, latitude: i } })
        )
      )
      // But we're only going to get the 5 closest to a given point
      const location: Point = { longitude: 10, latitude: 10 }
      const fiveClosestSpots = allSpots.filter((spot) => [8, 9, 10, 11, 12].includes(spot.location.longitude))
      expect(fiveClosestSpots).toHaveLength(5) // Make sure we didn't screw up the test setup
      // Then get those 5 spots, verify they're the 5 closest
      const foundSpots = (
        await coreClient.parkingSpots.listClosestToPoint({
          longitude: location.longitude,
          latitude: location.latitude,
          limit: 5,
        })
      ).data
      expect(orderBy(foundSpots, (spot) => spot.location.longitude)).toStrictEqual(fiveClosestSpots)
    })
  })
})
