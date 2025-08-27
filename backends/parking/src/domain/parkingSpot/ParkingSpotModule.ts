import { Module } from '@nestjs/common'
import { DbModule } from 'src/db/DbModule'
import { ParkingSpotController } from 'src/domain/parkingSpot/ParkingSpotController'
import { ParkingSpotRepository } from 'src/domain/parkingSpot/ParkingSpotRepository'

@Module({
  controllers: [ParkingSpotController],
  providers: [ParkingSpotRepository],
  imports: [DbModule],
})
export class ParkingSpotModule {}
