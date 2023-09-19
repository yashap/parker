import { CoreClient } from '@parker/core-client'
import { config } from '../config'
import { AuthenticationStore } from '../store/AuthenticationStore'

export class CoreClientBuilder {
  public static build() {
    return CoreClient.build({
      baseURL: config.coreUrl,
      token: AuthenticationStore.getToken(),
    })
  }
}
