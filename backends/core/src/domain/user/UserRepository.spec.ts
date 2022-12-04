import { v4 as uuid } from 'uuid'
import { User } from './User'
import { UserRepository } from './UserRepository'

describe(UserRepository.name, () => {
  let userRepository: UserRepository
  let user: User

  beforeEach(async () => {
    userRepository = new UserRepository()
    user = await userRepository.create({ email: 'the.tick@example.com', fullName: 'The Tick' })
  })

  describe('getById', () => {
    it('should get a user by id', async () => {
      expect(await userRepository.getById(user.id)).toStrictEqual(user)
    })

    it('should return undefined if the user does not exist', async () => {
      expect(await userRepository.getById(uuid())).toBeUndefined()
    })
  })

  describe('update', () => {
    it('should update a user', async () => {
      await userRepository.update(user.id, { fullName: 'Updated Name' })
      expect(await userRepository.getById(user.id)).toEqual(user.set('fullName', 'Updated Name'))
    })
  })

  describe('delete', () => {
    it('should delete a user', async () => {
      await userRepository.delete(user.id)
      expect(await userRepository.getById(user.id)).toBeUndefined()
    })
  })
})
