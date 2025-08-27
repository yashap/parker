import { AuthClient } from 'src/apiClient/AuthClient'
import { AxiosInstanceBuilder } from 'src/apiClient/AxiosInstanceBuilder'
import { config } from 'src/config'

export class AuthClientBuilder {
  public static build(): AuthClient {
    return new AuthClient(
      AxiosInstanceBuilder.build({
        baseURL: `${config.parkingUrl}/auth`,
      })
    )
  }
}
