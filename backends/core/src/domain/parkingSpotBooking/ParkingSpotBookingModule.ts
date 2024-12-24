import { Module } from '@nestjs/common'
import { DbModule } from '../../db/DbModule'
import { ParkingSpotBookingController } from './ParkingSpotBookingController'

@Module({
  controllers: [ParkingSpotBookingController],
  imports: [DbModule],
})
export class ParkingSpotBookingModule {}
