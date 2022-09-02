import { User } from '../user/User'
import { UserRepository } from '../user/UserRepository'
import { ParkingSpot } from './ParkingSpot'
import { ParkingSpotRepository } from './ParkingSpotRepository'

describe(ParkingSpotRepository.name, () => {
  let userRepository: UserRepository
  let parkingSpotRepository: ParkingSpotRepository
  let user: User
  let spot: ParkingSpot

  beforeEach(async () => {
    parkingSpotRepository = new ParkingSpotRepository()
    userRepository = new UserRepository()
    user = await userRepository.create({ fullName: 'The Tick' })
    spot = await parkingSpotRepository.create({ ownerUserId: user.id })
  })

  describe('findById', () => {
    it('should find a parking spot by id', async () => {
      expect(await parkingSpotRepository.findById(spot.id)).toStrictEqual(spot)
    })
  })

  // TODO: update tests, once there are fields to update

  describe('delete', () => {
    it('should delete a parking spot', async () => {
      await parkingSpotRepository.delete(spot.id)
      expect(await parkingSpotRepository.findById(spot.id)).toBeUndefined()
    })
  })
})
