import { FastifyAppBuilder, initLoginServiceSuperTokens } from '@parker/fastify-utils'
import { Logger } from '@parker/logging'
import { config } from './config.js'

const logger = new Logger('UserService')

const start = async (): Promise<void> => {
  initLoginServiceSuperTokens({
    apiDomain: config.apiDomain,
    websiteDomain: config.websiteDomain,
    connectionUri: config.supertokens.connectionUri,
    apiKey: config.supertokens.apiKey,
  })

  const app = await FastifyAppBuilder.build({
    websiteDomain: config.websiteDomain,
    registerRoutes: () => {
      // This service has no routes of its own - the SuperTokens fastify plugin serves all the /auth/* endpoints
      // (signup, signin, signout, session refresh, etc.)
    },
  })

  await app.listen({ port: config.port, host: '0.0.0.0' })
  logger.info(`user listening on http://0.0.0.0:${config.port}`)
}

start().catch((error: unknown) => {
  logger.error('Failed to start user service', { error })
  process.exit(1)
})
