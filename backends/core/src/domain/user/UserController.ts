import { Controller } from '@nestjs/common'
import { contract as rootContract } from '@parker/core-client'
import { BaseController, Endpoint, HandlerResult, handler } from '@parker/nest-utils'
import { UserRepository } from './UserRepository'

const contract = rootContract.users

@Controller()
export class UserController extends BaseController {
  constructor(private readonly userRepository: UserRepository) {
    super('User')
  }

  @Endpoint(contract.post)
  public create(): HandlerResult<typeof contract.post> {
    return handler(contract.post, async ({ body }) => {
      const user = await this.userRepository.create(body)
      return { status: 201, body: user }
    })
  }

  @Endpoint(contract.get)
  public getById(): HandlerResult<typeof contract.get> {
    return handler(contract.get, async ({ params: { id } }) => {
      const maybeUser = await this.userRepository.getById(id)
      return { status: 200, body: this.getEntityOrNotFound(maybeUser) }
    })
  }

  @Endpoint(contract.patch)
  public update(): HandlerResult<typeof contract.patch> {
    return handler(contract.patch, async ({ params: { id }, body }) => {
      const user = await this.userRepository.update(id, body)
      return { status: 200, body: user }
    })
  }

  @Endpoint(contract.delete)
  public delete(): HandlerResult<typeof contract.delete> {
    return handler(contract.delete, async ({ params: { id } }) => {
      await this.userRepository.delete(id)
      return { status: 204, body: undefined }
    })
  }
}
