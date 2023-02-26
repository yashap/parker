import { Injectable } from '@nestjs/common'
import { Selectable } from 'kysely'
import { pick } from 'lodash'
import { BaseRepository } from '../../db/BaseRepository'
import { User as UserDao } from '../../db/generated/db'
import { User } from './User'

type CreateUserInput = Omit<User, 'id'>
type UpdateUserInput = Partial<CreateUserInput>

@Injectable()
export class UserRepository extends BaseRepository {
  public async create(payload: CreateUserInput): Promise<User> {
    const userDao = await this.db
      .insertInto('User')
      .values({ ...payload, ...this.updatedAt() })
      .returningAll()
      .executeTakeFirstOrThrow()
    return UserRepository.userToDomain(userDao)
  }

  public async getById(id: string): Promise<User | undefined> {
    const userDao = await this.db.selectFrom('User').selectAll().where('id', '=', id).executeTakeFirst()
    return userDao ? UserRepository.userToDomain(userDao) : undefined
  }

  public async update(id: string, updates: UpdateUserInput): Promise<User> {
    const userDao = await this.db
      .updateTable('User')
      .set({
        ...updates,
        ...this.updatedAt(),
      })
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow()
    return UserRepository.userToDomain(userDao)
  }

  public async delete(id: string): Promise<void> {
    await this.db.deleteFrom('User').where('id', '=', id).executeTakeFirst()
  }

  private static userToDomain(userDao: Selectable<UserDao>): User {
    return pick(userDao, ['id', 'fullName', 'email'])
  }
}
