import { Module } from '@nestjs/common'
import { ParkingSpotController } from './ParkingSpotController'
import { ParkingSpotRepository } from './ParkingSpotRepository'

@Module({
  controllers: [ParkingSpotController],
  providers: [ParkingSpotRepository],
})
export class ParkingSpotModule {}
