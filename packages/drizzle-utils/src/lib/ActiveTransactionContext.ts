import { ContextPropagator } from '@parker/context-propagation'
import { PgQueryResultHKT, PgTransaction } from 'drizzle-orm/pg-core'

export const ActiveTransactionContext = new ContextPropagator<PgTransaction<PgQueryResultHKT>>()
