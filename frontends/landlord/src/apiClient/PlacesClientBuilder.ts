import { PlacesClient } from '@parker/places-client'
import { AxiosInstanceBuilder } from 'src/apiClient/AxiosInstanceBuilder'
import { config } from 'src/config'

export class PlacesClientBuilder {
  public static build() {
    return new PlacesClient(
      AxiosInstanceBuilder.build({
        baseURL: config.placesUrl,
      })
    )
  }
}
