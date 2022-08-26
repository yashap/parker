import { Module } from '@nestjs/common'
import { ParkingSpotController } from './ParkingSpotController'
import { ParkingSpotRepository } from './ParkingSpotRepository'

@Module({
  imports: [],
  controllers: [ParkingSpotController],
  providers: [ParkingSpotRepository],
})
export class ParkingSpotModule {}
