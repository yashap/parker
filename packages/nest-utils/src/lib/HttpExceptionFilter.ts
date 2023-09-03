import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpServer,
  HttpException as NestHttpException,
  NotFoundException as NestNotFoundException,
} from '@nestjs/common'
import {
  EndpointNotFoundError,
  InputValidationError,
  ResponseValidationError,
  ServerError,
  ServerErrorDto,
  UnknownError,
} from '@parker/errors'
import { Logger } from '@parker/logging'
import { RequestValidationError, ResponseValidationError as LibResponseValidationError } from '@ts-rest/nest'
import { isString } from 'lodash'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter<unknown> {
  private readonly logger: Logger = new Logger(HttpExceptionFilter.name)
  private static endpointNotFoundRegex: RegExp = /^Cannot (GET|POST|PATCH|PUT|DELETE) \//

  constructor(private readonly server: HttpServer<unknown, unknown>) {}

  public catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const status = HttpExceptionFilter.getStatus(error)
    if (status >= 500) {
      this.logger.error('Caught exception', { error, status })
    } else {
      this.logger.warn('Caught exception', { error, status })
    }
    const response = ctx.getResponse()
    const responseBody = HttpExceptionFilter.getServerErrorDto(error)
    this.server.reply(response, responseBody, status)
  }

  private static getStatus(error: Error): number {
    if (error instanceof ServerError) {
      return error.httpStatusCode
    }
    if (error instanceof NestHttpException) {
      return error.getStatus()
    }
    return HttpStatus.INTERNAL_SERVER_ERROR
  }

  private static getServerErrorDto(error: Error): ServerErrorDto {
    if (error instanceof ServerError) {
      return error.toDto()
    }
    if (error instanceof NestHttpException) {
      const serverError = this.nestExceptionToServerError(error)
      return serverError.toDto()
    }
    return UnknownError.wrap(error).toDto()
  }

  private static nestExceptionToServerError(error: NestHttpException): ServerError {
    let metadata: object = {}
    const errorDetails = error.getResponse()
    if (isString(errorDetails)) {
      try {
        metadata = JSON.parse(errorDetails)
      } catch (_parseError) {
        metadata = { details: errorDetails }
      }
    } else {
      metadata = errorDetails
    }
    if (error instanceof RequestValidationError) {
      return new InputValidationError('Invalid request', {
        cause: error,
        metadata,
      })
    }
    if (error instanceof LibResponseValidationError) {
      return new ResponseValidationError('Invalid response', {
        cause: error,
        metadata,
      })
    }
    if (error instanceof NestNotFoundException && HttpExceptionFilter.endpointNotFoundRegex.test(error.message)) {
      return new EndpointNotFoundError('Endpoint not found', {
        cause: error,
      })
    }
    return new UnknownError(error.message, error.getStatus(), { cause: error, metadata })
  }
}
