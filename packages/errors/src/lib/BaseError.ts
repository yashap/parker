import ExtendableError from 'extendable-error'

export abstract class BaseError extends ExtendableError {
  public readonly cause?: Error

  constructor(message?: string, maybeCause?: unknown) {
    super(message)
    this.name = new.target.name
    this.cause = maybeCause instanceof Error ? maybeCause : undefined
  }
}
