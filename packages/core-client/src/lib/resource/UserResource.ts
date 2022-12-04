import { ApiClient, BaseListQueryParams, BaseResource } from '@parker/api-client'
import { CreateUserDto, UserDto, UpdateUserDto } from '../dto'

export class UserResource extends BaseResource<UserDto, BaseListQueryParams, CreateUserDto, UpdateUserDto> {
  constructor(apiClient: ApiClient) {
    super(apiClient, 'users')
  }

  public delete = this.buildDelete()
  public get = this.buildGet()
  public patch = this.buildPatch()
  public post = this.buildPost()
}
