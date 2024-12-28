import { InputValidationError } from '@parker/errors'
import { DEFAULT_LIMIT, DEFAULT_ORDER_BY, DEFAULT_ORDER_DIRECTION } from './constants'
import { Cursor, ParseOrdering } from './Cursor'
import { decodeCursor } from './encoding'
import { PaginationRequestDto } from './paginationDto'

export const parsePagination = <K extends string, V>(
  dto: PaginationRequestDto,
  parseOrdering: ParseOrdering<K, V>
): Cursor<K, V> | Omit<Cursor<K, V>, 'lastOrderValueSeen' | 'lastIdSeen'> => {
  const { limit = DEFAULT_LIMIT, orderBy = DEFAULT_ORDER_BY, orderDirection = DEFAULT_ORDER_DIRECTION, cursor } = dto

  // The request was anything but the first request, has a cursor
  if (cursor) {
    if (dto.limit || dto.orderBy || dto.orderDirection) {
      throw new InputValidationError(
        'When providing a cursor, you cannot provide the limit, orderBy or orderDirection params. Those params are ' +
          'only for getting the first page.'
      )
    }
    return decodeCursor<K, V>(cursor, parseOrdering)
  }

  // It was the first request, no cursor
  return {
    limit,
    orderBy: orderBy as K,
    orderDirection,
  }
}
