import { NestInterceptor, ExecutionContext, CallHandler, HttpServer, HttpStatus } from '@nestjs/common'
import { ServerError } from '@parker/errors'
import { Logger, Payload } from '@parker/logging'
import { Request, Response } from 'express'
import { Observable, throwError } from 'rxjs'
import { catchError, tap } from 'rxjs/operators'

export class HttpLoggingInterceptor implements NestInterceptor<unknown, unknown> {
  private logger: Logger = new Logger('HttpRequest')

  constructor(private readonly server: HttpServer<unknown, unknown>) {}

  public intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startMs = Date.now()
    const request = context.switchToHttp().getRequest<Request>()
    const method = this.server.getRequestMethod?.(request) ?? 'unknownMethod'
    const path = this.server.getRequestUrl?.(request) ?? 'unknownPath'
    return next.handle().pipe(
      tap(() => {
        const response = context.switchToHttp().getResponse<Response>()
        this.logRequest(response.statusCode, method, path, Date.now() - startMs)
      }),
      catchError((error) => {
        const status = error instanceof ServerError ? error.httpStatusCode : HttpStatus.INTERNAL_SERVER_ERROR
        this.logRequest(status, method, path, Date.now() - startMs, error)
        return throwError(() => error)
      })
    )
  }

  private logRequest(status: number, method: string, path: string, durationMs: number, error?: unknown): void {
    const logPayload: Payload = {
      error,
      metadata: {
        status,
        method,
        path,
        durationMs,
      },
    }
    if (status >= 500) {
      this.logger.error('Returning 5xx response', logPayload)
    } else if (status >= 400) {
      this.logger.warn('Returning 4xx response', logPayload)
    } else {
      this.logger.info(`Returning ${status.toString().charAt(0)}xx response`, logPayload)
    }
  }
}
