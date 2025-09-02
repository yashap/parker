import { Module } from '@nestjs/common'
import { GoogleClient } from 'src/domain/google/GoogleClient'
import { PlaceDetailsController } from 'src/domain/placeDetails/PlaceDetailsController'

@Module({
  controllers: [PlaceDetailsController],
  providers: [GoogleClient],
})
export class PlaceDetailsModule {}
