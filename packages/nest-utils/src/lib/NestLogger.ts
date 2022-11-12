import { LoggerService } from '@nestjs/common'
import { LogData, Logger, Payload } from '@parker/logging'

export class NestLogger implements LoggerService {
  private readonly underlyingLogger: Logger

  constructor(name?: string) {
    this.underlyingLogger = new Logger(name ?? 'NestJS')
  }

  public error(message: string, ...optionalParams: unknown[]): void {
    this.underlyingLogger.error(message, NestLogger.toPayload(optionalParams))
  }

  public warn(message: string, ...optionalParams: unknown[]): void {
    this.underlyingLogger.warn(message, NestLogger.toPayload(optionalParams))
  }

  public log(message: string, ...optionalParams: unknown[]): void {
    this.underlyingLogger.info(message, NestLogger.toPayload(optionalParams))
  }

  public debug?(message: string, ...optionalParams: unknown[]): void {
    this.underlyingLogger.debug(message, NestLogger.toPayload(optionalParams))
  }

  public verbose?(message: string, ...optionalParams: unknown[]): void {
    this.underlyingLogger.trace(message, NestLogger.toPayload(optionalParams))
  }

  private static toPayload(optionalParams: unknown[]): Payload {
    return optionalParams.length > 0 ? { metadata: { nestJsData: optionalParams } as LogData } : {}
  }
}
