import { Temporal } from '@js-temporal/polyfill'
import { Controller, UseGuards } from '@nestjs/common'
import { ParkingSpotDto, TimeRuleDto, contract as rootContract } from '@parker/core-client'
import { BaseController, Endpoint, HandlerResult, HttpStatus, handler } from '@parker/nest-utils'
import { SessionContainer } from 'supertokens-node/recipe/session'
import { AuthGuard, Session } from '../../auth'
import { TimeRule } from '../timeRule'
import { ParkingSpot } from './ParkingSpot'
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
      return {
        status: HttpStatus.OK,
        body: { data: parkingSpots.map((parkingSpot) => this.parkingSpotToDto(parkingSpot)) },
      }
    })
  }

  @Endpoint(contract.post)
  @UseGuards(new AuthGuard())
  public create(@Session() session: SessionContainer): HandlerResult<typeof contract.post> {
    return handler(contract.post, async ({ body }) => {
      const parkingSpot = await this.parkingSpotRepository.create({
        ...body,
        ownerUserId: session.getUserId(),
        timeRules: body.timeRules.map((timeRule) => this.timeRuleFromDto(timeRule)),
      })
      return { status: HttpStatus.CREATED, body: this.parkingSpotToDto(parkingSpot) }
    })
  }

  @Endpoint(contract.get)
  @UseGuards(new AuthGuard())
  public getById(@Session() _session: SessionContainer): HandlerResult<typeof contract.get> {
    return handler(contract.get, async ({ params: { id } }) => {
      const maybeParkingSpot = await this.parkingSpotRepository.getById(id)
      return { status: HttpStatus.OK, body: this.parkingSpotToDto(this.getEntityOrNotFound(maybeParkingSpot)) }
    })
  }

  @Endpoint(contract.patch)
  @UseGuards(new AuthGuard())
  public update(@Session() session: SessionContainer): HandlerResult<typeof contract.patch> {
    return handler(contract.patch, async ({ params: { id }, body }) => {
      await this.getAndVerifyOwnership(id, session.getUserId())
      const parkingSpot = await this.parkingSpotRepository.update(id, {
        ...body,
        timeRules: body.timeRules ? body.timeRules.map((timeRule) => this.timeRuleFromDto(timeRule)) : undefined,
      })
      return { status: HttpStatus.OK, body: this.parkingSpotToDto(parkingSpot) }
    })
  }

  @Endpoint(contract.delete)
  @UseGuards(new AuthGuard())
  public delete(@Session() session: SessionContainer): HandlerResult<typeof contract.delete> {
    return handler(contract.delete, async ({ params: { id } }) => {
      await this.getAndVerifyOwnership(id, session.getUserId())
      await this.parkingSpotRepository.delete(id)
      return { status: HttpStatus.NO_CONTENT, body: undefined }
    })
  }

  private async getAndVerifyOwnership(parkingSpotId: string, userId: string): Promise<ParkingSpot> {
    const maybeParkingSpot = await this.parkingSpotRepository.getById(parkingSpotId)
    const parkingSpot = this.getEntityOrNotFound(maybeParkingSpot)
    if (parkingSpot.ownerUserId !== userId) {
      throw this.buildEntityNotFoundError()
    }
    return parkingSpot
  }

  private parkingSpotToDto(parkingSpot: ParkingSpot): ParkingSpotDto {
    return {
      ...parkingSpot,
      timeRules: parkingSpot.timeRules.map((timeRule) => ({
        ...timeRule,
        startTime: timeRule.startTime.toString(),
        endTime: timeRule.endTime.toString(),
      })),
    }
  }

  private timeRuleFromDto(timeRules: TimeRuleDto): TimeRule {
    return {
      ...timeRules,
      startTime: Temporal.PlainTime.from(timeRules.startTime),
      endTime: Temporal.PlainTime.from(timeRules.endTime),
    }
  }
}
