import { Controller, UseGuards } from '@nestjs/common'
import {
  DEFAULT_LIMIT,
  encodeCursor,
  OrderDirectionValues,
  PaginationResponseDto,
  parsePagination,
} from '@parker/api-client-utils'
import { contract as rootContract } from '@parker/core-client'
import { BaseController, Endpoint, HandlerResult, HttpStatus, handler } from '@parker/nest-utils'
import { first, last, pick } from 'lodash'
import { SessionContainer } from 'supertokens-node/recipe/session'
import { AuthGuard, Session } from '../../auth'
import { timeRulesFromDto } from '../timeRule'
import { timeRuleOverridesFromDto } from '../timeRuleOverride'
import { ListParkingSpotPagination, ParkingSpot, parkingSpotToDto } from './ParkingSpot'
import { ParkingSpotRepository } from './ParkingSpotRepository'

const contract = rootContract.parkingSpots

@Controller()
export class ParkingSpotController extends BaseController {
  constructor(private readonly parkingSpotRepository: ParkingSpotRepository) {
    super('ParkingSpot')
  }

  @Endpoint(contract.list)
  @UseGuards(new AuthGuard())
  public list(@Session() _session: SessionContainer): HandlerResult<typeof contract.list> {
    return handler(contract.list, async ({ query }) => {
      const { ownerUserId } = query
      const pagination: ListParkingSpotPagination = parsePagination<'createdAt', number>(query)
      const parkingSpots = await this.parkingSpotRepository.list({ ownerUserId }, pagination)

      // TODO-lib-cursor: extract this generation of cursor response into a lib
      let paginationResponse: PaginationResponseDto = {}
      const firstParkingSpot = first(parkingSpots)
      const lastParkingSpot = last(parkingSpots)
      if (firstParkingSpot && lastParkingSpot) {
        const baseCursor = pick(pagination, ['limit', 'orderBy'])
        const next = {
          ...baseCursor,
          orderDirection: pagination.orderDirection,
          lastOrderValueSeen: lastParkingSpot[pagination.orderBy],
          lastIdSeen: lastParkingSpot.id,
        }
        const previous = {
          ...baseCursor,
          orderDirection:
            pagination.orderDirection === OrderDirectionValues.asc
              ? OrderDirectionValues.desc
              : OrderDirectionValues.asc,
          lastOrderValueSeen: firstParkingSpot[pagination.orderBy],
          lastIdSeen: firstParkingSpot.id,
        }
        paginationResponse = {
          next: encodeCursor(next),
          previous: encodeCursor(previous),
        }
      }

      return {
        status: HttpStatus.OK,
        body: { data: parkingSpots.map(parkingSpotToDto), pagination: paginationResponse },
      }
    })
  }

  @Endpoint(contract.listClosestToPoint)
  @UseGuards(new AuthGuard())
  public listClosestToPoint(@Session() _session: SessionContainer): HandlerResult<typeof contract.listClosestToPoint> {
    return handler(contract.listClosestToPoint, async ({ query }) => {
      const { longitude, latitude, limit } = query
      const parkingSpots = await this.parkingSpotRepository.listParkingSpotsClosestToLocation(
        { longitude, latitude },
        limit ?? DEFAULT_LIMIT
      )
      return { status: HttpStatus.OK, body: { data: parkingSpots.map(parkingSpotToDto) } }
    })
  }

  @Endpoint(contract.post)
  @UseGuards(new AuthGuard())
  public create(@Session() session: SessionContainer): HandlerResult<typeof contract.post> {
    return handler(contract.post, async ({ body }) => {
      const parkingSpot = await this.parkingSpotRepository.create({
        ...body,
        ownerUserId: session.getUserId(),
        timeRules: timeRulesFromDto(body.timeRules),
        timeRuleOverrides: timeRuleOverridesFromDto(body.timeRuleOverrides),
      })
      return { status: HttpStatus.CREATED, body: parkingSpotToDto(parkingSpot) }
    })
  }

  @Endpoint(contract.get)
  @UseGuards(new AuthGuard())
  public getById(@Session() _session: SessionContainer): HandlerResult<typeof contract.get> {
    return handler(contract.get, async ({ params: { id } }) => {
      const maybeParkingSpot = await this.parkingSpotRepository.getById(id)
      return { status: HttpStatus.OK, body: parkingSpotToDto(this.getEntityOrNotFound(maybeParkingSpot)) }
    })
  }

  @Endpoint(contract.patch)
  @UseGuards(new AuthGuard())
  public update(@Session() session: SessionContainer): HandlerResult<typeof contract.patch> {
    return handler(contract.patch, async ({ params: { id }, body }) => {
      await this.getAndVerifyOwnership(id, session.getUserId())
      const parkingSpot = await this.parkingSpotRepository.update(id, {
        ...body,
        timeRules: body.timeRules ? timeRulesFromDto(body.timeRules) : undefined,
        timeRuleOverrides: body.timeRuleOverrides ? timeRuleOverridesFromDto(body.timeRuleOverrides) : undefined,
      })
      return { status: HttpStatus.OK, body: parkingSpotToDto(parkingSpot) }
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
}
