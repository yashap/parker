import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpServer } from '@nestjs/common'
import { isServerError, ServerErrorDto, UnknownError } from '@parker/errors'
import { Logger } from '@parker/logging'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter<unknown> {
  private readonly logger: Logger = new Logger(HttpExceptionFilter.name)

  constructor(private readonly server: HttpServer<unknown, unknown>) {}

  public catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const status = isServerError(error) ? error.httpStatusCode : HttpStatus.INTERNAL_SERVER_ERROR
    if (status >= 500) {
      this.logger.error('Caught exception', { error, metadata: { status } })
    } else {
      this.logger.warn('Caught exception', { error, metadata: { status } })
    }
    const response = ctx.getResponse()
    const body: ServerErrorDto = isServerError(error) ? error.toDto() : UnknownError.build(error).toDto()
    this.server.reply(response, body, status)
  }
}
