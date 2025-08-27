import { Module } from '@nestjs/common'
import { PlaceSuggestionsController } from 'src/domain/placeSuggestions/PlaceSuggestionsController'

@Module({
  controllers: [PlaceSuggestionsController],
})
export class PlaceSuggestionsModule {}
