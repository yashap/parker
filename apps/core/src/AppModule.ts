import { Module } from '@nestjs/common'
import { ParkingSpotModule } from './domain/parkingSpot'

@Module({
  imports: [ParkingSpotModule],
})
export class AppModule {}
