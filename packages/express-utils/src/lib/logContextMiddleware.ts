import { CorrelationIdPropagator } from '@parker/correlation-id-propagator'
import { v4 as uuid } from 'uuid'
import { FunctionalMiddleware } from './FunctionalMiddleware'

export const logContextMiddleware: FunctionalMiddleware = (_request, _response, next) => {
  CorrelationIdPropagator.runWithContext(
    // TODO: when implementing propagation across services, get the correlationId from the header if it exists, else create a new UUID
    uuid(),
    next
  )
}
