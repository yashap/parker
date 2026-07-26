import { initMicroserviceSuperTokens } from '@parker/fastify-utils'
import type { FastifyInstance } from 'fastify'
import { buildApp } from 'src/app'
import { config } from 'src/config'
import { GoogleClient } from 'src/domain/google/GoogleClient'

export interface TestAppOverrides {
  googleClient?: GoogleClient
}

export const buildTestApp = async (overrides: TestAppOverrides = {}): Promise<FastifyInstance> => {
  // No SuperTokens core has to actually be running for tests (tests use mockAuth), but SuperTokens must be initialized
  // for the app to be built
  initMicroserviceSuperTokens({
    apiDomain: config.apiDomain,
    websiteDomain: config.websiteDomain,
    connectionUri: config.supertokens.connectionUri,
    apiKey: config.supertokens.apiKey,
  })
  const googleClient = overrides.googleClient ?? new GoogleClient()
  return buildApp({ googleClient })
}
