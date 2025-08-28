import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { SupertestInstance } from '@parker/api-client-test-utils'
import { MicroserviceAuthModule, NestAppBuilder, AuthGuard } from '@parker/nest-utils'
import { PlacesClient } from '@parker/places-client'
import { v4 as uuid } from 'uuid'
import { config } from 'src/config'
import { GoogleClientCache } from 'src/domain/google/GoogleClientCache'
import { PlaceSuggestionsController } from 'src/domain/placeSuggestions/PlaceSuggestionsController'
import { PlaceSuggestionsModule } from 'src/domain/placeSuggestions/PlaceSuggestionsModule'

describe(PlaceSuggestionsController.name, () => {
  let app: INestApplication
  let landlordUserId: string
  let placesClient: PlacesClient
  let mockGoogleClientCache: jest.Mocked<GoogleClientCache>

  beforeEach(async () => {
    landlordUserId = uuid()

    // Create a mock GoogleClientCache
    mockGoogleClientCache = {
      getPlaceSuggestions: jest.fn(),
    } as unknown as jest.Mocked<GoogleClientCache>

    // Build the test app with the mocked GoogleClientCache
    const moduleRef = await Test.createTestingModule({
      imports: [PlaceSuggestionsModule, MicroserviceAuthModule.forRoot(config.auth)],
    })
      .overrideProvider(GoogleClientCache)
      .useValue(mockGoogleClientCache)
      .compile()

    app = moduleRef.createNestApplication()
    NestAppBuilder.configureApp(app, undefined)
    await app.init()

    placesClient = new PlacesClient(
      new SupertestInstance(app.getHttpServer(), AuthGuard.buildTestAuthHeaders(landlordUserId))
    )
  })

  it('should return place suggestions with only search parameter', async () => {
    // Mock the Google API response
    const mockSuggestions = [
      {
        placeId: uuid(),
        label: '123 Main Street',
        subLabel: 'New York, NY, USA',
      },
      {
        placeId: uuid(),
        label: '123 Main Avenue',
        subLabel: 'Brooklyn, NY, USA',
      },
    ]
    mockGoogleClientCache.getPlaceSuggestions.mockResolvedValue(mockSuggestions)

    const suggestionsResponse = await placesClient.placeSuggestions.search({
      search: '123 Main St',
    })
    const suggestions = suggestionsResponse.data

    expect(suggestions).toEqual(mockSuggestions)
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockGoogleClientCache.getPlaceSuggestions).toHaveBeenCalledWith(
      expect.objectContaining({
        search: '123 Main St',
        location: undefined,
        language: undefined,
        useStrictBounds: undefined,
        radius: undefined,
        limit: undefined,
      })
    )
  })

  it('should return place suggestions with location parameter', async () => {
    const mockSuggestions = [
      {
        placeId: uuid(),
        label: '123 Main Street',
        subLabel: 'New York, NY, USA',
      },
    ]
    mockGoogleClientCache.getPlaceSuggestions.mockResolvedValue(mockSuggestions)

    const suggestionsResponse = await placesClient.placeSuggestions.search({
      search: '123 Main St',
      location: { latitude: 40.7128, longitude: -74.006 }, // New York coordinates
    })
    const suggestions = suggestionsResponse.data

    expect(suggestions).toEqual(mockSuggestions)
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockGoogleClientCache.getPlaceSuggestions).toHaveBeenCalledWith(
      expect.objectContaining({
        search: '123 Main St',
        location: { latitude: 40.7128, longitude: -74.006 },
        language: undefined,
        useStrictBounds: undefined,
        radius: undefined,
        limit: undefined,
      })
    )
  })

  it('should return place suggestions with all optional parameters', async () => {
    const mockSuggestions = [
      {
        placeId: uuid(),
        label: '123 Main Street',
        subLabel: 'New York, NY, USA',
      },
    ]
    mockGoogleClientCache.getPlaceSuggestions.mockResolvedValue(mockSuggestions)

    const suggestionsResponse = await placesClient.placeSuggestions.search({
      search: '123 Main St',
      location: { latitude: 40.7128, longitude: -74.006 },
      language: 'en',
      useStrictBounds: true,
      radius: 5000,
      limit: 5,
    })
    const suggestions = suggestionsResponse.data

    expect(suggestions).toEqual(mockSuggestions)
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockGoogleClientCache.getPlaceSuggestions).toHaveBeenCalledWith(
      expect.objectContaining({
        search: '123 Main St',
        location: { latitude: 40.7128, longitude: -74.006 },
        language: 'en',
        useStrictBounds: true,
        radius: 5000,
        limit: 5,
      })
    )
  })

  it('should return empty array when no suggestions found', async () => {
    mockGoogleClientCache.getPlaceSuggestions.mockResolvedValue([])

    const suggestionsResponse = await placesClient.placeSuggestions.search({
      search: 'zzzzzzz',
    })
    const suggestions = suggestionsResponse.data

    expect(suggestions).toEqual([])
  })
})
