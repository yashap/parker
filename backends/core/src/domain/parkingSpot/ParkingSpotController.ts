import { Controller, UseGuards } from '@nestjs/common'
import { contract as rootContract } from '@parker/core-client'
import { BaseController, Endpoint, HandlerResult, handler } from '@parker/nest-utils'
import { SessionContainer } from 'supertokens-node/recipe/session'
import { AuthGuard, Session } from '../../auth'
import { ParkingSpotRepository } from './ParkingSpotRepository'

const contract = rootContract.parkingSpots

@Controller()
export class ParkingSpotController extends BaseController {
  constructor(private readonly parkingSpotRepository: ParkingSpotRepository) {
    super('ParkingSpot')
  }

  @Endpoint(contract.listClosestToPoint)
  @UseGuards(new AuthGuard())
  public listClosestToPoint(@Session() _session: SessionContainer): HandlerResult<typeof contract.listClosestToPoint> {
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
  @UseGuards(new AuthGuard())
  public create(@Session() _session: SessionContainer): HandlerResult<typeof contract.post> {
    return handler(contract.post, async ({ body }) => {
      const parkingSpot = await this.parkingSpotRepository.create(body)
      return { status: 201, body: parkingSpot }
    })
  }

  @Endpoint(contract.get)
  @UseGuards(new AuthGuard())
  public getById(@Session() _session: SessionContainer): HandlerResult<typeof contract.get> {
    return handler(contract.get, async ({ params: { id } }) => {
      const maybeParkingSpot = await this.parkingSpotRepository.getById(id)
      return { status: 200, body: this.getEntityOrNotFound(maybeParkingSpot) }
    })
  }

  @Endpoint(contract.patch)
  @UseGuards(new AuthGuard())
  public update(@Session() _session: SessionContainer): HandlerResult<typeof contract.patch> {
    return handler(contract.patch, async ({ params: { id }, body }) => {
      const parkingSpot = await this.parkingSpotRepository.update(id, body)
      return { status: 200, body: parkingSpot }
    })
  }

  @Endpoint(contract.delete)
  @UseGuards(new AuthGuard())
  public delete(@Session() _session: SessionContainer): HandlerResult<typeof contract.delete> {
    return handler(contract.delete, async ({ params: { id } }) => {
      await this.parkingSpotRepository.delete(id)
      return { status: 204, body: undefined }
    })
  }
}
