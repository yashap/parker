import { Controller } from '@nestjs/common'
import { contract as rootContract } from '@parker/core-client'
import { BaseController, Endpoint, HandlerResult, handler } from '@parker/nest-utils'
import { ParkingSpotRepository } from './ParkingSpotRepository'

const contract = rootContract.parkingSpots

@Controller()
export class ParkingSpotController extends BaseController {
  constructor(private readonly parkingSpotRepository: ParkingSpotRepository) {
    super('ParkingSpot')
  }

  @Endpoint(contract.listClosestToPoint)
  public listClosestToPoint(): HandlerResult<typeof contract.listClosestToPoint> {
    return handler(contract.listClosestToPoint, async ({ query }) => {
      const { longitude, latitude, limit } = query
      const parkingSpots = await this.parkingSpotRepository.listParkingSpotsClosestToLocation(
        { longitude, latitude },
        limit
      )
      return { status: 200, body: { data: parkingSpots } }
    })
  }

  @Endpoint(contract.post)
  public create(): HandlerResult<typeof contract.post> {
    return handler(contract.post, async ({ body }) => {
      const parkingSpot = await this.parkingSpotRepository.create(body)
      return { status: 201, body: parkingSpot }
    })
  }

  @Endpoint(contract.get)
  public getById(): HandlerResult<typeof contract.get> {
    return handler(contract.get, async ({ params: { id } }) => {
      const maybeParkingSpot = await this.parkingSpotRepository.getById(id)
      return { status: 200, body: this.getEntityOrNotFound(maybeParkingSpot) }
    })
  }

  @Endpoint(contract.patch)
  public update(): HandlerResult<typeof contract.patch> {
    return handler(contract.patch, async ({ params: { id }, body }) => {
      const parkingSpot = await this.parkingSpotRepository.update(id, body)
      return { status: 200, body: parkingSpot }
    })
  }

  @Endpoint(contract.delete)
  public delete(): HandlerResult<typeof contract.delete> {
    return handler(contract.delete, async ({ params: { id } }) => {
      await this.parkingSpotRepository.delete(id)
      return { status: 204, body: undefined }
    })
  }
}
