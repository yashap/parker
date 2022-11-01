import { ContextPropagator } from '@parker/context-propagation'
import { v4 as uuid } from 'uuid'
import { NestFunctionalMiddleware } from './NestFunctionalMiddleware'

// TODO: maybe move LogContext and LogContextPropagator into a logging package
export interface LogContext {
  correlationId: string
  [key: string]: string
}

export const LogContextPropagator = new ContextPropagator<LogContext>()

export const logContextMiddleware: NestFunctionalMiddleware = (request, _response, next) => {
  LogContextPropagator.runWithContext(
    {
      // TODO: when implementing propagation across services, get the correlationId from the header if it exists, else create a new UUID
      correlationId: uuid(),
      method: request.method,
      path: new URL(request.url).pathname,
    },
    next
  )
}
