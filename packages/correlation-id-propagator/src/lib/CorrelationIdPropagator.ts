import { ContextPropagator } from '@parker/context-propagation'

export const CorrelationIdPropagator = new ContextPropagator<string>()
