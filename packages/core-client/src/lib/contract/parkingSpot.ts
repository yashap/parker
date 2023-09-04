import { DefaultErrorResponses, DefaultErrorResponsesWithNotFound } from '@parker/api-client-utils'
import { initContract } from '@ts-rest/core'
import { z } from 'zod'
import { CreateParkingSpotRequestSchema } from '../model/CreateParkingSpotRequest'
import { ListParkingSpotsClosestToPointRequestSchema } from '../model/ListParkingSpotsClosestToPointRequest'
import { ListParkingSpotsClosestToPointResponseSchema } from '../model/ListParkingSpotsClosestToPointResponse'
import { ParkingSpotSchema } from '../model/ParkingSpot'
import { UpdateParkingSpotRequestSchema } from '../model/UpdateParkingSpotRequest'

const c = initContract()

export const parkingSpotContract = c.router({
  listClosestToPoint: {
    method: 'GET',
    path: '/core/parkingSpots/closestToPoint',
    query: ListParkingSpotsClosestToPointRequestSchema,
    responses: {
      200: ListParkingSpotsClosestToPointResponseSchema,
      ...DefaultErrorResponses,
    },
    summary: 'Get a parking spot',
  },
  post: {
    method: 'POST',
    path: '/core/parkingSpots',
    body: CreateParkingSpotRequestSchema,
    responses: {
      201: ParkingSpotSchema,
      ...DefaultErrorResponses,
    },
    summary: 'Create a parking spot',
  },
  get: {
    method: 'GET',
    path: '/core/parkingSpots/:id',
    responses: {
      200: ParkingSpotSchema,
      ...DefaultErrorResponsesWithNotFound,
    },
    summary: 'Get a parking spot',
  },
  patch: {
    method: 'PATCH',
    path: '/core/parkingSpots/:id',
    body: UpdateParkingSpotRequestSchema,
    responses: {
      200: ParkingSpotSchema,
      ...DefaultErrorResponsesWithNotFound,
    },
    summary: 'Update a parking spot',
  },
  delete: {
    method: 'DELETE',
    path: '/core/parkingSpots/:id',
    body: z.NEVER,
    responses: {
      204: z.undefined(),
      ...DefaultErrorResponsesWithNotFound,
    },
    summary: 'Delete a parking spot',
  },
})
