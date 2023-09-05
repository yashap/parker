import { Controller } from '@nestjs/common'
import { contract } from '@parker/core-client'
import { BaseController, Endpoint, HandlerResult, handler } from '@parker/nest-utils'
import { UserRepository } from './UserRepository'

@Controller()
export class UserController extends BaseController {
  constructor(private readonly userRepository: UserRepository) {
    super('User')
  }

  @Endpoint(contract.users.post)
  public create(): HandlerResult {
    return handler(contract.users.post, async ({ body }) => {
      const user = await this.userRepository.create(body)
      return { status: 201, body: user }
    })
  }

  @Endpoint(contract.users.get)
  public getById(): HandlerResult {
    return handler(contract.users.get, async ({ params: { id } }) => {
      const maybeUser = await this.userRepository.getById(id)
      return { status: 200, body: this.getEntityOrNotFound(maybeUser) }
    })
  }

  @Endpoint(contract.users.patch)
  public update(): HandlerResult {
    return handler(contract.users.patch, async ({ params: { id }, body }) => {
      const user = await this.userRepository.update(id, body)
      return { status: 200, body: user }
    })
  }

  @Endpoint(contract.users.delete)
  public delete(): HandlerResult {
    return handler(contract.users.delete, async ({ params: { id } }) => {
      await this.userRepository.delete(id)
      return { status: 204, body: undefined }
    })
  }
}
