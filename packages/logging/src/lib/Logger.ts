import { CorrelationIdPropagator } from '@parker/correlation-id-propagator'
import { toString } from 'lodash'
import winston from 'winston'

export enum LogLevel {
  Off = 'off',
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Debug = 'debug',
  Trace = 'trace',
}

const levels: Record<LogLevel, number> = {
  [LogLevel.Off]: 0,
  [LogLevel.Error]: 1,
  [LogLevel.Warn]: 2,
  [LogLevel.Info]: 3,
  [LogLevel.Debug]: 4,
  [LogLevel.Trace]: 5,
}

enum AnsiColors {
  Yellow = '\u001B[33m',
  Cyan = '\u001B[36m',
}

const getLevel = (): LogLevel => {
  const defaultLogLevel = LogLevel.Info
  switch ((process.env['LOG_LEVEL'] ?? defaultLogLevel).toLowerCase()) {
    case LogLevel.Off:
      return LogLevel.Off
    case LogLevel.Error:
      return LogLevel.Error
    case LogLevel.Warn:
      return LogLevel.Warn
    case LogLevel.Info:
      return LogLevel.Info
    case LogLevel.Debug:
      return LogLevel.Debug
    case LogLevel.Trace:
      return LogLevel.Trace
    default:
      return defaultLogLevel
  }
}

const getFormat = (): winston.Logform.Format => {
  if ((process.env['JSON_LOGS'] ?? '').toLowerCase() === 'true') {
    return winston.format.json()
  }
  return winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: 'hh:mm:ss' }),
    winston.format.align(),
    winston.format.printf((log) => {
      const { timestamp, level, name, message, error, ...metadata } = log
      const metadataString =
        metadata && Object.keys(metadata).length > 0
          ? ` ${AnsiColors.Cyan}${JSON.stringify(metadata)}${AnsiColors.Yellow}`
          : ''
      const errorString = error ? `\n  ${error.stack ? error.stack : toString(error)}` : ''
      return `${timestamp} ${level} [${name}]: ${message}${metadataString}${errorString}`
    })
  )
}

export interface Payload {
  error?: unknown
  [key: string]: unknown
}

export class Logger {
  private readonly underlyingLogger: winston.Logger
  private readonly enabledLevelValue: number

  constructor(
    private readonly name: string,
    private readonly defaultMetadata?: Payload
  ) {
    const level = getLevel()
    this.underlyingLogger = winston.createLogger({
      levels,
      level,
      format: getFormat(),
      defaultMeta: defaultMetadata,
      transports: [new winston.transports.Console()],
    })
    this.enabledLevelValue = levels[level]
  }

  public error(message: string, payload?: Payload): void {
    this.log(LogLevel.Error, message, payload)
  }

  public warn(message: string, payload?: Payload): void {
    this.log(LogLevel.Warn, message, payload)
  }

  public info(message: string, payload?: Payload): void {
    this.log(LogLevel.Info, message, payload)
  }

  public debug(message: string, payload?: Payload): void {
    this.log(LogLevel.Debug, message, payload)
  }

  public trace(message: string, payload?: Payload): void {
    this.log(LogLevel.Trace, message, payload)
  }

  /**
   * Create a "child" logger - will have all the default metadata of the parent, plus any extra overrides you specify
   *
   * @param name The name of the logger
   * @param defaultMetadataOverrides Metadata to override (or add to) values from the parent
   * @returns A new logger
   */
  public child(name: string, defaultMetadataOverrides?: Payload) {
    return new Logger(name, { ...this.defaultMetadata, ...defaultMetadataOverrides })
  }

  /**
   * Check if a log level is enabled. Useful if generating the log message/payload is expensive, and you only want to
   * do it if you have to.
   *
   * Example:
   *
   * ```ts
   * if (logger.isLevelEnabled(LogLevel.Debug)) {
   *   const metadata = await expensiveGetMetadata()
   *   logger.debug('Foo happened', { metadata })
   * }
   * ```
   *
   * @param level The level to check
   * @returns Whether or not it's enabled.
   */
  public isLevelEnabled(level: LogLevel): boolean {
    return levels[level] <= this.enabledLevelValue
  }

  private log(level: LogLevel, message: string, payload?: Payload): void {
    const { error, ...metadata } = payload ?? {}
    const correlationId = CorrelationIdPropagator.getContext()
    this.underlyingLogger.log({
      level,
      message,
      name: this.name,
      correlationId,
      ...this.defaultMetadata,
      ...metadata,
      ...(error === undefined ? {} : { error }), // TODO: nicely format with stack trace and whatnot
    })
  }
}
