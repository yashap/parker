import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common'
import { BaseController } from '../../http/BaseController'
import { UserRepository } from './UserRepository'
import { CreateUserValidatingDto, UserValidatingDto, UpdateUserValidatingDto } from './UserValidatingDto'

@Controller('users')
export class UserController extends BaseController {
  constructor(private readonly userRepository: UserRepository) {
    super('User')
  }

  @Post()
  public async create(@Body() createUserDto: CreateUserValidatingDto): Promise<UserValidatingDto> {
    const user = await this.userRepository.create({ ...createUserDto })
    return UserValidatingDto.buildFromDomain(user)
  }

  @Get(':id')
  public async getById(@Param('id', ParseUUIDPipe) id: string): Promise<UserValidatingDto> {
    const user = this.getEntityOrNotFound(await this.userRepository.getById(id))
    return UserValidatingDto.buildFromDomain(user)
  }

  @Patch(':id')
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserValidatingDto
  ): Promise<UserValidatingDto> {
    const updatedUser = await this.userRepository.update(id, { ...updateUserDto })
    return UserValidatingDto.buildFromDomain(updatedUser)
  }

  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<void> {
    await this.userRepository.delete(id)
  }
}
