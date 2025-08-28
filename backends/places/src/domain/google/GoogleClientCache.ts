import {
  Client,
  PlaceAutocompleteRequest,
  PlaceAutocompleteResponse,
  Status,
} from '@googlemaps/google-maps-services-js'
import { Injectable } from '@nestjs/common'
import { InternalServerError } from '@parker/errors'
import { Logger } from '@parker/logging'
import { v4 as uuidv4 } from 'uuid'
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
      // Build params object dynamically to avoid passing undefined values
      const requestParams: PlaceAutocompleteRequest['params'] = {
        input: params.search,
        key: this.apiKey,
      }

      // Only add optional parameters if they are defined
      if (params.language) {
        requestParams.language = params.language
      }

      if (params.location) {
        requestParams.location = `${params.location.latitude},${params.location.longitude}`
      }

      if (params.useStrictBounds !== undefined) {
        requestParams.strictbounds = params.useStrictBounds
      }

      if (params.radius !== undefined) {
        requestParams.radius = params.radius
      }

      const request: PlaceAutocompleteRequest = {
        params: requestParams,
      }

      this.logger.debug('Calling Google Places API with request', { request })

      const response: PlaceAutocompleteResponse = await this.client.placeAutocomplete(request)

      if (response.data.status !== Status.OK && response.data.status !== Status.ZERO_RESULTS) {
        throw new InternalServerError(`Google Places API error: ${response.data.status}`)
      }

      const predictions = response.data.predictions

      // Apply limit if specified
      const limitedPredictions = params.limit ? predictions.slice(0, params.limit) : predictions

      return limitedPredictions.map((prediction) => ({
        // For now, we generate a UUID for placeId. In a real implementation,
        // you might want to store Google place IDs and map them to UUIDs
        placeId: uuidv4(),
        label: prediction.structured_formatting.main_text || prediction.description,
        subLabel: prediction.structured_formatting.secondary_text || '',
      }))
    } catch (error) {
      this.logger.error('Error calling Google Places API', { error })
      throw error
    }
  }
}
