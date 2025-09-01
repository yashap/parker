import {
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
import { config } from 'src/config'

export interface PlaceSuggestion {
  placeId: string
  label: string
  subLabel: string
}

@Injectable()
export class GoogleClientCache {
  private readonly logger = new Logger('GoogleClientCache')
  private readonly client: Client
  private readonly apiKey: string

  constructor() {
    this.client = new Client({})
    this.apiKey = config.googleMapsApiKey
  }

  public async getPlaceSuggestions(params: {
    search: string
    location?: { latitude: number; longitude: number }
    language?: string
    useStrictBounds?: boolean
    radius?: number
    limit?: number
  }): Promise<PlaceSuggestion[]> {
    try {
      const request: PlaceAutocompleteRequest = {
        params: {
          input: params.search,
          key: this.apiKey,
          ...(params.language && { language: params.language }),
          ...(params.location && { location: `${params.location.latitude},${params.location.longitude}` }),
          ...(params.useStrictBounds !== undefined && { strictbounds: params.useStrictBounds }),
          ...(params.radius !== undefined && { radius: params.radius }),
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
      const limitedPredictions = params.limit ? predictions.slice(0, params.limit) : predictions

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

  public async getPlaceDetails(placeId: string): Promise<{
    id: string
    name?: string
    location?: { latitude: number; longitude: number }
    address?: string
    addressComponents?: {
      number?: string
      street?: string
      sublocality?: string
      city?: string
      state?: string
      country?: string
      postal?: string
    }[]
  }> {
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

      // Parse address components
      const addressComponents: {
        number?: string
        street?: string
        sublocality?: string
        city?: string
        state?: string
        country?: string
        postal?: string
      }[] = []

      if (place.address_components) {
        const component: {
          number?: string
          street?: string
          sublocality?: string
          city?: string
          state?: string
          country?: string
          postal?: string
        } = {}

        for (const comp of place.address_components) {
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

        addressComponents.push(component)
      }

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
}
