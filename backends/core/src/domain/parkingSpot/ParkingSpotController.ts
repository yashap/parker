import { Controller } from '@nestjs/common'
import { contract } from '@parker/core-client'
import { BaseController, Endpoint, HandlerResult, handler } from '@parker/nest-utils'
import { ParkingSpotRepository } from './ParkingSpotRepository'

@Controller()
export class ParkingSpotController extends BaseController {
  constructor(private readonly parkingSpotRepository: ParkingSpotRepository) {
    super('ParkingSpot')
  }

  @Endpoint(contract.parkingSpots.listClosestToPoint)
  public listClosestToPoint(): HandlerResult {
    return handler(contract.parkingSpots.listClosestToPoint, async ({ query }) => {
      const { longitude, latitude, limit } = query
      const parkingSpots = await this.parkingSpotRepository.listParkingSpotsClosestToLocation(
        { longitude, latitude },
        limit
      )
      return { status: 200, body: { data: parkingSpots } }
    })
  }

  @Endpoint(contract.parkingSpots.post)
  public create(): HandlerResult {
    return handler(contract.parkingSpots.post, async ({ body }) => {
      const parkingSpot = await this.parkingSpotRepository.create(body)
      return { status: 201, body: parkingSpot }
    })
  }

  @Endpoint(contract.parkingSpots.get)
  public getById(): HandlerResult {
    return handler(contract.parkingSpots.get, async ({ params: { id } }) => {
      const maybeParkingSpot = await this.parkingSpotRepository.getById(id)
      return { status: 200, body: this.getEntityOrNotFound(maybeParkingSpot) }
    })
  }

  @Endpoint(contract.parkingSpots.patch)
  public update(): HandlerResult {
    return handler(contract.parkingSpots.patch, async ({ params: { id }, body }) => {
      const parkingSpot = await this.parkingSpotRepository.update(id, body)
      return { status: 200, body: parkingSpot }
    })
  }

  @Endpoint(contract.parkingSpots.delete)
  public delete(): HandlerResult {
    return handler(contract.parkingSpots.delete, async ({ params: { id } }) => {
      await this.parkingSpotRepository.delete(id)
      return { status: 204, body: undefined }
    })
  }
}
