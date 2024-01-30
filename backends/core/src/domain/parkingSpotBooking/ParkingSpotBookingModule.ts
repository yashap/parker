import { Module } from '@nestjs/common'
import { ParkingSpotBookingController } from './ParkingSpotBookingController'
import { ParkingSpotBookingRepository } from './ParkingSpotBookingRepository'

@Module({
  controllers: [ParkingSpotBookingController],
  providers: [ParkingSpotBookingRepository],
})
export class ParkingSpotBookingModule {}
