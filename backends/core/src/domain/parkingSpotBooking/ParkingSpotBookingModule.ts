import { Module } from '@nestjs/common'
import { DbModule } from 'src/db/DbModule'
import { ParkingSpotBookingController } from 'src/domain/parkingSpotBooking/ParkingSpotBookingController'

@Module({
  controllers: [ParkingSpotBookingController],
  imports: [DbModule],
})
export class ParkingSpotBookingModule {}
