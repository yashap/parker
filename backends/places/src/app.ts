import { FastifyAppBuilder, requireSession } from '@parker/fastify-utils'
import type { FastifyInstance } from 'fastify'
import { config } from './config.js'
import { GoogleClient } from './domain/google/GoogleClient.js'
import { registerPlaceDetailsRoutes } from './domain/placeDetails/registerPlaceDetailsRoutes.js'
import { registerPlaceSuggestionsRoutes } from './domain/placeSuggestions/registerPlaceSuggestionsRoutes.js'

export interface AppDeps {
  googleClient: GoogleClient
}

export const buildApp = (deps: AppDeps): Promise<FastifyInstance> => {
  return FastifyAppBuilder.build({
    websiteDomain: config.websiteDomain,
    registerRoutes: async (instance) => {
      // Gate every /places/* path (the places contract's pathPrefix) behind SuperTokens session verification, the
      // equivalent of the old per-endpoint AuthGuard
      instance.addHook('preHandler', async (request, reply) => {
        if (request.url.startsWith('/places/')) {
          await requireSession(request, reply)
        }
      })
      await registerPlaceSuggestionsRoutes(instance, deps)
      await registerPlaceDetailsRoutes(instance, deps)
    },
  })
}
