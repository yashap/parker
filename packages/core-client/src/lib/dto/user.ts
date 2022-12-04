export interface UserDto {
  id: string
  email: string
  fullName: string
}

export type CreateUserDto = Omit<UserDto, 'id'>

export type UpdateUserDto = Partial<CreateUserDto>
