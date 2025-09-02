import { ParkingClient } from '@parker/parking-client'
import { AxiosInstanceBuilder } from 'src/apiClient/AxiosInstanceBuilder'
import { config } from 'src/config'

export class ParkingClientBuilder {
  public static build() {
    return new ParkingClient(
      AxiosInstanceBuilder.build({
        baseURL: config.parkingUrl,
      })
    )
  }
}
