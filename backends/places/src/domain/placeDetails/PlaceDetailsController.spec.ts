import { INestApplication } from '@nestjs/common'
import { Test } from '@nestjs/testing'
import { SupertestInstance } from '@parker/api-client-test-utils'
import { MicroserviceAuthModule, NestAppBuilder, AuthGuard } from '@parker/nest-utils'
import { PlacesClient } from '@parker/places-client'
import { addTemporalEqualityTesters } from '@parker/test-utils'
import { v4 as uuid } from 'uuid'
import { config } from 'src/config'
import { GoogleClientCache } from 'src/domain/google/GoogleClientCache'
import { PlaceDetailsController } from 'src/domain/placeDetails/PlaceDetailsController'
import { PlaceDetailsModule } from 'src/domain/placeDetails/PlaceDetailsModule'
import { PlaceSuggestionsModule } from 'src/domain/placeSuggestions'

describe(PlaceDetailsController.name, () => {
  let app: INestApplication
  let landlordUserId: string
  let placesClient: PlacesClient
  let mockGoogleClientCache: {
    getPlaceSuggestions: jest.Mock
    getPlaceDetails: jest.Mock
  }

  beforeEach(async () => {
    landlordUserId = uuid()
    addTemporalEqualityTesters()

    // Create a mock GoogleClientCache
    mockGoogleClientCache = {
      getPlaceSuggestions: jest.fn(),
      getPlaceDetails: jest.fn(),
    }

    // Build the test app with the mocked GoogleClientCache
    const moduleRef = await Test.createTestingModule({
      imports: [PlaceSuggestionsModule, PlaceDetailsModule, MicroserviceAuthModule.forRoot(config.auth)],
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

  afterEach(async () => {
    await app.close()
  })

  describe('GET /placeDetails/:id', () => {
    it('should return place details when place is found', async () => {
      const placeId = 'ChIJN1t_tDeuEmsRUsoyG83frY4'
      const mockPlaceDetails = {
        id: placeId,
        name: 'Google Sydney',
        location: {
          latitude: -33.8670522,
          longitude: 151.1957362,
        },
        address: '48 Pirrama Rd, Pyrmont NSW 2009, Australia',
        addressComponents: [
          {
            number: '48',
            street: 'Pirrama Road',
            sublocality: 'Pyrmont',
            city: 'Sydney',
            state: 'NSW',
            country: 'Australia',
            postal: '2009',
          },
        ],
      }

      mockGoogleClientCache.getPlaceDetails.mockResolvedValue(mockPlaceDetails)

      const result = await placesClient.placeDetails.get(placeId)

      expect(result).toBeDefined()
      expect(result).toEqual(mockPlaceDetails)
      expect(mockGoogleClientCache.getPlaceDetails).toHaveBeenCalledWith(placeId)
    })

    it('should return undefined when Google API throws an error', async () => {
      const placeId = 'invalid-place-id'
      mockGoogleClientCache.getPlaceDetails.mockRejectedValue(new Error('Place not found'))

      const result = await placesClient.placeDetails.get(placeId)

      expect(result).toBeUndefined()
      expect(mockGoogleClientCache.getPlaceDetails).toHaveBeenCalledWith(placeId)
    })
  })
})
