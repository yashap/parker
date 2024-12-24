import { Module } from '@nestjs/common'
import { DbModule } from '../../db/DbModule'
import { ParkingSpotController } from './ParkingSpotController'
import { ParkingSpotRepository } from './ParkingSpotRepository'

@Module({
  controllers: [ParkingSpotController],
  providers: [ParkingSpotRepository],
  imports: [DbModule],
})
export class ParkingSpotModule {}
