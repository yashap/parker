import { Test } from '@nestjs/testing'
import { NotFoundError } from '@parker/errors'
import { v4 as uuid } from 'uuid'
import { UserController } from './UserController'
import { UserRepository } from './UserRepository'
import { UserValidatingDto } from './UserValidatingDto'

describe(UserController.name, () => {
  let userController: UserController
  let user1: UserValidatingDto

  beforeEach(async () => {
    const app = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserRepository],
    }).compile()
    userController = app.get(UserController)
    user1 = await userController.create({ email: 'donald.duck@example.com', fullName: 'Donald Duck' })
  })

  describe('getById', () => {
    it('should get a user by id', async () => {
      expect(await userController.getById(user1.id)).toStrictEqual(user1)
    })

    it('should throw a not found error if the id is not found', async () => {
      expect(userController.getById(uuid())).rejects.toBeInstanceOf(NotFoundError)
    })
  })
})
