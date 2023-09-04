import { Injectable } from '@nestjs/common'
import { CreateUserRequest, UpdateUserRequest } from '@parker/core-client'
import { InputValidationError } from '@parker/errors'
import { Selectable } from 'kysely'
import { BaseRepository } from '../../db/BaseRepository'
import { User as UserDao } from '../../db/generated/db'
import { User } from './User'

type CreateUserInput = CreateUserRequest
type UpdateUserInput = UpdateUserRequest

@Injectable()
export class UserRepository extends BaseRepository {
  private readonly tableName = 'User' as const
  private readonly fields = ['id', 'fullName', 'email'] as const

  public create(payload: CreateUserInput): Promise<User> {
    return UserRepository.mapDuplicateEmailError(async () => {
      const userDao = await this.db
        .insertInto(this.tableName)
        .values({ ...UserRepository.sanitize(payload), ...this.updatedAt() })
        .returning(this.fields)
        .executeTakeFirstOrThrow()
      return UserRepository.userToDomain(userDao)
    })
  }

  public async getById(id: string): Promise<User | undefined> {
    const userDao = await this.db.selectFrom(this.tableName).select(this.fields).where('id', '=', id).executeTakeFirst()
    return userDao ? UserRepository.userToDomain(userDao) : undefined
  }

  public update(id: string, update: UpdateUserInput): Promise<User> {
    return UserRepository.mapDuplicateEmailError(async () => {
      const userDao = await this.db
        .updateTable(this.tableName)
        .set({
          ...UserRepository.sanitize(update),
          ...this.updatedAt(),
        })
        .where('id', '=', id)
        .returning(this.fields)
        .executeTakeFirstOrThrow()
      return UserRepository.userToDomain(userDao)
    })
  }

  public async delete(id: string): Promise<void> {
    await this.db.deleteFrom(this.tableName).where('id', '=', id).executeTakeFirst()
  }

  private static userToDomain(userDao: Pick<Selectable<UserDao>, 'id' | 'fullName' | 'email'>): User {
    // No transformation needed
    return userDao
  }

  // Strips trailing/leading whitespace. Doesn't change casing, because our index is already case insensitive
  private static sanitize<T extends { email?: string }>(payload: T): T {
    const { email: rawEmail, ...rest } = payload
    const email: string | undefined = rawEmail?.trim()
    return { email, ...rest } as T
  }

  private static async mapDuplicateEmailError<T>(callback: () => Promise<T>): Promise<T> {
    try {
      return await callback()
    } catch (error) {
      if ((error as Partial<Error>).message?.includes('duplicate key value violates unique constraint "email_idx"')) {
        throw new InputValidationError('Email already exists')
      }
      throw error
    }
  }
}
