import { PrismaClient } from '@prisma/client'
import { User } from './User'
import { UserRepository } from './UserRepository'

describe(UserRepository.name, () => {
  let userRepository: UserRepository
  let user1: User
  let user2: User

  beforeEach(async () => {
    userRepository = new UserRepository()
    user1 = await userRepository.create({ fullName: 'Donald Duck' })
    user2 = await userRepository.create({ fullName: 'The Tick' })
  })

  // TODO: abstract somewhere more general
  afterEach(async () => {
    const client = new PrismaClient()
    await client.$connect()
    await client.user.deleteMany()
  })

  describe('findById', () => {
    it('should find a user by id', async () => {
      expect(await userRepository.findById(user1.id)).toStrictEqual(user1)
    })
  })

  describe('findAll', () => {
    it('should all users', async () => {
      expect(await userRepository.findAll()).toEqual([user1, user2])
    })
  })

  describe('update', () => {
    it('should update a user', async () => {
      await userRepository.update(user1.id, { fullName: 'Updated Name' })
      expect(await userRepository.findById(user1.id)).toEqual(new User({ ...user1.toJSON(), fullName: 'Updated Name' }))
    })
  })

  describe('delete', () => {
    it('should delete a user', async () => {
      await userRepository.delete(user1.id)
      expect(await userRepository.findById(user1.id)).toBeUndefined()
    })
  })
})
