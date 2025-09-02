import {
  Client,
  Status,
  PlaceAutocompleteResponse,
  PlaceDetailsResponse,
  PlaceAutocompleteResponseData,
  PlaceDetailsResponseData,
} from '@googlemaps/google-maps-services-js'
import { InternalServerError } from '@parker/errors'
import { AxiosRequestHeaders, AxiosResponse } from 'axios'
import { config } from 'src/config'
import { GoogleClient } from 'src/domain/google/GoogleClient'

jest.mock('@googlemaps/google-maps-services-js')

const buildAxiosResponse = <T>(data: unknown): AxiosResponse<T> => ({
  data: data as T,
  status: 200,
  statusText: 'OK',
  headers: {},
  config: { headers: {} as unknown as AxiosRequestHeaders },
})

const buildAutocompleteResponse = (data: unknown): PlaceAutocompleteResponse =>
  buildAxiosResponse<PlaceAutocompleteResponseData>(data)

const buildDetailsResponse = (data: unknown): PlaceDetailsResponse => buildAxiosResponse<PlaceDetailsResponseData>(data)

describe('GoogleClient', () => {
  let googleClient: GoogleClient
  let mockClient: jest.Mocked<Pick<Client, 'placeAutocomplete' | 'placeDetails'>>
  const googleMapsApiKey = config.googleMapsApiKey

  beforeEach(() => {
    jest.clearAllMocks()
    mockClient = {
      placeAutocomplete: jest.fn(),
      placeDetails: jest.fn(),
    }
    const MockedClient = Client as jest.MockedClass<typeof Client>
    MockedClient.mockImplementation(() => mockClient as unknown as Client)
    googleClient = new GoogleClient()
  })

  describe('getPlaceSuggestions', () => {
    it('should return place suggestions for a basic search', async () => {
      const mockResponse = {
        data: {
          status: Status.OK,
          predictions: [
            {
              place_id: 'place-1',
              description: 'Full description 1',
              structured_formatting: {
                main_text: 'Main Place 1',
                secondary_text: 'Secondary info 1',
              },
            },
            {
              place_id: 'place-2',
              description: 'Full description 2',
              structured_formatting: {
                main_text: 'Main Place 2',
                secondary_text: 'Secondary info 2',
              },
            },
          ],
        },
      }

      mockClient.placeAutocomplete.mockResolvedValue(buildAutocompleteResponse(mockResponse.data))

      const result = await googleClient.getPlaceSuggestions({
        search: 'test search',
      })

      expect(mockClient.placeAutocomplete).toHaveBeenCalledWith({
        params: {
          input: 'test search',
          key: googleMapsApiKey,
        },
      })

      expect(result).toEqual([
        {
          placeId: 'place-1',
          label: 'Main Place 1',
          subLabel: 'Secondary info 1',
        },
        {
          placeId: 'place-2',
          label: 'Main Place 2',
          subLabel: 'Secondary info 2',
        },
      ])
    })

    it('should handle location-based search with radius and strict bounds', async () => {
      const mockResponse = {
        data: {
          status: Status.OK,
          predictions: [
            {
              place_id: 'place-1',
              description: 'Description',
              structured_formatting: {
                main_text: 'Place',
                secondary_text: 'Info',
              },
            },
          ],
        },
      }

      mockClient.placeAutocomplete.mockResolvedValue(buildAutocompleteResponse(mockResponse.data))

      const result = await googleClient.getPlaceSuggestions({
        search: 'test',
        location: { latitude: 40.7128, longitude: -74.006 },
        radius: 5000,
        useStrictBounds: true,
        language: 'en',
      })

      expect(mockClient.placeAutocomplete).toHaveBeenCalledWith({
        params: {
          input: 'test',
          key: googleMapsApiKey,
          language: 'en',
          location: '40.7128,-74.006',
          strictbounds: true,
          radius: 5000,
        },
      })

      expect(result).toHaveLength(1)
    })

    it('should apply limit to results when specified', async () => {
      const mockResponse = {
        data: {
          status: Status.OK,
          predictions: [
            {
              place_id: 'place-1',
              description: 'Description 1',
              structured_formatting: { main_text: 'Place 1', secondary_text: 'Info 1' },
            },
            {
              place_id: 'place-2',
              description: 'Description 2',
              structured_formatting: { main_text: 'Place 2', secondary_text: 'Info 2' },
            },
            {
              place_id: 'place-3',
              description: 'Description 3',
              structured_formatting: { main_text: 'Place 3', secondary_text: 'Info 3' },
            },
          ],
        },
      }

      mockClient.placeAutocomplete.mockResolvedValue(buildAutocompleteResponse(mockResponse.data))

      const result = await googleClient.getPlaceSuggestions({
        search: 'test',
        limit: 2,
      })

      expect(result).toHaveLength(2)
      expect(result[0]?.placeId).toBe('place-1')
      expect(result[1]?.placeId).toBe('place-2')
    })

    it('should handle missing structured formatting fields', async () => {
      const mockResponse = {
        data: {
          status: Status.OK,
          predictions: [
            {
              place_id: 'place-1',
              description: 'Full description',
              structured_formatting: {},
            },
          ],
        },
      }

      mockClient.placeAutocomplete.mockResolvedValue(buildAutocompleteResponse(mockResponse.data))

      const result = await googleClient.getPlaceSuggestions({
        search: 'test',
      })

      expect(result).toEqual([
        {
          placeId: 'place-1',
          label: 'Full description',
          subLabel: '',
        },
      ])
    })

    it('should handle ZERO_RESULTS status', async () => {
      const mockResponse = {
        data: {
          status: Status.ZERO_RESULTS,
          predictions: [],
        },
      }

      mockClient.placeAutocomplete.mockResolvedValue(buildAutocompleteResponse(mockResponse.data))

      const result = await googleClient.getPlaceSuggestions({
        search: 'test',
      })

      expect(result).toEqual([])
    })

    it('should throw InternalServerError for API errors', async () => {
      const mockResponse = {
        data: {
          status: Status.REQUEST_DENIED,
          predictions: [],
        },
      }

      mockClient.placeAutocomplete.mockResolvedValue(buildAutocompleteResponse(mockResponse.data))

      await expect(
        googleClient.getPlaceSuggestions({
          search: 'test',
        })
      ).rejects.toThrow(InternalServerError)
    })

    it('should propagate network errors', async () => {
      const networkError = new Error('Network error')
      mockClient.placeAutocomplete.mockRejectedValue(networkError)

      await expect(
        googleClient.getPlaceSuggestions({
          search: 'test',
        })
      ).rejects.toThrow(networkError)
    })

    it('should not include strictbounds param when location or radius is missing', async () => {
      const mockResponse = {
        data: {
          status: Status.OK,
          predictions: [],
        },
      }

      mockClient.placeAutocomplete.mockResolvedValue(buildAutocompleteResponse(mockResponse.data))

      // Case 1: useStrictBounds is true but no location
      await googleClient.getPlaceSuggestions({
        search: 'test',
        useStrictBounds: true,
        radius: 5000,
      })

      expect(mockClient.placeAutocomplete).toHaveBeenCalledWith({
        params: {
          input: 'test',
          key: googleMapsApiKey,
          radius: 5000,
        },
      })

      // Case 2: useStrictBounds is true and location exists but no radius
      await googleClient.getPlaceSuggestions({
        search: 'test',
        location: { latitude: 40.7128, longitude: -74.006 },
        useStrictBounds: true,
      })

      expect(mockClient.placeAutocomplete).toHaveBeenLastCalledWith({
        params: {
          input: 'test',
          key: googleMapsApiKey,
          location: '40.7128,-74.006',
        },
      })
    })
  })

  describe('getPlaceDetails', () => {
    it('should return place details with all fields', async () => {
      const mockResponse = {
        data: {
          status: Status.OK,
          result: {
            place_id: 'test-place-id',
            name: 'Test Place',
            formatted_address: '123 Test St, Test City, TC 12345',
            geometry: {
              location: {
                lat: 40.7128,
                lng: -74.006,
              },
            },
            address_components: [
              {
                long_name: '123',
                short_name: '123',
                types: ['street_number'],
              },
              {
                long_name: 'Test Street',
                short_name: 'Test St',
                types: ['route'],
              },
              {
                long_name: 'Test Sublocality',
                short_name: 'Test Sub',
                types: ['sublocality'],
              },
              {
                long_name: 'Test City',
                short_name: 'Test City',
                types: ['locality'],
              },
              {
                long_name: 'Test State',
                short_name: 'TS',
                types: ['administrative_area_level_1'],
              },
              {
                long_name: 'United States',
                short_name: 'US',
                types: ['country'],
              },
              {
                long_name: '12345',
                short_name: '12345',
                types: ['postal_code'],
              },
            ],
          },
        },
      }

      mockClient.placeDetails.mockResolvedValue(buildDetailsResponse(mockResponse.data))

      const result = await googleClient.getPlaceDetails('test-place-id')

      expect(mockClient.placeDetails).toHaveBeenCalledWith({
        params: {
          place_id: 'test-place-id',
          key: googleMapsApiKey,
          fields: ['place_id', 'name', 'formatted_address', 'geometry', 'address_components'],
        },
      })

      expect(result).toEqual({
        id: 'test-place-id',
        name: 'Test Place',
        location: {
          latitude: 40.7128,
          longitude: -74.006,
        },
        address: '123 Test St, Test City, TC 12345',
        addressComponents: [
          {
            number: '123',
            street: 'Test Street',
            sublocality: 'Test Sublocality',
            city: 'Test City',
            state: 'TS',
            country: 'United States',
            postal: '12345',
          },
        ],
      })
    })

    it('should handle missing optional fields', async () => {
      const mockResponse = {
        data: {
          status: Status.OK,
          result: {
            name: 'Test Place',
          },
        },
      }

      mockClient.placeDetails.mockResolvedValue(buildDetailsResponse(mockResponse.data))

      const result = await googleClient.getPlaceDetails('test-place-id')

      expect(result).toEqual({
        id: 'test-place-id',
        name: 'Test Place',
        location: undefined,
        address: undefined,
        addressComponents: undefined,
      })
    })

    it('should use provided placeId when result.place_id is missing', async () => {
      const mockResponse = {
        data: {
          status: Status.OK,
          result: {
            name: 'Test Place',
          },
        },
      }

      mockClient.placeDetails.mockResolvedValue(buildDetailsResponse(mockResponse.data))

      const result = await googleClient.getPlaceDetails('fallback-place-id')

      expect(result.id).toBe('fallback-place-id')
    })

    it('should handle sublocality_level_1 type for sublocality', async () => {
      const mockResponse = {
        data: {
          status: Status.OK,
          result: {
            place_id: 'test-place-id',
            name: 'Test Place',
            address_components: [
              {
                long_name: 'Test Sublocality Level 1',
                short_name: 'Test Sub L1',
                types: ['sublocality_level_1'],
              },
            ],
          },
        },
      }

      mockClient.placeDetails.mockResolvedValue(buildDetailsResponse(mockResponse.data))

      const result = await googleClient.getPlaceDetails('test-place-id')

      expect(result.addressComponents).toEqual([
        {
          sublocality: 'Test Sublocality Level 1',
        },
      ])
    })

    it('should return array with empty object for addressComponents when empty components provided', async () => {
      const mockResponse = {
        data: {
          status: Status.OK,
          result: {
            place_id: 'test-place-id',
            name: 'Test Place',
            address_components: [],
          },
        },
      }

      mockClient.placeDetails.mockResolvedValue(buildDetailsResponse(mockResponse.data))

      const result = await googleClient.getPlaceDetails('test-place-id')

      expect(result.addressComponents).toEqual([{}])
    })

    it('should return undefined for addressComponents when no components field exists', async () => {
      const mockResponse = {
        data: {
          status: Status.OK,
          result: {
            place_id: 'test-place-id',
            name: 'Test Place',
            // No address_components field
          },
        },
      }

      mockClient.placeDetails.mockResolvedValue(buildDetailsResponse(mockResponse.data))

      const result = await googleClient.getPlaceDetails('test-place-id')

      expect(result.addressComponents).toBeUndefined()
    })

    it('should handle components with unknown types', async () => {
      const mockResponse = {
        data: {
          status: Status.OK,
          result: {
            place_id: 'test-place-id',
            name: 'Test Place',
            address_components: [
              {
                long_name: 'Unknown Component',
                short_name: 'UC',
                types: ['unknown_type', 'political'],
              },
              {
                long_name: 'Test City',
                short_name: 'TC',
                types: ['locality'],
              },
            ],
          },
        },
      }

      mockClient.placeDetails.mockResolvedValue(buildDetailsResponse(mockResponse.data))

      const result = await googleClient.getPlaceDetails('test-place-id')

      expect(result.addressComponents).toEqual([
        {
          city: 'Test City',
        },
      ])
    })

    it('should throw InternalServerError for API errors', async () => {
      const mockResponse = {
        data: {
          status: Status.INVALID_REQUEST,
        },
      }

      mockClient.placeDetails.mockResolvedValue(buildDetailsResponse(mockResponse.data))

      await expect(googleClient.getPlaceDetails('test-place-id')).rejects.toThrow(InternalServerError)
    })

    it('should propagate network errors', async () => {
      const networkError = new Error('Network error')
      mockClient.placeDetails.mockRejectedValue(networkError)

      await expect(googleClient.getPlaceDetails('test-place-id')).rejects.toThrow(networkError)
    })
  })
})
