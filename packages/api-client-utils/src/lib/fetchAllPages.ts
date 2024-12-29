import { PaginatedResponseDto, PaginationRequestDto } from '@parker/pagination'
import { omit } from 'lodash'

export const fetchAllPages = async <T, R extends PaginationRequestDto>(
  request: R,
  fetchPage: (request: R) => Promise<PaginatedResponseDto<T>>
): Promise<T[]> => {
  const firstPageResponse = await fetchPage(request)
  const allData = [...firstPageResponse.data]
  let prevPageResponse = firstPageResponse
  while (prevPageResponse.pagination.next && prevPageResponse.data.length > 0) {
    const nextPageResponse = await fetchPage({
      ...omit(request, ['limit', 'orderBy', 'orderDirection']),
      cursor: prevPageResponse.pagination.next,
    } as R)
    allData.push(...nextPageResponse.data)
    prevPageResponse = nextPageResponse
  }
  return allData
}
