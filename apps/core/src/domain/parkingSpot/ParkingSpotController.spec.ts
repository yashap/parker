import { NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
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
  let spot: ParkingSpotDto

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      controllers: [ParkingSpotController],
      providers: [ParkingSpotRepository, UserRepository],
    }).compile()
    userRepository = app.get(UserRepository)
    parkingSpotController = app.get(ParkingSpotController)
    user = await userRepository.create({ fullName: 'The Tick' })
    spot = await parkingSpotController.create({ ownerUserId: user.id })
  })

  describe('findById', () => {
    it('should find a parking spot by id', async () => {
      expect(await parkingSpotController.findById(spot.id)).toStrictEqual(spot)
    })

    it('should throw a not found error if the id is not found', async () => {
      expect(parkingSpotController.findById(uuid())).rejects.toBeInstanceOf(NotFoundException)
    })
  })
})
