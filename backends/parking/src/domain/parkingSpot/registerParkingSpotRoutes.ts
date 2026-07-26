import { ForbiddenError } from '@parker/errors'
import { getEntityOrNotFound, getSessionUserId, tsRestPluginOptions } from '@parker/fastify-utils'
import { DEFAULT_LIMIT, buildPaginatedResponse, parsePagination } from '@parker/pagination'
import { contract as rootContract } from '@parker/parking-client'
import { initServer } from '@ts-rest/fastify'
import type { FastifyInstance } from 'fastify'
import {
  ListParkingSpotPagination,
  ParkingSpot,
  parkingSpotToDto,
  parseParkingSpotOrdering,
} from 'src/domain/parkingSpot/ParkingSpot'
import { ParkingSpotRepository } from 'src/domain/parkingSpot/ParkingSpotRepository'
import { timeRulesFromDto } from 'src/domain/timeRule'
import { timeRuleOverridesFromDto } from 'src/domain/timeRuleOverride'

const contract = rootContract.parkingSpots

export interface ParkingSpotRoutesDeps {
  parkingSpotRepository: ParkingSpotRepository
}

export const registerParkingSpotRoutes = async (app: FastifyInstance, deps: ParkingSpotRoutesDeps): Promise<void> => {
  const { parkingSpotRepository } = deps
  const s = initServer()

  const getAndVerifyOwnership = async (parkingSpotId: string, userId: string): Promise<ParkingSpot> => {
    const maybeParkingSpot = await parkingSpotRepository.getById(parkingSpotId)
    const parkingSpot = getEntityOrNotFound(maybeParkingSpot, 'ParkingSpot')
    if (parkingSpot.ownerUserId !== userId) {
      throw new ForbiddenError('Forbidden as you are not the owner of this parking spot')
    }
    return parkingSpot
  }

  const router = s.router(contract, {
    list: async ({ query }) => {
      const { ownerUserId } = query
      const pagination: ListParkingSpotPagination = parsePagination(query, parseParkingSpotOrdering)
      const parkingSpots = await parkingSpotRepository.list({ ownerUserId }, pagination)
      return {
        status: 200,
        body: buildPaginatedResponse(parkingSpots.map(parkingSpotToDto), pagination),
      }
    },
    listClosestToPoint: async ({ query }) => {
      const { longitude, latitude, limit } = query
      const parkingSpots = await parkingSpotRepository.listParkingSpotsClosestToLocation(
        { longitude, latitude },
        limit ?? DEFAULT_LIMIT
      )
      return { status: 200, body: { data: parkingSpots.map(parkingSpotToDto) } }
    },
    post: async ({ body, request }) => {
      const parkingSpot = await parkingSpotRepository.create({
        ...body,
        ownerUserId: getSessionUserId(request),
        timeRules: timeRulesFromDto(body.timeRules),
        timeRuleOverrides: timeRuleOverridesFromDto(body.timeRuleOverrides),
      })
      return { status: 201, body: parkingSpotToDto(parkingSpot) }
    },
    get: async ({ params: { id } }) => {
      const maybeParkingSpot = await parkingSpotRepository.getById(id)
      return { status: 200, body: parkingSpotToDto(getEntityOrNotFound(maybeParkingSpot, 'ParkingSpot')) }
    },
    patch: async ({ params: { id }, body, request }) => {
      await getAndVerifyOwnership(id, getSessionUserId(request))
      const parkingSpot = await parkingSpotRepository.update(id, {
        ...body,
        timeRules: body.timeRules ? timeRulesFromDto(body.timeRules) : undefined,
        timeRuleOverrides: body.timeRuleOverrides ? timeRuleOverridesFromDto(body.timeRuleOverrides) : undefined,
      })
      return { status: 200, body: parkingSpotToDto(parkingSpot) }
    },
    delete: async ({ params: { id }, request }) => {
      await getAndVerifyOwnership(id, getSessionUserId(request))
      await parkingSpotRepository.delete(id)
      return { status: 204, body: undefined }
    },
  })

  await app.register(s.plugin(router), tsRestPluginOptions)
}
