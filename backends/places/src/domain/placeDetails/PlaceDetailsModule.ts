import { Module } from '@nestjs/common'
import { GoogleClientCache } from 'src/domain/google/GoogleClientCache'
import { PlaceDetailsController } from 'src/domain/placeDetails/PlaceDetailsController'

@Module({
  controllers: [PlaceDetailsController],
  providers: [GoogleClientCache],
})
export class PlaceDetailsModule {}
