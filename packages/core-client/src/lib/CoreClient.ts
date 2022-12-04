import { ApiClient, ApiClientConfig } from '@parker/api-client'
import { ParkingSpotResource } from './resource/ParkingSpotResource'
import { UserResource } from './resource/UserResource'

export class CoreClient {
  public parkingSpots: ParkingSpotResource
  public users: UserResource

  constructor(apiClient: ApiClient) {
    this.parkingSpots = new ParkingSpotResource(apiClient)
    this.users = new UserResource(apiClient)
  }

  public static build(config: ApiClientConfig): CoreClient {
    const finalConfig: ApiClientConfig = {
      ...config,
      baseUrl: `${config.baseUrl}/core`,
    }
    return new CoreClient(ApiClient.build(finalConfig))
  }
}
