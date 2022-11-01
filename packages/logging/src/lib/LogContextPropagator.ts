import { ContextPropagator } from '@parker/context-propagation'
import { LogData } from './LogData'

export const LogContextPropagator = new ContextPropagator<LogData>()
