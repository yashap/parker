import { OmitType, PartialType } from '@nestjs/mapped-types'
import { CreateUserDto, UpdateUserDto, UserDto } from '@parker/core-client'
import { IsUUID, IsNotEmpty, IsEmail } from 'class-validator'
import { User } from './User'

export class UserValidatingDto implements UserDto {
  constructor({ id, email, fullName }: UserDto) {
    this.id = id
    this.email = email
    this.fullName = fullName
  }

  public static buildFromDomain(user: User): UserValidatingDto {
    return new UserValidatingDto(user)
  }

  @IsUUID()
  public readonly id: string

  @IsEmail()
  public readonly email: string

  @IsNotEmpty()
  public readonly fullName: string
}

export class CreateUserValidatingDto extends OmitType(UserValidatingDto, ['id'] as const) implements CreateUserDto {}

export class UpdateUserValidatingDto extends PartialType(CreateUserValidatingDto) implements UpdateUserDto {}
