import { ApiClient, ApiClientConfig } from '@parker/api-client'
import { ParkingSpotResource } from './resource/ParkingSpotResource'

export class CoreClient {
  public parkingSpots: ParkingSpotResource

  constructor(apiClient: ApiClient) {
    this.parkingSpots = new ParkingSpotResource(apiClient)
  }

  public static build(config: ApiClientConfig): CoreClient {
    return new CoreClient(ApiClient.build(config))
  }
}
