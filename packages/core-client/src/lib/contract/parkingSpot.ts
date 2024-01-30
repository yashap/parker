import { ContractBuilder } from '@parker/api-client-utils'
import { initContract } from '@ts-rest/core'
import { z } from 'zod'
import {
  CreateParkingSpotRequestSchema,
  ListParkingSpotsClosestToPointRequestSchema,
  ListParkingSpotsClosestToPointResponseSchema,
  ParkingSpotSchema,
  UpdateParkingSpotRequestSchema,
} from '../model/ParkingSpot'

const c = initContract()

export const parkingSpotContract = c.router({
  listClosestToPoint: {
    method: 'GET',
    path: '/parkingSpots/closestToPoint',
    query: ListParkingSpotsClosestToPointRequestSchema,
    responses: ContractBuilder.buildListResponses(ListParkingSpotsClosestToPointResponseSchema),
    summary: 'List parking spots closest to a point',
  },
  post: {
    method: 'POST',
    path: '/parkingSpots',
    body: CreateParkingSpotRequestSchema,
    responses: ContractBuilder.buildPostResponses(ParkingSpotSchema),
    summary: 'Create a parking spot',
  },
  get: {
    method: 'GET',
    path: '/parkingSpots/:id',
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    responses: ContractBuilder.buildGetResponses(ParkingSpotSchema),
    summary: 'Get a parking spot',
  },
  patch: {
    method: 'PATCH',
    path: '/parkingSpots/:id',
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    body: UpdateParkingSpotRequestSchema,
    responses: ContractBuilder.buildPatchResponses(ParkingSpotSchema),
    summary: 'Update a parking spot',
  },
  delete: {
    method: 'DELETE',
    path: '/parkingSpots/:id',
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    body: z.NEVER,
    responses: ContractBuilder.buildDeleteResponses(),
    summary: 'Delete a parking spot',
  },
})
