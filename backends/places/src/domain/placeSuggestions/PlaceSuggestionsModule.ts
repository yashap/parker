import { Module } from '@nestjs/common'
import { GoogleClient } from 'src/domain/google/GoogleClient'
import { PlaceSuggestionsController } from 'src/domain/placeSuggestions/PlaceSuggestionsController'

@Module({
  controllers: [PlaceSuggestionsController],
  providers: [GoogleClient],
})
export class PlaceSuggestionsModule {}
