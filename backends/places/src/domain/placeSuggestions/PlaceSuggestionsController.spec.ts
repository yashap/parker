import { INestApplication } from '@nestjs/common'
import { SupertestInstance } from '@parker/api-client-test-utils'
import { AuthGuard } from '@parker/nest-utils'
import { PlacesClient } from '@parker/places-client'
import { v4 as uuid } from 'uuid'
import { PlaceSuggestionsController } from 'src/domain/placeSuggestions/PlaceSuggestionsController'
import { buildTestApp } from 'src/test/buildTestApp'

describe(PlaceSuggestionsController.name, () => {
  let app: INestApplication
  let landlordUserId: string
  let placesClient: PlacesClient

  beforeEach(async () => {
    landlordUserId = uuid()

    app = await buildTestApp()
    placesClient = new PlacesClient(
      new SupertestInstance(app.getHttpServer(), AuthGuard.buildTestAuthHeaders(landlordUserId))
    )
  })

  it('should return place suggestions', async () => {
    const suggestionsResponse = await placesClient.placeSuggestions.search({
      search: '123 Main St',
    })
    const suggestions = suggestionsResponse.data
    expect(suggestions).toStrictEqual([])
  })
})
