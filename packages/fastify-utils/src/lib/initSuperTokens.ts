import { Logger, LogLevel } from '@parker/logging'
import supertokens from 'supertokens-node'
import EmailPassword from 'supertokens-node/recipe/emailpassword'
import Session from 'supertokens-node/recipe/session'
import type { RecipeListFunction } from 'supertokens-node/types'

export interface SuperTokensConfig {
  /** The public URL of this API (e.g. http://localhost:4503) */
  apiDomain: string
  /** The URL of the website that talks to this API (e.g. http://localhost:9081) */
  websiteDomain: string
  /** The URL of the SuperTokens core (e.g. http://localhost:4567) */
  connectionUri: string
  /** The API key of the SuperTokens core, if it requires one */
  apiKey?: string
}

const init = (config: SuperTokensConfig, recipeList: RecipeListFunction[]): void => {
  supertokens.init({
    framework: 'fastify',
    // When LOG_LEVEL is `debug` or `trace`, turn on SuperTokens' own verbose logging. This prints
    // detailed `com.supertokens {...}` lines to stdout showing exactly what each recipe decides
    // (e.g. why a session check fails on /auth/signout), which the access log alone can't show.
    debug: new Logger('SuperTokens').isLevelEnabled(LogLevel.Debug),
    supertokens: {
      connectionURI: config.connectionUri,
      ...(config.apiKey ? { apiKey: config.apiKey } : {}),
    },
    appInfo: {
      appName: 'Parker',
      apiDomain: config.apiDomain,
      websiteDomain: config.websiteDomain,
    },
    // Note: we intentionally don't set Session.init({ getTokenTransferMethod }) - the default ('any') supports both
    // cookie and header based sessions, which is what our clients (e.g. supertokens-react-native) expect.
    recipeList,
  })
}

/**
 * Initializes SuperTokens for the service responsible for login, signup, logout, etc.
 */
export const initLoginServiceSuperTokens = (config: SuperTokensConfig): void => {
  init(config, [EmailPassword.init(), Session.init()])
}

/**
 * Initializes SuperTokens for microservices where you only care about guarding API endpoints with auth, not providing
 * login, signup, logout, etc.
 */
export const initMicroserviceSuperTokens = (config: SuperTokensConfig): void => {
  init(config, [Session.init()])
}
