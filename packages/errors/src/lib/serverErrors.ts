import { ErrorOptions, ServerError, WrapErrorOptions } from './ServerError'

/**
 * 4xx errors
 */

export class InputValidationError<T = unknown> extends ServerError<T> {
  constructor(message: string, options: ErrorOptions<T> = {}) {
    super(400, message, options)
  }

  public static wrap<A = unknown>(error: Error, optionOverrides: WrapErrorOptions<A> = {}): InputValidationError<A> {
    const { message, options } = this.buildOptionsForWrappedError(error, optionOverrides)
    return new InputValidationError(message, options)
  }
}

export class NotFoundError<T = unknown> extends ServerError<T> {
  constructor(message: string, options: ErrorOptions<T> = {}) {
    super(404, message, options)
  }

  public static wrap<A = unknown>(error: Error, optionOverrides: WrapErrorOptions<A> = {}): NotFoundError<A> {
    const { message, options } = this.buildOptionsForWrappedError(error, optionOverrides)
    return new NotFoundError(message, options)
  }
}

/**
 * 5xx errors
 */

export class InternalServerError<T = unknown> extends ServerError<T> {
  constructor(message: string, options: ErrorOptions<T> = {}) {
    super(500, message, options)
  }

  public static wrap<A = unknown>(error: Error, optionOverrides: WrapErrorOptions<A> = {}): InternalServerError<A> {
    const { message, options } = this.buildOptionsForWrappedError(error, optionOverrides)
    return new InternalServerError(message, options)
  }
}

export class UnknownError<T = unknown> extends ServerError<T> {
  constructor(message: string, options: ErrorOptions<T> = {}) {
    super(500, message, options)
  }

  public static wrap<A = unknown>(error: Error, optionOverrides: WrapErrorOptions<A> = {}): UnknownError<A> {
    const { message, options } = this.buildOptionsForWrappedError(error, optionOverrides)
    return new UnknownError(message, options)
  }
}

/**
 * Utilities
 */

export const buildServerErrorFromDto = (dto: unknown, statusCode: number): ServerError => {
  if (ServerError.isServerErrorDto(dto)) {
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
  return new UnknownError('Unexpected response from server', {
    cause: dto,
    metadata: { response: { body: dto, status: statusCode } },
  })
}
