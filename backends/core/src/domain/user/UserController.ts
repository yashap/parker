import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common'
import { CreateUserRequestDto, UpdateUserRequestDto, UserDto } from '@parker/core-client'
import { BaseController } from '../../http/BaseController'
import { UserRepository } from './UserRepository'

@Controller('users')
export class UserController extends BaseController {
  constructor(private readonly userRepository: UserRepository) {
    super('User')
  }

  @Post()
  public async create(@Body() createUserDto: CreateUserRequestDto): Promise<UserDto> {
    return this.userRepository.create({ ...createUserDto })
  }

  @Get(':id')
  public async getById(@Param('id', ParseUUIDPipe) id: string): Promise<UserDto> {
    return this.getEntityOrNotFound(await this.userRepository.getById(id))
  }

  @Patch(':id')
  public async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserRequestDto): Promise<UserDto> {
    return this.userRepository.update(id, { ...updateUserDto })
  }

  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<void> {
    await this.userRepository.delete(id)
  }
}
