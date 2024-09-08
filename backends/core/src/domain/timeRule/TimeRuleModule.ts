import { Module } from '@nestjs/common'
import { TimeRuleRepository } from './TimeRuleRepository'

@Module({
  providers: [TimeRuleRepository],
  exports: [TimeRuleRepository],
})
export class TimeRuleModule {}
