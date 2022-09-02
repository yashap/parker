import { User } from './User'
import { UserRepository } from './UserRepository'

describe(UserRepository.name, () => {
  let userRepository: UserRepository
  let user: User

  beforeEach(async () => {
    userRepository = new UserRepository()
    user = await userRepository.create({ fullName: 'The Tick' })
  })

  describe('findById', () => {
    it('should find a user by id', async () => {
      expect(await userRepository.findById(user.id)).toStrictEqual(user)
    })
  })

  describe('update', () => {
    it('should update a user', async () => {
      await userRepository.update(user.id, { fullName: 'Updated Name' })
      expect(await userRepository.findById(user.id)).toEqual(user.set('fullName', 'Updated Name'))
    })
  })

  describe('delete', () => {
    it('should delete a user', async () => {
      await userRepository.delete(user.id)
      expect(await userRepository.findById(user.id)).toBeUndefined()
    })
  })
})
