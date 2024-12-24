import { Module } from '@nestjs/common'
import { Db } from './Db'

@Module({
  providers: [Db],
  exports: [Db],
})
export class DbModule {}
