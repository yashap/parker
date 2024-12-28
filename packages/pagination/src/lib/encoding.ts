import { InputValidationError } from '@parker/errors'
import { Base64 } from 'js-base64'
import { DEFAULT_LIMIT, DEFAULT_ORDER_BY, DEFAULT_ORDER_DIRECTION } from './constants'
import { Cursor, parseCursor, ParseOrdering } from './Cursor'
import { PaginationRequestDto } from './paginationDto'

export const encodeCursor = <K extends string, V>(cursor: Cursor<K, V>): string => {
  return Base64.encode(JSON.stringify(cursor))
}

export const decodeCursor = <K extends string, V>(cursor: string, parseOrdering: ParseOrdering<K, V>): Cursor<K, V> => {
  try {
    const cursorObject: unknown = JSON.parse(Base64.decode(cursor))
    return parseCursor(cursorObject, parseOrdering)
  } catch (error) {
    throw new InputValidationError('Invalid cursor', { cause: error })
  }
}

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
