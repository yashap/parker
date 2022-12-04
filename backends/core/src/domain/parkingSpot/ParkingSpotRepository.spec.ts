import { Point } from '@parker/geography'
import { orderBy } from 'lodash'
import { v4 as uuid } from 'uuid'
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
    user = await userRepository.create({ email: 'the.tick@example.com', fullName: 'The Tick' })
    spot = await parkingSpotRepository.create({ ownerUserId: user.id, location: { longitude: 10, latitude: 20 } })
  })

  describe('getById', () => {
    it('should get a parking spot by id', async () => {
      expect(await parkingSpotRepository.getById(spot.id)).toStrictEqual(spot)
    })

    it('should return undefined if the parking spot does not exist', async () => {
      expect(await parkingSpotRepository.getById(uuid())).toBeUndefined()
    })
  })

  describe('getByIds', () => {
    it('should get parking spots by ids', async () => {
      const spot2 = await parkingSpotRepository.create({
        ownerUserId: user.id,
        location: { longitude: 11, latitude: 21 },
      })
      const spot3 = await parkingSpotRepository.create({
        ownerUserId: user.id,
        location: { longitude: 12, latitude: 22 },
      })
      expect(await parkingSpotRepository.getByIds([spot.id, spot2.id, spot3.id])).toStrictEqual([spot, spot2, spot3])
    })

    it('should work with a single parking spot id', async () => {
      expect(await parkingSpotRepository.getByIds([spot.id])).toStrictEqual([spot])
    })

    it('should work with no parking spot ids', async () => {
      expect(await parkingSpotRepository.getByIds([])).toStrictEqual([])
    })

    it('should not throw if an id does not exist', async () => {
      expect(await parkingSpotRepository.getByIds([spot.id, uuid()])).toStrictEqual([spot])
    })
  })

  describe('listParkingSpotsClosestToLocation', () => {
    it('should list the parking spots closest to a given location', async () => {
      // Create 20 spots
      const ints: number[] = Array.from({ length: 20 }, (_, idx) => idx)
      const allSpots: ParkingSpot[] = await Promise.all(
        ints.map((i) => parkingSpotRepository.create({ ownerUserId: user.id, location: { longitude: i, latitude: i } }))
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
      await parkingSpotRepository.update(spot.id, { location: { longitude: -100, latitude: 100 } })
      expect(await parkingSpotRepository.getById(spot.id)).toEqual(
        spot.set('location', { longitude: -100, latitude: 100 })
      )
    })
  })

  describe('delete', () => {
    it('should delete a parking spot', async () => {
      await parkingSpotRepository.delete(spot.id)
      expect(await parkingSpotRepository.getById(spot.id)).toBeUndefined()
    })
  })
})
