import { ParkingSpot } from './ParkingSpot'
import { ParkingSpotRepository } from './ParkingSpotRepository'

describe(ParkingSpotRepository.name, () => {
  let parkingSpotRepository: ParkingSpotRepository
  let spot1: ParkingSpot
  let spot2: ParkingSpot

  beforeAll(async () => {
    parkingSpotRepository = new ParkingSpotRepository()
    spot1 = await parkingSpotRepository.create({ landlordId: 'TODO have to create a landlord first' })
    spot2 = await parkingSpotRepository.create({ landlordId: 'TODO have to create a landlord first' })
  })

  describe('findById', () => {
    it('should find a parking spot by id', async () => {
      expect(await parkingSpotRepository.findById(spot1.id)).toStrictEqual(spot1)
    })
  })

  describe('findAll', () => {
    it('should all parking spots', async () => {
      expect(await parkingSpotRepository.findAll()).toEqual([spot1, spot2])
    })
  })

  // TODO: update tests, once there are fields to update

  describe('delete', () => {
    it('should delete a parking spot', async () => {
      await parkingSpotRepository.delete(spot1.id)
      expect(await parkingSpotRepository.findById(spot1.id)).toBeUndefined()
    })
  })
})
