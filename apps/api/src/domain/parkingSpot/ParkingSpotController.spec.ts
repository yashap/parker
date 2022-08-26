import { Test } from '@nestjs/testing'
import { ParkingSpotController } from './ParkingSpotController'
import { ParkingSpotDto } from './ParkingSpotDto'
import { ParkingSpotRepository } from './ParkingSpotRepository'

describe(ParkingSpotController.name, () => {
  let parkingSpotController: ParkingSpotController
  let spot1: ParkingSpotDto

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      controllers: [ParkingSpotController],
      providers: [ParkingSpotRepository],
    }).compile()
    parkingSpotController = app.get(ParkingSpotController)
    spot1 = await parkingSpotController.create({ name: 'test spot 1' })
  })

  describe('findOne', () => {
    it('should find a parking spot by id', async () => {
      expect(await parkingSpotController.findOne(spot1.id)).toStrictEqual(spot1)
    })
  })
})
