import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpServer } from '@nestjs/common'
import { isHttpException } from './isHttpException'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter<unknown> {
  constructor(private readonly server: HttpServer<unknown, unknown>) {}

  public catch(error: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const status = isHttpException(error) ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR
    const response = ctx.getResponse()
    const body = {
      // TODO: should probably do error codes/sub-codes
      message: error.message ?? 'Unknown error',
      name: error.name ?? 'UnknownError',
    }
    this.server.reply(response, body, status)
  }
}
