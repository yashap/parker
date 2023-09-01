import { ContextPropagator } from '@parker/context-propagation'

export const LogContextPropagator = new ContextPropagator<{ correlationId: string }>()
