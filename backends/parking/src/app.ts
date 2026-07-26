import { FastifyAppBuilder, requireSession } from '@parker/fastify-utils'
import type { FastifyInstance } from 'fastify'
import { config } from './config.js'
import { Db } from './db/Db.js'
import { ParkingSpotRepository } from './domain/parkingSpot/ParkingSpotRepository.js'
import { registerParkingSpotRoutes } from './domain/parkingSpot/registerParkingSpotRoutes.js'
import { registerParkingSpotBookingRoutes } from './domain/parkingSpotBooking/registerParkingSpotBookingRoutes.js'

export interface AppDeps {
  db: Db
  parkingSpotRepository: ParkingSpotRepository
}

export const buildApp = (deps: AppDeps): Promise<FastifyInstance> => {
  return FastifyAppBuilder.build({
    websiteDomain: config.websiteDomain,
    registerRoutes: async (instance) => {
      // Gate every /parking/* path (the parking contract's pathPrefix) behind SuperTokens session verification, the
      // equivalent of the old per-endpoint AuthGuard
      instance.addHook('preHandler', async (request, reply) => {
        if (request.url.startsWith('/parking/')) {
          await requireSession(request, reply)
        }
      })
      await registerParkingSpotRoutes(instance, { parkingSpotRepository: deps.parkingSpotRepository })
      await registerParkingSpotBookingRoutes(instance, { db: deps.db })
    },
  })
}
