import { NotFoundError } from '@parker/errors'
import { tsRestPluginOptions } from '@parker/fastify-utils'
import { contract as rootContract } from '@parker/places-client'
import { initServer } from '@ts-rest/fastify'
import type { FastifyInstance } from 'fastify'
import { GoogleClient } from '../google/GoogleClient.js'

const contract = rootContract.placeDetails

export interface PlaceDetailsRoutesDeps {
  googleClient: GoogleClient
}

export const registerPlaceDetailsRoutes = async (app: FastifyInstance, deps: PlaceDetailsRoutesDeps): Promise<void> => {
  const { googleClient } = deps
  const s = initServer()

  const router = s.router(contract, {
    get: async ({ params }) => {
      const { id } = params

      try {
        const placeDetails = await googleClient.getPlaceDetails(id)

        return {
          status: 200,
          body: placeDetails,
        }
      } catch (_error) {
        // If Google API returns an error, throw a NotFoundError
        throw new NotFoundError(`Place with ID ${id} not found`)
      }
    },
  })

  await app.register(s.plugin(router), tsRestPluginOptions)
}
