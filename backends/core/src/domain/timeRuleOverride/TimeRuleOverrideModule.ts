import { Module } from '@nestjs/common'
import { TimeRuleOverrideRepository } from './TimeRuleOverrideRepository'

@Module({
  providers: [TimeRuleOverrideRepository],
  exports: [TimeRuleOverrideRepository],
})
export class TimeRuleOverrideModule {}
