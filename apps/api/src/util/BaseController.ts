import { NotFoundException } from '@nestjs/common'

export abstract class BaseController {
  constructor(protected readonly entityName: string) {}

  protected require<T>(maybeValue: T | undefined): T {
    if (!maybeValue) {
      // TODO: centralize errors into a library
      throw new NotFoundException({ error: `${this.entityName} not found` })
    }
    return maybeValue
  }
}
