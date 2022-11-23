import { NotFoundError } from '@parker/errors'

export abstract class BaseController {
  constructor(protected readonly entityName: string) {}

  protected getEntityOrNotFound<T>(maybeValue: T | undefined): T {
    if (!maybeValue) {
      throw new NotFoundError(`${this.entityName} not found`)
    }
    return maybeValue
  }
}
