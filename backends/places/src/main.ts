import { initMicroserviceSuperTokens } from '@parker/fastify-utils'
import { Logger } from '@parker/logging'
import { buildApp } from './app.js'
import { config } from './config.js'
import { GoogleClient } from './domain/google/GoogleClient.js'

const logger = new Logger('PlacesService')

const start = async (): Promise<void> => {
  initMicroserviceSuperTokens({
    apiDomain: config.apiDomain,
    websiteDomain: config.websiteDomain,
    connectionUri: config.supertokens.connectionUri,
    apiKey: config.supertokens.apiKey,
  })

  const googleClient = new GoogleClient()
  const app = await buildApp({ googleClient })

  await app.listen({ port: config.port, host: '0.0.0.0' })
  logger.info(`places listening on http://0.0.0.0:${config.port}`)
}

start().catch((error: unknown) => {
  logger.error('Failed to start places service', { error })
  process.exit(1)
})
