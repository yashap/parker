import { Controller } from '@nestjs/common'
import { contract } from '@parker/core-client'
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest'
import { BaseController } from '../../http/BaseController'
import { ParkingSpotRepository } from './ParkingSpotRepository'

@Controller()
export class ParkingSpotController extends BaseController {
  constructor(private readonly parkingSpotRepository: ParkingSpotRepository) {
    super('ParkingSpot')
  }

  @TsRestHandler(contract.parkingSpots.listClosestToPoint)
  public async listClosestToPoint() {
    return tsRestHandler(contract.parkingSpots.listClosestToPoint, async ({ query }) => {
      const { longitude, latitude, limit } = query
      const parkingSpots = await this.parkingSpotRepository.listParkingSpotsClosestToLocation(
        { longitude, latitude },
        limit
      )
      return { status: 200, body: { data: parkingSpots } }
    })
  }

  @TsRestHandler(contract.parkingSpots.post)
  public async create() {
    return tsRestHandler(contract.parkingSpots.post, async ({ body }) => {
      const parkingSpot = await this.parkingSpotRepository.create(body)
      return { status: 201, body: parkingSpot }
    })
  }

  @TsRestHandler(contract.parkingSpots.get)
  public async getById() {
    return tsRestHandler(contract.parkingSpots.get, async ({ params: { id } }) => {
      const maybeParkingSpot = await this.parkingSpotRepository.getById(id)
      return { status: 200, body: this.getEntityOrNotFound(maybeParkingSpot) }
    })
  }

  @TsRestHandler(contract.parkingSpots.patch)
  public async update() {
    return tsRestHandler(contract.parkingSpots.patch, async ({ params: { id }, body }) => {
      const parkingSpot = await this.parkingSpotRepository.update(id, body)
      return { status: 200, body: parkingSpot }
    })
  }

  @TsRestHandler(contract.parkingSpots.delete)
  public async delete() {
    return tsRestHandler(contract.parkingSpots.delete, async ({ params: { id } }) => {
      await this.parkingSpotRepository.delete(id)
      return { status: 204, body: undefined }
    })
  }
}
