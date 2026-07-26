import { initMicroserviceSuperTokens } from '@parker/fastify-utils'
import type { FastifyInstance } from 'fastify'
import { buildApp } from '../app.js'
import { config } from '../config.js'
import { GoogleClient } from '../domain/google/GoogleClient.js'

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
