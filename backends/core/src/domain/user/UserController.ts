import { Controller } from '@nestjs/common'
import { contract } from '@parker/core-client'
import { BaseController, Endpoint, handle } from '@parker/nest-utils'
import { UserRepository } from './UserRepository'

@Controller()
export class UserController extends BaseController {
  constructor(private readonly userRepository: UserRepository) {
    super('User')
  }

  @Endpoint(contract.users.post)
  public async create() {
    return handle(contract.users.post, async ({ body }) => {
      const user = await this.userRepository.create(body)
      return { status: 201, body: user }
    })
  }

  @Endpoint(contract.users.get)
  public async getById() {
    return handle(contract.users.get, async ({ params: { id } }) => {
      const maybeUser = await this.userRepository.getById(id)
      return { status: 200, body: this.getEntityOrNotFound(maybeUser) }
    })
  }

  @Endpoint(contract.users.patch)
  public async update() {
    return handle(contract.users.patch, async ({ params: { id }, body }) => {
      const user = await this.userRepository.update(id, body)
      return { status: 200, body: user }
    })
  }

  @Endpoint(contract.users.delete)
  public async delete() {
    return handle(contract.users.delete, async ({ params: { id } }) => {
      await this.userRepository.delete(id)
      return { status: 204, body: undefined }
    })
  }
}
