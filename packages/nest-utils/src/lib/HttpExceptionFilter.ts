import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpServer } from '@nestjs/common'
import { ServerError, ServerErrorDto, UnknownError } from '@parker/errors'
import { Logger } from '@parker/logging'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter<unknown> {
  private readonly logger: Logger = new Logger(HttpExceptionFilter.name)

  constructor(private readonly server: HttpServer<unknown, unknown>) {}

  public catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const status = error instanceof ServerError ? error.httpStatusCode : HttpStatus.INTERNAL_SERVER_ERROR
    if (status >= 500) {
      this.logger.error('Caught exception', { error, status })
    } else {
      this.logger.warn('Caught exception', { error, status })
    }
    const response = ctx.getResponse()
    const body: ServerErrorDto = error instanceof ServerError ? error.toDto() : UnknownError.wrap(error).toDto()
    this.server.reply(response, body, status)
  }
}
