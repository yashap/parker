import { InputValidationError, ResponseValidationError, type ServerError, UnknownError } from '@parker/errors'
import { Logger } from '@parker/logging'
import { ResponseValidationError as TsRestResponseValidationError } from '@ts-rest/core'
import { RequestValidationError as TsRestRequestValidationError } from '@ts-rest/fastify'
import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import { Error as SuperTokensError } from 'supertokens-node'
import { errorHandler as buildSupertokensErrorHandler } from 'supertokens-node/framework/fastify'

const logger = new Logger('ErrorHandler')

const isServerError = (error: unknown): error is ServerError =>
  !!error && typeof error === 'object' && (error as { isParkerServerError?: boolean }).isParkerServerError === true

/**
 * Maps any error thrown while handling a request to one of our ServerErrors, which know their HTTP status code, and
 * know how to serialize themselves into our standard error DTO.
 */
const toServerError = (error: FastifyError | Error): ServerError => {
  if (isServerError(error)) {
    return error
  }
  // ts-rest throws this when the request body/query/path params don't match the contract
  if (error instanceof TsRestRequestValidationError) {
    return new InputValidationError('Invalid request', {
      cause: error,
      metadata: {
        ...(error.pathParams && { pathParamErrors: error.pathParams.issues }),
        ...(error.body && { bodyErrors: error.body.issues }),
        ...(error.query && { queryErrors: error.query.issues }),
      },
    })
  }
  // ts-rest throws this (when responseValidation is on) when a handler returns a body that doesn't match the contract
  if (error instanceof TsRestResponseValidationError) {
    return new ResponseValidationError('Invalid response', {
      cause: error,
      metadata: { details: error.cause.issues },
    })
  }
  // Fastify's own (schema based) validation errors come through with a `validation` array
  const fastifyError = error as FastifyError
  if (fastifyError.validation) {
    return new InputValidationError(fastifyError.message, {
      cause: error,
      metadata: { validation: fastifyError.validation },
    })
  }
  return new UnknownError('Internal server error', 500, { cause: error })
}

const supertokensErrorHandler = buildSupertokensErrorHandler()

export const parkerErrorHandler = (error: FastifyError | Error, request: FastifyRequest, reply: FastifyReply): void => {
  // SuperTokens errors (e.g. session refresh required, thrown by the /auth/* routes) must be handled by the
  // SuperTokens error handler - it sets the status codes/headers that the SuperTokens frontend SDKs expect
  if (error instanceof SuperTokensError) {
    void supertokensErrorHandler(error, request, reply)
    return
  }
  const serverError = toServerError(error)
  const status = serverError.httpStatusCode
  const responseBody = serverError.toDto()
  const logPayload = { error, status, responseBody, method: request.method, url: request.url }
  if (status >= 500) {
    logger.error('Caught exception', logPayload)
  } else {
    logger.warn('Caught exception', logPayload)
  }
  void reply.status(status).send(responseBody)
}
