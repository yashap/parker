import { config } from '../config'
import { AuthClient } from './AuthClient'
import { AxiosInstanceBuilder } from './AxiosInstanceBuilder'

export class AuthClientBuilder {
  public static build(): AuthClient {
    return new AuthClient(
      AxiosInstanceBuilder.build({
        baseURL: `${config.coreUrl}/auth`,
      })
    )
  }
}
