import { Cursor } from './Cursor'
import { encodeCursor } from './encoding'
import { OrderDirectionValues } from './orderDirection'
import { PaginatedResponseDto, PaginationResponseDto } from './paginationDto'

export const buildPaginatedResponse = <K extends string, V, T extends Record<K, unknown> & { id: string }>(
  data: T[],
  pagination: Omit<Cursor<K, V>, 'lastOrderValueSeen' | 'lastIdSeen'>
): PaginatedResponseDto<T> => {
  let paginationResponse: PaginationResponseDto = {}
  const firstItem = data[0]
  const lastItem = data[data.length - 1]
  if (firstItem && lastItem) {
    const baseCursor = { limit: pagination.limit, orderBy: pagination.orderBy }
    const next = {
      ...baseCursor,
      orderDirection: pagination.orderDirection,
      lastOrderValueSeen: lastItem[pagination.orderBy],
      lastIdSeen: lastItem.id,
    }
    const previous = {
      ...baseCursor,
      orderDirection:
        pagination.orderDirection === OrderDirectionValues.asc ? OrderDirectionValues.desc : OrderDirectionValues.asc,
      lastOrderValueSeen: firstItem[pagination.orderBy],
      lastIdSeen: firstItem.id,
    }
    paginationResponse = {
      next: encodeCursor(next),
      previous: encodeCursor(previous),
    }
  }
  return {
    data,
    pagination: paginationResponse,
  }
}
