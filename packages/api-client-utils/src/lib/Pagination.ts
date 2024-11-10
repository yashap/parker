import { InputValidationError } from '@parker/errors'
import { z, ZodArray, ZodObject, ZodTypeAny } from 'zod'

const orderDirection = ['asc', 'desc'] as const

export const OrderDirectionSchema = z.enum(orderDirection)

export type OrderDirectionDto = z.infer<typeof OrderDirectionSchema>

export const OrderDirectionValues = OrderDirectionSchema.Enum

export const DEFAULT_LIMIT = 50
export const DEFAULT_MAX_LIMIT = 50
export const DEFAULT_ORDER_BY = 'createdAt'
export const DEFAULT_ORDER_DIRECTION: OrderDirectionDto = OrderDirectionValues.desc

export const PaginationRequestSchema = z.object(
  {
    limit: z.coerce.number().min(1).max(DEFAULT_MAX_LIMIT).optional().describe('Number of items to fetch'),
    orderBy: z.string().optional().describe('Field to order by'),
    orderDirection: OrderDirectionSchema.optional().describe('Order direction'),
    cursor: z.string().optional().describe('Cursor containing all information necessary to fetch the next page'),
  },
  {
    description:
      'Pagination query params. For fetching the first page, pass any/all of limit/orderBy/orderDirection. For ' +
      'fetching subsequent pages, pass only the cursor you got from the previous response.',
  }
)

export type PaginationRequestDto = z.infer<typeof PaginationRequestSchema>

export const PaginationResponseSchema = z.object(
  {
    next: z.string().optional().describe('Can be used to fetch the next page'),
    previous: z.string().optional().describe('Can be used to fetch the previous page'),
  },
  { description: 'Pagination information, attached to responses of list endpoints, to allow you to fetch other pages' }
)

export type PaginationResponseDto = z.infer<typeof PaginationResponseSchema>

export type PaginatedResponseSchema<T extends ZodTypeAny> = ZodObject<{
  data: ZodArray<T>
  pagination: typeof PaginationResponseSchema
}>

export interface PaginatedResponseDto<T> {
  data: T[]
  pagination: PaginationResponseDto
}

export interface Cursor<K extends string, V> {
  limit: number
  orderBy: K
  orderDirection: OrderDirectionDto
  lastOrderValueSeen: V
  lastIdSeen: string
}

export const encodeCursor = <K extends string, V>(cursor: Cursor<K, V>): string => {
  // TODO: base64
  return JSON.stringify(cursor)
}

export const decodeCursor = <K extends string, V>(cursor: string): Cursor<K, V> => {
  // TODO: base64
  // TODO: validate orderBy, lastOrderValueSeen and lastIdSeen (should it take zod schemas?)
  return JSON.parse(cursor) as unknown as Cursor<K, V>
}

export const parsePagination = <K extends string, V>(
  dto: PaginationRequestDto
): Cursor<K, V> | Omit<Cursor<K, V>, 'lastOrderValueSeen' | 'lastIdSeen'> => {
  const { limit = DEFAULT_LIMIT, orderBy = DEFAULT_ORDER_BY, orderDirection = DEFAULT_ORDER_DIRECTION, cursor } = dto
  if (cursor) {
    if (dto.limit || dto.orderBy || dto.orderDirection) {
      throw new InputValidationError(
        'When providing a cursor, you cannot provide the limit, orderBy or orderDirection params. Those params are ' +
          'only for getting the first page.'
      )
    }
    return decodeCursor<K, V>(cursor)
  }

  return {
    limit,
    orderBy: orderBy as K, // TODO: Validate
    orderDirection,
  }
}
