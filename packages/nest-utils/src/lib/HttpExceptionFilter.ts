import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpServer } from '@nestjs/common'
import { InputValidationError, ServerError, ServerErrorDto, UnknownError } from '@parker/errors'
import { Logger } from '@parker/logging'
import { RequestValidationError } from '@ts-rest/nest'
import { isString } from 'lodash'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter<unknown> {
  private readonly logger: Logger = new Logger(HttpExceptionFilter.name)

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
    if (error instanceof RequestValidationError) {
      return error.getStatus()
    }
    return HttpStatus.INTERNAL_SERVER_ERROR
  }

  private static getServerErrorDto(error: Error): ServerErrorDto {
    if (error instanceof ServerError) {
      return error.toDto()
    }
    if (error instanceof RequestValidationError) {
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
      return new InputValidationError('Invalid request', {
        cause: error,
        metadata,
      }).toDto()
    }
    return UnknownError.wrap(error).toDto()
  }
}
