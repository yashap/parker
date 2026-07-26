import cors from '@fastify/cors'
import formbody from '@fastify/formbody'
import { EndpointNotFoundError } from '@parker/errors'
import { Logger } from '@parker/logging'
import Fastify, { type FastifyInstance } from 'fastify'
import supertokens from 'supertokens-node'
import { correlationIdPlugin } from './correlationIdPlugin.js'
import { parkerErrorHandler } from './errorHandler.js'
import { httpLoggingPlugin } from './httpLoggingPlugin.js'
import { supertokensFastify } from './supertokensPlugin.js'

export interface FastifyAppBuilderOptions {
  /**
   * The URL of the website that talks to this API. When set, CORS is enabled for this origin (including the
   * SuperTokens auth headers). When absent, CORS is not enabled at all.
   */
  websiteDomain?: string
  registerRoutes: (app: FastifyInstance) => Promise<void> | void
}

const logger = new Logger('FastifyAppBuilder')

export class FastifyAppBuilder {
  public static async build(options: FastifyAppBuilderOptions): Promise<FastifyInstance> {
    const app = Fastify({
      logger: false,
      ignoreTrailingSlash: true,
    })

    // Correlation IDs and HTTP logging must come first so they wrap everything downstream.
    await app.register(correlationIdPlugin)
    await app.register(httpLoggingPlugin)

    await app.register(formbody)

    if (options.websiteDomain) {
      await app.register(cors, {
        origin: options.websiteDomain,
        allowedHeaders: ['content-type', ...supertokens.getAllCORSHeaders()],
        credentials: true,
      })
    }

    await app.register(supertokensFastify)

    // SuperTokens registers its own error handler via the plugin; override with ours so app errors
    // (after the supertokens path-matcher) get our consistent DTO. SuperTokens' handler is still
    // invoked for its own routes through the framework integration.
    app.setErrorHandler(parkerErrorHandler)

    await options.registerRoutes(app)

    app.setNotFoundHandler((request, reply) => {
      logger.debug('404', { method: request.method, url: request.url })
      void reply.status(404).send(new EndpointNotFoundError('Endpoint not found').toDto())
    })

    return app
  }
}
