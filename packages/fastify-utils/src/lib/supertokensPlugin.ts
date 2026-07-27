import type { FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import supertokens from 'supertokens-node'
import {
  errorHandler as supertokensErrorHandler,
  plugin as supertokensFastifyPlugin,
} from 'supertokens-node/framework/fastify'

const supertokensFastify = fp(
  async (fastify: FastifyInstance) => {
    await fastify.register(supertokensFastifyPlugin)
    fastify.setErrorHandler(supertokensErrorHandler())
  },
  {
    name: 'parker-supertokens-plugin',
  }
)

export { supertokensFastify, supertokens }
