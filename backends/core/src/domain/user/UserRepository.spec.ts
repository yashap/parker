import { InputValidationError } from '@parker/errors'
import { v4 as uuid } from 'uuid'
import { BaseRepository } from '../../db/BaseRepository'
import { User } from './User'
import { UserRepository } from './UserRepository'

describe(UserRepository.name, () => {
  let userRepository: UserRepository
  let user: User

  class UserReader extends BaseRepository {
    public async selectAll(): Promise<User[]> {
      return await this.db.selectFrom('User').selectAll().execute()
    }
  }

  beforeEach(async () => {
    userRepository = new UserRepository()
    const createUserInput = { email: 'the.tick@example.com', fullName: 'The Tick' }
    user = await userRepository.create(createUserInput)
    expect(user).toStrictEqual({
      id: user.id,
      ...createUserInput,
    })
  })

  describe('getById', () => {
    it('should get a user by id', async () => {
      expect(await userRepository.getById(user.id)).toStrictEqual(user)
    })

    it('should return undefined if the user does not exist', async () => {
      expect(await userRepository.getById(uuid())).toBeUndefined()
    })
  })

  describe('create', () => {
    it("doesn't allow creating duplicate emails, regardless of casing or other spaces", async () => {
      await expect(userRepository.create({ email: 'the.tick@example.com', fullName: 'The Tick 2' })).rejects.toThrow(
        new InputValidationError('Email already exists')
      )
      await expect(userRepository.create({ email: 'THE.TICK@EXAMPLE.COM', fullName: 'The Tick 3' })).rejects.toThrow(
        new InputValidationError('Email already exists')
      )
      await expect(userRepository.create({ email: ' the.tick@example.com ', fullName: 'The Tick 4' })).rejects.toThrow(
        new InputValidationError('Email already exists')
      )

      const allUsers = await new UserReader().selectAll()
      expect(allUsers).toHaveLength(1)
      const userAfterFailedWrites = allUsers[0]
      expect(userAfterFailedWrites?.id).toBe(user.id)
      expect(userAfterFailedWrites?.fullName).toBe(user.fullName)
      expect(userAfterFailedWrites?.email).toBe(user.email)
    })
  })

  describe('update', () => {
    it('should update a user', async () => {
      await userRepository.update(user.id, { fullName: 'Updated Name' })
      expect(await userRepository.getById(user.id)).toEqual({ ...user, fullName: 'Updated Name' })
    })

    it("doesn't allow creating duplicate emails, regardless of casing or other spaces", async () => {
      const hacker = await userRepository.create({ email: 'hacker@hacker.com', fullName: 'The Tick' })
      await expect(
        userRepository.update(hacker.id, { email: 'the.tick@example.com', fullName: 'The Tick 2' })
      ).rejects.toThrow(new InputValidationError('Email already exists'))
      await expect(
        userRepository.update(hacker.id, { email: 'THE.TICK@EXAMPLE.COM', fullName: 'The Tick 3' })
      ).rejects.toThrow(new InputValidationError('Email already exists'))
      await expect(
        userRepository.update(hacker.id, { email: ' the.tick@example.com ', fullName: 'The Tick 4' })
      ).rejects.toThrow(new InputValidationError('Email already exists'))

      const allUsers = await new UserReader().selectAll()
      const allUsersExceptInitial = allUsers.filter(({ id }) => id !== user.id)
      expect(allUsersExceptInitial).toHaveLength(1)
      const hackerAfterFailedWrites = allUsersExceptInitial[0]
      expect(hackerAfterFailedWrites?.id).toBe(hacker.id)
      expect(hackerAfterFailedWrites?.fullName).toBe(hacker.fullName)
      expect(hackerAfterFailedWrites?.email).toBe(hacker.email)
    })
  })

  describe('delete', () => {
    it('should delete a user', async () => {
      expect(await userRepository.getById(user.id)).toBeDefined()
      await userRepository.delete(user.id)
      expect(await userRepository.getById(user.id)).toBeUndefined()
    })
  })
})
