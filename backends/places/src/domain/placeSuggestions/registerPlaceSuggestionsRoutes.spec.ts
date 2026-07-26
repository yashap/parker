import { FastifyInjectInstance } from '@parker/api-client-test-utils'
import { buildTestAuthHeaders } from '@parker/fastify-utils'
import { PlacesClient } from '@parker/places-client'
import type { FastifyInstance } from 'fastify'
import { v4 as uuid } from 'uuid'
import { afterEach, beforeEach, describe, expect, it, vi, type Mocked } from 'vitest'
import { GoogleClient } from 'src/domain/google/GoogleClient'
import { registerPlaceSuggestionsRoutes } from 'src/domain/placeSuggestions/registerPlaceSuggestionsRoutes'
import { buildTestApp } from 'src/test/buildTestApp'

describe(registerPlaceSuggestionsRoutes.name, () => {
  let app: FastifyInstance
  let landlordUserId: string
  let placesClient: PlacesClient
  let mockGoogleClientCache: Mocked<GoogleClient>

  beforeEach(async () => {
    landlordUserId = uuid()

    // Create a mock GoogleClientCache
    mockGoogleClientCache = {
      getPlaceSuggestions: vi.fn(),
    } as unknown as Mocked<GoogleClient>

    // Build the test app with the mocked GoogleClientCache
    app = await buildTestApp({ googleClient: mockGoogleClientCache })

    placesClient = new PlacesClient(new FastifyInjectInstance(app, buildTestAuthHeaders(landlordUserId)))
  })

  afterEach(async () => {
    await app.close()
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
      latitude: 40.7128,
      longitude: -74.006, // New York coordinates
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
      latitude: 40.7128,
      longitude: -74.006,
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
