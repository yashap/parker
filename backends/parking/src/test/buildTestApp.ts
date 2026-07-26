import { initMicroserviceSuperTokens } from '@parker/fastify-utils'
import type { FastifyInstance } from 'fastify'
import { buildApp } from 'src/app'
import { config } from 'src/config'
import { Db } from 'src/db/Db'
import { ParkingSpotRepository } from 'src/domain/parkingSpot/ParkingSpotRepository'

export const buildTestApp = async (): Promise<FastifyInstance> => {
  // No SuperTokens core has to actually be running for tests (tests use mockAuth), but SuperTokens must be initialized
  // for the app to be built
  initMicroserviceSuperTokens({
    apiDomain: config.apiDomain,
    websiteDomain: config.websiteDomain,
    connectionUri: config.supertokens.connectionUri,
    apiKey: config.supertokens.apiKey,
  })
  const db = new Db()
  const parkingSpotRepository = new ParkingSpotRepository(db)
  return buildApp({ db, parkingSpotRepository })
}
