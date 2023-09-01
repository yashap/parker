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
    },
    summary: 'Get a parking spot',
  },
  post: {
    method: 'POST',
    path: '/core/parkingSpots',
    responses: {
      201: ParkingSpotSchema,
    },
    body: CreateParkingSpotRequestSchema,
    summary: 'Create a parking spot',
  },
  get: {
    method: 'GET',
    path: '/core/parkingSpots/:id',
    responses: {
      200: ParkingSpotSchema,
    },
    summary: 'Get a parking spot',
  },
  patch: {
    method: 'PATCH',
    path: '/core/parkingSpots/:id',
    responses: {
      200: ParkingSpotSchema,
    },
    body: UpdateParkingSpotRequestSchema,
    summary: 'Update a parking spot',
  },
  delete: {
    method: 'DELETE',
    path: '/core/parkingSpots/:id',
    responses: {
      204: z.undefined(),
    },
    body: z.NEVER,
    summary: 'Delete a parking spot',
  },
})
