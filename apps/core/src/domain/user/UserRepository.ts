import { Injectable } from '@nestjs/common'
import { User as PrismaUser } from '@prisma/client'
import { BaseRepository } from '../../db/BaseRepository'
import { User, UserProps } from './User'

type CreateUserInput = Omit<UserProps, 'id'>
type UpdateUserInput = Partial<CreateUserInput>

@Injectable()
export class UserRepository extends BaseRepository {
  public async create(payload: CreateUserInput): Promise<User> {
    const prismaUser = await this.user.create({ data: payload })
    return UserRepository.userToDomain(prismaUser)
  }

  public async findById(id: string): Promise<User | undefined> {
    const prismaUser = await this.user.findUnique({ where: { id } })
    if (prismaUser === null) {
      return undefined
    }
    return UserRepository.userToDomain(prismaUser)
  }

  public async update(id: string, updates: UpdateUserInput): Promise<User> {
    const prismaUser = await this.user.update({ where: { id }, data: updates })
    return UserRepository.userToDomain(prismaUser)
  }

  public async delete(id: string): Promise<void> {
    await this.user.delete({ where: { id } })
  }

  private static userToDomain(prismaUser: PrismaUser): User {
    const user = new User({ ...prismaUser })
    return user
  }
}
