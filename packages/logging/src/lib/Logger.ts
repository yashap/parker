import winston from 'winston'
import { LogContextPropagator } from './LogContextPropagator'
import { LogData } from './LogData'

export enum LogLevel {
  Error = 'error',
  Warn = 'warn',
  Info = 'info',
  Debug = 'debug',
  Trace = 'trace',
}

const levels: Record<LogLevel, number> = {
  [LogLevel.Error]: 0,
  [LogLevel.Warn]: 1,
  [LogLevel.Info]: 2,
  [LogLevel.Debug]: 3,
  [LogLevel.Trace]: 4,
}

const getLevel = (): LogLevel => {
  const defaultLogLevel = LogLevel.Warn
  switch ((process.env['LOG_LEVEL'] ?? defaultLogLevel).toLowerCase()) {
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
  return winston.format.cli()
}

interface LogOptions {
  error?: Error
  metadata?: LogData
}

export class Logger {
  private readonly underlyingLogger: winston.Logger
  private readonly enabledLevelValue: number

  constructor(private readonly name: string, private readonly defaultMetadata?: LogData) {
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

  public error(message: string, options: LogOptions): void {
    this.log(LogLevel.Error, message, options)
  }

  public warn(message: string, options: LogOptions): void {
    this.log(LogLevel.Warn, message, options)
  }

  public info(message: string, options: LogOptions): void {
    this.log(LogLevel.Info, message, options)
  }

  public debug(message: string, options: LogOptions): void {
    this.log(LogLevel.Debug, message, options)
  }

  public trace(message: string, options: LogOptions): void {
    this.log(LogLevel.Trace, message, options)
  }

  /**
   * Create a "child" logger - will have all the default metadata of the parent, plus any extra overrides you specify
   *
   * @param name The name of the logger
   * @param defaultMetadataOverrides Metadata to override (or add to) values from the parent
   * @returns A new logger
   */
  public child(name: string, defaultMetadataOverrides?: LogData) {
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

  private log(level: LogLevel, message: string, options: LogOptions): void {
    const { error, metadata } = options
    const context = LogContextPropagator.getContext()
    const fullMetadata = { ...this.defaultMetadata, ...metadata }
    this.underlyingLogger.log({
      level,
      message,
      name: this.name,
      ...(Object.keys(fullMetadata).length === 0 ? {} : { metadata: fullMetadata }),
      ...(context === undefined ? {} : { context }),
      ...(error === undefined ? {} : { error }), // TODO: nicely format with stack trace and whatnot
    })
  }
}
