import { Module } from '@nestjs/common'
import { TimeRuleModule } from '../timeRule'
import { TimeRuleOverrideModule } from '../timeRuleOverride'
import { ParkingSpotController } from './ParkingSpotController'
import { ParkingSpotRepository } from './ParkingSpotRepository'

@Module({
  controllers: [ParkingSpotController],
  providers: [ParkingSpotRepository],
  imports: [TimeRuleModule, TimeRuleOverrideModule],
})
export class ParkingSpotModule {}
