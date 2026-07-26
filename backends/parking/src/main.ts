import { initMicroserviceSuperTokens } from '@parker/fastify-utils'
import { Logger } from '@parker/logging'
import { buildApp } from 'src/app'
import { config } from 'src/config'
import { Db } from 'src/db/Db'
import { ParkingSpotRepository } from 'src/domain/parkingSpot/ParkingSpotRepository'

const logger = new Logger('ParkingService')

const start = async (): Promise<void> => {
  initMicroserviceSuperTokens({
    apiDomain: config.apiDomain,
    websiteDomain: config.websiteDomain,
    connectionUri: config.supertokens.connectionUri,
    apiKey: config.supertokens.apiKey,
  })

  const db = new Db()
  const parkingSpotRepository = new ParkingSpotRepository(db)
  const app = await buildApp({ db, parkingSpotRepository })

  await app.listen({ port: config.port, host: '0.0.0.0' })
  logger.info(`parking listening on http://0.0.0.0:${config.port}`)
}

start().catch((error: unknown) => {
  logger.error('Failed to start parking service', { error })
  process.exit(1)
})
