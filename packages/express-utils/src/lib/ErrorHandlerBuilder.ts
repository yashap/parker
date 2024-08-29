import {
  InputValidationError,
  ResponseValidationError,
  ServerError,
  ServerErrorDto,
  UnknownError,
} from '@parker/errors'
import { Logger } from '@parker/logging'
import { ResponseValidationError as TsRestResponseValidationError } from '@ts-rest/core'
import { RequestValidationError } from '@ts-rest/express'
import { FunctionalErrorHandler } from './FunctionalErrorHandler'
import { HttpStatus } from './HttpStatus'

export class ErrorHandlerBuilder {
  private static readonly logger: Logger = new Logger('ErrorHandler')

  public static build(): FunctionalErrorHandler {
    return (error, _request, response, next) => {
      if (response.headersSent) {
        return next(error)
      }
      const status = ErrorHandlerBuilder.getStatus(error)
      const responseBody = ErrorHandlerBuilder.getServerErrorDto(error)
      if (status >= 500) {
        ErrorHandlerBuilder.logger.error('Caught exception', { error, status, responseBody })
      } else {
        ErrorHandlerBuilder.logger.warn('Caught exception', { error, status, responseBody })
      }
      response.status(status).json(responseBody)
    }
  }

  private static getStatus(error: Error): number {
    if (error instanceof ServerError) {
      return error.httpStatusCode
    }
    if (error instanceof RequestValidationError) {
      return HttpStatus.BAD_REQUEST
    }
    return HttpStatus.INTERNAL_SERVER_ERROR
  }

  private static getServerErrorDto(error: Error): ServerErrorDto {
    if (error instanceof ServerError) {
      return error.toDto()
    }
    if (error instanceof RequestValidationError) {
      return this.requestValidationErrorToServerError(error).toDto()
    }
    if (error instanceof TsRestResponseValidationError) {
      return this.responseValidationErrorToServerError(error).toDto()
    }
    console.log('Unknown error', error)
    return UnknownError.wrap(error).toDto()
  }

  private static requestValidationErrorToServerError(error: RequestValidationError): ServerError {
    return new InputValidationError('Invalid request', {
      cause: error,
      metadata: {
        ...(error.pathParams && { pathParamErrors: error.pathParams.issues }),
        ...(error.body && { bodyErrors: error.body.issues }),
        ...(error.query && { queryErrors: error.query.issues }),
      },
    })
  }

  private static responseValidationErrorToServerError(error: TsRestResponseValidationError): ServerError {
    return new ResponseValidationError('Invalid response', {
      cause: error,
      metadata: {
        details: error.cause.issues,
      },
    })
  }
}
