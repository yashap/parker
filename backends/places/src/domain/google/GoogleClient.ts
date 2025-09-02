import {
  AddressComponent as GoogleAddressComponent,
  Client,
  PlaceAutocompleteRequest,
  PlaceAutocompleteResponse,
  PlaceDetailsRequest,
  PlaceDetailsResponse,
  Status,
} from '@googlemaps/google-maps-services-js'
import { Injectable } from '@nestjs/common'
import { InternalServerError } from '@parker/errors'
import { Logger } from '@parker/logging'
import {
  AddressComponentsDto,
  PlaceDetailsDto,
  PlaceSuggestionDto,
  SearchPlaceSuggestionsRequest,
} from '@parker/places-client'
import { config } from 'src/config'

export type PlaceSuggestion = PlaceSuggestionDto
export type PlaceDetails = PlaceDetailsDto
export type AddressComponents = AddressComponentsDto

export type GetPlaceSuggestionsParams = Omit<SearchPlaceSuggestionsRequest, 'latitude' | 'longitude'> & {
  location?: { latitude: number; longitude: number }
}

@Injectable()
export class GoogleClient {
  private readonly logger = new Logger('GoogleClientCache')
  private readonly client: Client
  private readonly apiKey: string

  constructor() {
    this.client = new Client({})
    this.apiKey = config.googleMapsApiKey
  }

  public async getPlaceSuggestions({
    search,
    location,
    language,
    useStrictBounds,
    radius,
    limit,
  }: GetPlaceSuggestionsParams): Promise<PlaceSuggestion[]> {
    try {
      const request: PlaceAutocompleteRequest = {
        params: {
          input: search,
          key: this.apiKey,
          ...(language && { language }),
          ...(location && { location: `${location.latitude},${location.longitude}` }),
          ...(useStrictBounds !== undefined && location && radius !== undefined && { strictbounds: useStrictBounds }),
          ...(radius !== undefined && { radius }),
        },
      }

      this.logger.debug('Calling Google Places API with request', { request })

      const response: PlaceAutocompleteResponse = await this.client.placeAutocomplete(request)

      // TODO: maybe better error handling here?
      if (response.data.status !== Status.OK && response.data.status !== Status.ZERO_RESULTS) {
        throw new InternalServerError(`Google Places API error: ${response.data.status}`)
      }

      const predictions = response.data.predictions

      // Apply limit if specified
      const limitedPredictions = limit ? predictions.slice(0, limit) : predictions

      return limitedPredictions.map((prediction) => ({
        placeId: prediction.place_id,
        label: prediction.structured_formatting.main_text || prediction.description,
        subLabel: prediction.structured_formatting.secondary_text || '',
      }))
    } catch (error) {
      this.logger.error('Error calling Google Places API', { error })
      throw error
    }
  }

  public async getPlaceDetails(placeId: string): Promise<PlaceDetails> {
    try {
      const request: PlaceDetailsRequest = {
        params: {
          place_id: placeId,
          key: this.apiKey,
          fields: ['place_id', 'name', 'formatted_address', 'geometry', 'address_components'],
        },
      }

      this.logger.debug('Calling Google Places Details API with request', { request })

      const response: PlaceDetailsResponse = await this.client.placeDetails(request)

      if (response.data.status !== Status.OK) {
        throw new InternalServerError(`Google Places Details API error: ${response.data.status}`)
      }

      const place = response.data.result

      const addressComponents = this.parseAddressComponents(place.address_components)

      return {
        id: place.place_id ?? placeId,
        name: place.name,
        location: place.geometry?.location
          ? {
              latitude: place.geometry.location.lat,
              longitude: place.geometry.location.lng,
            }
          : undefined,
        address: place.formatted_address,
        addressComponents: addressComponents.length > 0 ? addressComponents : undefined,
      }
    } catch (error) {
      this.logger.error('Error calling Google Places Details API', { error })
      throw error
    }
  }

  private parseAddressComponents(components?: GoogleAddressComponent[]): AddressComponents[] {
    const addressComponents: AddressComponents[] = []

    if (components) {
      const component: AddressComponents = {}

      for (const comp of components) {
        const types = comp.types

        // Cast to string[] to match Google Maps types
        const typesArray = types as string[]

        if (typesArray.includes('street_number')) {
          component.number = comp.short_name
        } else if (typesArray.includes('route')) {
          component.street = comp.long_name
        } else if (typesArray.includes('sublocality') || typesArray.includes('sublocality_level_1')) {
          component.sublocality = comp.long_name
        } else if (typesArray.includes('locality')) {
          component.city = comp.long_name
        } else if (typesArray.includes('administrative_area_level_1')) {
          component.state = comp.short_name
        } else if (typesArray.includes('country')) {
          component.country = comp.long_name
        } else if (typesArray.includes('postal_code')) {
          component.postal = comp.short_name
        }
      }

      // TODO: is there ever going to be more than one component?
      addressComponents.push(component)
    }

    return addressComponents
  }
}
