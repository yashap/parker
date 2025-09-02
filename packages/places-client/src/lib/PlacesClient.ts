import {
  ApiAxiosInstance,
  ApiClient,
  ApiClientBuilder,
  AxiosConfig,
  AxiosInstanceBuilder,
  extractGetByIdResponse,
  extractListResponse,
} from '@parker/api-client-utils'
import { contract } from './contract'
import { PlaceDetailsDto, SearchPlaceSuggestionsRequest, SearchPlaceSuggestionsResponse } from './model'

export class PlacesClient {
  private client: ApiClient<typeof contract>

  public constructor(axiosInstance: ApiAxiosInstance) {
    this.client = ApiClientBuilder.build(contract, axiosInstance)
  }

  public static build(axiosConfig: AxiosConfig): PlacesClient {
    return new PlacesClient(AxiosInstanceBuilder.build(axiosConfig))
  }

  public readonly placeDetails = {
    get: (id: string): Promise<PlaceDetailsDto | undefined> => {
      return extractGetByIdResponse(this.client.placeDetails.get({ params: { id } }))
    },
  }

  public readonly placeSuggestions = {
    search: (request: SearchPlaceSuggestionsRequest): Promise<SearchPlaceSuggestionsResponse> => {
      return extractListResponse(this.client.placeSuggestions.search({ query: request }))
    },
  }
}
