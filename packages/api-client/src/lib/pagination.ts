export interface ListResponse<T> {
  data: T[]
  pagination: {
    next?: string
    previous?: string
  }
}

export enum OrderDirection {
  Asc = 'asc',
  Desc = 'desc',
}

export interface BaseListQueryParams<OrderBy = string> {
  limit?: number
  orderBy?: OrderBy
  orderDirection?: OrderDirection
}
