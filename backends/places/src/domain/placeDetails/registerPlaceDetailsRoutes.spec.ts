import { FastifyInjectInstance } from '@parker/api-client-test-utils'
import { buildTestAuthHeaders } from '@parker/fastify-utils'
import { PlacesClient } from '@parker/places-client'
import { addTemporalEqualityTesters } from '@parker/test-utils'
import type { FastifyInstance } from 'fastify'
import { v4 as uuid } from 'uuid'
import { afterEach, beforeEach, describe, expect, it, vi, type Mock } from 'vitest'
import { GoogleClient } from 'src/domain/google/GoogleClient'
import { registerPlaceDetailsRoutes } from 'src/domain/placeDetails/registerPlaceDetailsRoutes'
import { buildTestApp } from 'src/test/buildTestApp'

describe(registerPlaceDetailsRoutes.name, () => {
  let app: FastifyInstance
  let landlordUserId: string
  let placesClient: PlacesClient
  let mockGoogleClientCache: {
    getPlaceSuggestions: Mock
    getPlaceDetails: Mock
  }

  beforeEach(async () => {
    landlordUserId = uuid()
    addTemporalEqualityTesters()

    // Create a mock GoogleClientCache
    mockGoogleClientCache = {
      getPlaceSuggestions: vi.fn(),
      getPlaceDetails: vi.fn(),
    }

    // Build the test app with the mocked GoogleClientCache
    app = await buildTestApp({ googleClient: mockGoogleClientCache as unknown as GoogleClient })

    placesClient = new PlacesClient(new FastifyInjectInstance(app, buildTestAuthHeaders(landlordUserId)))
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
