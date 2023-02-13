import { Injectable } from '@nestjs/common'
import { User as PrismaUser } from '@prisma/client'
import { pick } from 'lodash'
import { BaseRepository } from '../../db/BaseRepository'
import { User } from './User'

type CreateUserInput = Omit<User, 'id'>
type UpdateUserInput = Partial<CreateUserInput>

@Injectable()
export class UserRepository extends BaseRepository {
  public async create(payload: CreateUserInput): Promise<User> {
    const prismaUser = await this.prisma.user.create({ data: payload })
    return UserRepository.userToDomain(prismaUser)
  }

  public async getById(id: string): Promise<User | undefined> {
    const prismaUser = await this.prisma.user.findUnique({ where: { id } })
    if (prismaUser === null) {
      return undefined
    }
    return UserRepository.userToDomain(prismaUser)
  }

  public async update(id: string, updates: UpdateUserInput): Promise<User> {
    const prismaUser = await this.prisma.user.update({ where: { id }, data: updates })
    return UserRepository.userToDomain(prismaUser)
  }

  public async delete(id: string): Promise<void> {
    await this.prisma.user.delete({ where: { id } })
  }

  private static userToDomain(prismaUser: PrismaUser): User {
    return pick(prismaUser, ['id', 'fullName', 'email'])
  }
}
