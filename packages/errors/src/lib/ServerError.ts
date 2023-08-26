import { BaseError } from './BaseError'

export interface ServerErrorDto<T = unknown> {
  message: string
  code: string
  subCode?: string
  metadata?: T
}

export interface ErrorOptions<T = unknown> {
  cause?: unknown
  subCode?: string
  internalMessage?: string
  metadata?: T
}

export abstract class ServerError<T = unknown> extends BaseError {
  public readonly isParkerServerError: true = true as const
  public readonly code: string
  public readonly subCode?: string
  public readonly internalMessage?: string
  public readonly metadata?: T

  /**
   * Constructs a ServerError
   *
   * @param httpStatusCode If this error bubbles up to a server's response, what HTTP status code should be returned?
   * @param message Describes the error (note, will be returned to clients, and possibly displayed in UIs)
   * @param subCode Used to programmatically distinguish specific types of errors from one another. Should be written
   *                you might have an InputValidationError, but
   * @param internalMessage An optional message that can show up in logs, but that should not be returned to clients
   * @param metadata Additional data
   */
  constructor(
    public readonly httpStatusCode: number,
    message: string,
    options: ErrorOptions<T> = {}
  ) {
    super(message, options.cause)
    const { subCode, internalMessage, metadata } = options
    this.code = this.name
    this.subCode = subCode
    this.internalMessage = internalMessage
    this.metadata = metadata
  }

  // Transform this server error into a Data Transfer Object ()
  public toDto(): ServerErrorDto<T> {
    return {
      message: this.message,
      code: this.code,
      ...(this.subCode ? { subCode: this.subCode } : {}),
      ...(this.metadata ? { metadata: this.metadata } : {}),
    }
  }

  public static fromDto(dto: unknown, statusCode: number): ServerError {
    if (isServerErrorDto(dto)) {
      const options = { cause: dto, subCode: dto.subCode, metadata: dto.metadata }
      if (statusCode === 400 && dto.code === InputValidationError.name) {
        return new InputValidationError(dto.message, options)
      } else if (statusCode === 404 && dto.code === NotFoundError.name) {
        return new NotFoundError(dto.message, options)
      } else if (statusCode === 500 && dto.code === InternalServerError.name) {
        return new InternalServerError(dto.message, options)
      } else if (dto.code === UnknownError.name) {
        return new UnknownError(dto.message, options)
      }
    }
    return UnknownError.build(dto, statusCode)
  }
}

export const isServerError = (error: unknown): error is ServerError => {
  const serverError = error as ServerError
  return (
    Boolean(serverError.isParkerServerError) &&
    Boolean(serverError.httpStatusCode) &&
    Boolean(serverError.message) &&
    Boolean(serverError.code)
  )
}

export const isServerErrorDto = (error: unknown): error is ServerError => {
  const serverError = error as ServerErrorDto
  return Boolean(serverError.message) && Boolean(serverError.code)
}

export class InputValidationError<T = unknown> extends ServerError<T> {
  constructor(message: string, options: ErrorOptions<T> = {}) {
    super(400, message, options)
  }
}

export const isInputValidationError = <T = unknown>(error: unknown): error is InputValidationError<T> => {
  return isServerError(error) && error.code === InputValidationError.name
}

export class NotFoundError<T = unknown> extends ServerError<T> {
  constructor(message: string, options: ErrorOptions<T> = {}) {
    super(404, message, options)
  }
}

export const isNotFoundError = <T = unknown>(error: unknown): error is NotFoundError<T> => {
  return isServerError(error) && error.code === NotFoundError.name
}

export class InternalServerError<T = unknown> extends ServerError<T> {
  constructor(message: string, options: ErrorOptions<T> = {}) {
    super(500, message, options)
  }
}

export const isInternalServerError = <T = unknown>(error: unknown): error is InternalServerError<T> => {
  return isServerError(error) && error.code === InternalServerError.name
}

export class UnknownError<T = unknown> extends ServerError<T> {
  constructor(message: string, options: ErrorOptions<T> = {}) {
    super(500, message, options)
  }

  public static build(error: unknown, statusCode?: number): UnknownError {
    const err = error as Partial<Error>
    const message = `Unexpected response body [status: ${statusCode}] [message: ${err.message}] [body: ${JSON.stringify(
      err
    )}]`
    return new UnknownError(message, { cause: err })
  }
}

export const isUnknownError = <T = unknown>(error: unknown): error is UnknownError<T> => {
  return isServerError(error) && error.code === UnknownError.name
}
