import { Point } from '@parker/geography'
import { orderBy } from 'lodash'
import { v4 as uuid } from 'uuid'
import { ParkingSpot } from './ParkingSpot'
import { CreateParkingSpotInput, ParkingSpotRepository } from './ParkingSpotRepository'

describe(ParkingSpotRepository.name, () => {
  let parkingSpotRepository: ParkingSpotRepository
  let spot: ParkingSpot
  let userId: string

  beforeEach(async () => {
    parkingSpotRepository = new ParkingSpotRepository()
    userId = uuid()
    const createParkingSpotInput: CreateParkingSpotInput = {
      ownerUserId: userId,
      location: { longitude: 10, latitude: 20 },
      timeRules: [],
    }
    spot = await parkingSpotRepository.create(createParkingSpotInput)
    expect(spot).toStrictEqual({
      id: spot.id,
      ...createParkingSpotInput,
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
        location: { longitude: -50, latitude: 50 },
      })
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
