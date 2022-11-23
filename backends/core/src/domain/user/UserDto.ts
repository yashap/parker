import { OmitType, PartialType } from '@nestjs/mapped-types'
import { IsUUID, IsNotEmpty } from 'class-validator'
import { User, UserProps } from './User'

export type UserDtoProps = UserProps

export class UserDto {
  constructor({ id, fullName }: UserProps) {
    this.id = id
    this.fullName = fullName
  }

  public static buildFromDomain(user: User): UserDto {
    return new UserDto(user)
  }

  @IsUUID()
  public readonly id: string

  @IsNotEmpty()
  public readonly fullName: string
}

export class CreateUserDto extends OmitType(UserDto, ['id'] as const) {}

export class UpdateUserDto extends PartialType(CreateUserDto) {}
