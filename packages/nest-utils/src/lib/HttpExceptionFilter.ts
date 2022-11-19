import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpServer } from '@nestjs/common'
import { isServerError, ServerError, ServerErrorDto } from '@parker/errors'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter<unknown> {
  constructor(private readonly server: HttpServer<unknown, unknown>) {}

  public catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const status = isServerError(error) ? error.httpStatusCode : HttpStatus.INTERNAL_SERVER_ERROR
    const response = ctx.getResponse()
    const body: ServerErrorDto = isServerError(error) ? error.toDto() : ServerError.fromDto(error, status).toDto()
    this.server.reply(response, body, status)
  }
}
