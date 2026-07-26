import { FastifyAppBuilder, requireSession } from '@parker/fastify-utils'
import type { FastifyInstance } from 'fastify'
import { config } from 'src/config'
import { Db } from 'src/db/Db'
import { ParkingSpotRepository } from 'src/domain/parkingSpot/ParkingSpotRepository'
import { registerParkingSpotRoutes } from 'src/domain/parkingSpot/registerParkingSpotRoutes'
import { registerParkingSpotBookingRoutes } from 'src/domain/parkingSpotBooking/registerParkingSpotBookingRoutes'

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
