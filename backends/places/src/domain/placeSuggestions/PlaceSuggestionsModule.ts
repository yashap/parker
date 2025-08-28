import { Module } from '@nestjs/common'
import { GoogleClientCache } from 'src/domain/google/GoogleClientCache'
import { PlaceSuggestionsController } from 'src/domain/placeSuggestions/PlaceSuggestionsController'

@Module({
  controllers: [PlaceSuggestionsController],
  providers: [GoogleClientCache],
})
export class PlaceSuggestionsModule {}
