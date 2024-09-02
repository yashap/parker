import { ContextPropagator } from '@parker/context-propagation'
import { Transaction } from 'kysely'

export const ActiveTransactionContext = new ContextPropagator<Transaction<unknown>>()
