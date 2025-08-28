import {
  Client,
  PlaceAutocompleteRequest,
  PlaceAutocompleteResponse,
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
}
