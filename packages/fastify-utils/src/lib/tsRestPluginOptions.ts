import type { RequestValidationError } from '@ts-rest/fastify'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { parkerErrorHandler } from './errorHandler'

/**
 * The options every service should pass when registering a ts-rest router plugin, e.g.:
 *
 * ```ts
 * await app.register(s.plugin(router), tsRestPluginOptions)
 * ```
 *
 * These options preserve the validation behavior of our old NestJS services (which passed
 * `validateResponses: true, validateRequestQuery: true, validateRequestBody: true` to ts-rest):
 *
 * - Request validation (path params, query, body) is always on with `@ts-rest/fastify` - a request that doesn't match
 *   the contract throws a RequestValidationError, which `requestValidationErrorHandler` maps to our standard 400
 *   InputValidationError DTO (rather than ts-rest's default 'combined' error body).
 * - `responseValidation: true` makes ts-rest validate every response body against the contract, throwing a
 *   ResponseValidationError (mapped to our standard 500 ResponseValidationError DTO by parkerErrorHandler) when a
 *   handler returns a body that doesn't match.
 */
export const tsRestPluginOptions = {
  responseValidation: true,
  requestValidationErrorHandler: (
    error: RequestValidationError,
    request: FastifyRequest,
    reply: FastifyReply
  ): void => {
    parkerErrorHandler(error, request, reply)
  },
} as const
