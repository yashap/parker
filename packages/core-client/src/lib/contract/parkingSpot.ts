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
    path: '/core/parkingSpots/closestToPoint',
    query: ListParkingSpotsClosestToPointRequestSchema,
    responses: ContractBuilder.buildListResponses(ListParkingSpotsClosestToPointResponseSchema),
    summary: 'List parking spots closest to a point',
  },
  post: {
    method: 'POST',
    path: '/core/parkingSpots',
    body: CreateParkingSpotRequestSchema,
    responses: ContractBuilder.buildPostResponses(ParkingSpotSchema),
    summary: 'Create a parking spot',
  },
  get: {
    method: 'GET',
    path: '/core/parkingSpots/:id',
    responses: ContractBuilder.buildGetResponses(ParkingSpotSchema),
    summary: 'Get a parking spot',
  },
  patch: {
    method: 'PATCH',
    path: '/core/parkingSpots/:id',
    body: UpdateParkingSpotRequestSchema,
    responses: ContractBuilder.buildPatchResponses(ParkingSpotSchema),
    summary: 'Update a parking spot',
  },
  delete: {
    method: 'DELETE',
    path: '/core/parkingSpots/:id',
    body: z.NEVER,
    responses: ContractBuilder.buildDeleteResponses(),
    summary: 'Delete a parking spot',
  },
})
