import { ContractBuilder } from '@parker/api-client-utils'
import { initContract } from '@ts-rest/core'
import { z } from 'zod'
import { PlaceDetailsSchema } from '../model/PlaceDetails'

const c = initContract()

export const placeDetailsContract = c.router({
  get: {
    method: 'GET',
    path: '/placeDetails/:id',
    pathParams: z.object({
      id: z.string().uuid(),
    }),
    responses: ContractBuilder.buildGetResponses(PlaceDetailsSchema),
    summary: 'Get details about a place',
  },
})
