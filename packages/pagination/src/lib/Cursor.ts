import { z } from 'zod'
import { DEFAULT_MAX_LIMIT } from './constants'
import { OrderDirection, OrderDirectionSchema } from './orderDirection'

const CursorSchema = z.object({
  limit: z.number().min(1).max(DEFAULT_MAX_LIMIT).describe('Number of items to fetch'),
  orderBy: z.string().describe('Field to order by'),
  orderDirection: OrderDirectionSchema.describe('Order direction'),
  lastOrderValueSeen: z.unknown().describe('Last order value seen'),
  lastIdSeen: z.string().describe('Last id seen'),
})

export interface Cursor<K extends string, V> {
  limit: number
  orderBy: K
  orderDirection: OrderDirection
  lastOrderValueSeen: V
  lastIdSeen: string
}

export type ParseOrdering<K extends string, V> = (ordering: { orderBy: unknown; lastOrderValueSeen: unknown }) => {
  orderBy: K
  lastOrderValueSeen: V
}

export const parseCursor = <K extends string, V>(cursor: unknown, parseOrdering: ParseOrdering<K, V>): Cursor<K, V> => {
  const { orderBy, lastOrderValueSeen, ...parsedCursor } = CursorSchema.parse(cursor)
  return {
    ...parsedCursor,
    ...parseOrdering({ orderBy, lastOrderValueSeen }),
  }
}
