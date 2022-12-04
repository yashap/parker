import { Test } from '@nestjs/testing'
import { NotFoundError } from '@parker/errors'
import { Point } from '@parker/geography'
import { orderBy } from 'lodash'
import { v4 as uuid } from 'uuid'
import { User } from '../user/User'
import { UserRepository } from '../user/UserRepository'
import { ParkingSpotController } from './ParkingSpotController'
import { ParkingSpotDto } from './ParkingSpotDto'
import { ParkingSpotRepository } from './ParkingSpotRepository'

describe(ParkingSpotController.name, () => {
  let userRepository: UserRepository
  let parkingSpotController: ParkingSpotController
  let user: User

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      controllers: [ParkingSpotController],
      providers: [ParkingSpotRepository, UserRepository],
    }).compile()
    userRepository = app.get(UserRepository)
    parkingSpotController = app.get(ParkingSpotController)
    user = await userRepository.create({ fullName: 'The Tick' })
  })

  describe('getById', () => {
    it('should get a parking spot by id', async () => {
      const spot = await parkingSpotController.create({
        ownerUserId: user.id,
        location: { longitude: 10, latitude: 20 },
      })
      expect(await parkingSpotController.getById(spot.id)).toStrictEqual(spot)
    })

    it('should throw a not found error if the id is not found', async () => {
      expect(parkingSpotController.getById(uuid())).rejects.toBeInstanceOf(NotFoundError)
    })
  })

  describe('listClosestToPoint', () => {
    it('should list the parking spots closest to a given point', async () => {
      // Create 20 spots
      const ints: number[] = Array.from({ length: 20 }, (_, idx) => idx)
      const allSpots: ParkingSpotDto[] = await Promise.all(
        ints.map((i) => parkingSpotController.create({ ownerUserId: user.id, location: { longitude: i, latitude: i } }))
      )

      // But we're only going to get the 5 closest to a given point
      const location: Point = { longitude: 10, latitude: 10 }
      const fiveClosestSpots = allSpots.filter((spot) => [8, 9, 10, 11, 12].includes(spot.location.longitude))
      expect(fiveClosestSpots).toHaveLength(5) // Make sure we didn't screw up the test setup

      // Then get those 5 spots, verify they're the 5 closest
      const foundSpots = (await parkingSpotController.listClosestToPoint(location.longitude, location.latitude, 5)).data
      expect(orderBy(foundSpots, (spot) => spot.location.longitude)).toStrictEqual(fiveClosestSpots)
    })
  })
})
