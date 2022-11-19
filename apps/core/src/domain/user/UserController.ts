import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common'
import { BaseController } from '../../http/BaseController'
import { CreateUserDto, UserDto, UpdateUserDto } from './UserDto'
import { UserRepository } from './UserRepository'

@Controller('users')
export class UserController extends BaseController {
  constructor(private readonly userRepository: UserRepository) {
    super('User')
  }

  @Post()
  public async create(@Body() createUserDto: CreateUserDto): Promise<UserDto> {
    const user = await this.userRepository.create({ ...createUserDto })
    return UserDto.buildFromDomain(user)
  }

  @Get(':id')
  public async getById(@Param('id', ParseUUIDPipe) id: string): Promise<UserDto> {
    const user = this.getEntityOrNotFound(await this.userRepository.getById(id))
    return UserDto.buildFromDomain(user)
  }

  @Patch(':id')
  public async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto): Promise<UserDto> {
    const updatedUser = await this.userRepository.update(id, { ...updateUserDto })
    return UserDto.buildFromDomain(updatedUser)
  }

  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<void> {
    await this.userRepository.delete(id)
  }
}
