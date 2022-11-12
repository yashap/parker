import { Module } from '@nestjs/common'
import { UserController } from './UserController'
import { UserRepository } from './UserRepository'

@Module({
  controllers: [UserController],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class UserModule {}