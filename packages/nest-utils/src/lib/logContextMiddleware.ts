import { LogContextPropagator } from '@parker/logging'
import { v4 as uuid } from 'uuid'
import { NestFunctionalMiddleware } from './NestFunctionalMiddleware'

export const logContextMiddleware: NestFunctionalMiddleware = (_request, _response, next) => {
  LogContextPropagator.runWithContext(
    {
      // TODO: when implementing propagation across services, get the correlationId from the header if it exists, else create a new UUID
      correlationId: uuid(),
    },
    next
  )
}
