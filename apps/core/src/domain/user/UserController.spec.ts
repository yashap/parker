import { NotFoundException } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { v4 as uuid } from 'uuid'
import { UserController } from './UserController'
import { UserDto } from './UserDto'
import { UserRepository } from './UserRepository'

describe(UserController.name, () => {
  let userController: UserController
  let user1: UserDto

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserRepository],
    }).compile()
    userController = app.get(UserController)
    user1 = await userController.create({ fullName: 'Donald Duck' })
  })

  describe('findById', () => {
    it('should find a user by id', async () => {
      expect(await userController.findById(user1.id)).toStrictEqual(user1)
    })

    it('should throw a not found error if the id is not found', async () => {
      expect(userController.findById(uuid())).rejects.toBeInstanceOf(NotFoundException)
    })
  })
})
