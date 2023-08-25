import { Controller } from '@nestjs/common'
import { contract } from '@parker/core-client'
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest'
import { BaseController } from '../../http/BaseController'
import { UserRepository } from './UserRepository'

@Controller()
export class UserController extends BaseController {
  constructor(private readonly userRepository: UserRepository) {
    super('User')
  }

  @TsRestHandler(contract.users.post)
  public async create() {
    return tsRestHandler(contract.users.post, async ({ body }) => {
      const user = await this.userRepository.create(body)
      return { status: 201, body: user }
    })
  }

  @TsRestHandler(contract.users.get)
  public async getById() {
    return tsRestHandler(contract.users.get, async ({ params: { id } }) => {
      const maybeUser = await this.userRepository.getById(id)
      return { status: 200, body: this.getEntityOrNotFound(maybeUser) }
    })
  }

  @TsRestHandler(contract.users.patch)
  public async update() {
    return tsRestHandler(contract.users.patch, async ({ params: { id }, body }) => {
      const user = await this.userRepository.update(id, body)
      return { status: 200, body: user }
    })
  }

  @TsRestHandler(contract.users.delete)
  public async delete() {
    return tsRestHandler(contract.users.delete, async ({ params: { id } }) => {
      await this.userRepository.delete(id)
      return { status: 204, body: undefined }
    })
  }
}
