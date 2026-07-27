import { tsRestPluginOptions } from '@parker/fastify-utils'
import { contract as rootContract } from '@parker/places-client'
import { initServer } from '@ts-rest/fastify'
import type { FastifyInstance } from 'fastify'
import { GoogleClient } from '../google/GoogleClient.js'

const contract = rootContract.placeSuggestions

export interface PlaceSuggestionsRoutesDeps {
  googleClient: GoogleClient
}

export const registerPlaceSuggestionsRoutes = async (
  app: FastifyInstance,
  deps: PlaceSuggestionsRoutesDeps
): Promise<void> => {
  const { googleClient } = deps
  const s = initServer()

  const router = s.router(contract, {
    search: async ({ query }) => {
      const { search, latitude, longitude, language, useStrictBounds, radius, limit } = query

      const suggestions = await googleClient.getPlaceSuggestions({
        search,
        location: latitude !== undefined && longitude !== undefined ? { latitude, longitude } : undefined,
        language,
        useStrictBounds,
        radius,
        limit,
      })

      return {
        status: 200,
        body: {
          data: suggestions,
        },
      }
    },
  })

  await app.register(s.plugin(router), tsRestPluginOptions)
}
