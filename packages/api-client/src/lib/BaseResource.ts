import { isServerError } from '@parker/errors'
import { ApiClient } from './ApiClient'
import { BaseListQueryParams, ListResponse } from './pagination'

export abstract class BaseResource<
  ResourceDto = unknown,
  ListQueryParams = BaseListQueryParams,
  PostBody = unknown,
  PatchBody = unknown
> {
  constructor(protected readonly apiClient: ApiClient, protected readonly basePath: string) {}

  protected buildDelete() {
    return async (id: string): Promise<void> => {
      return this.apiClient.delete(`${this.basePath}/${id}`)
    }
  }

  protected buildGet() {
    return async (id: string): Promise<ResourceDto | undefined> => {
      try {
        return await this.apiClient.get<ResourceDto>(`${this.basePath}/${id}`)
      } catch (error) {
        if (isServerError(error) && error.httpStatusCode === 404) {
          return undefined
        }
        throw error
      }
    }
  }

  protected buildList() {
    // TODO: add an arg like `fetchAllPages: boolean = false`, that will follow all cursors
    return (params?: ListQueryParams): Promise<ListResponse<ResourceDto>> => {
      return this.apiClient.get<ListResponse<ResourceDto>, ListQueryParams | undefined>(this.basePath, params)
    }
  }

  protected buildPatch() {
    return async (id: string, patchBody: PatchBody): Promise<ResourceDto> => {
      return this.apiClient.patch<ResourceDto, PatchBody>(`${this.basePath}/${id}`, patchBody)
    }
  }

  protected buildPost() {
    return async (id: string, postBody: PostBody): Promise<ResourceDto> => {
      return this.apiClient.post<ResourceDto, PostBody>(`${this.basePath}/${id}`, postBody)
    }
  }
}
