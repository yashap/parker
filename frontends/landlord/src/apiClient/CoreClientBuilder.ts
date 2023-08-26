import { CoreClient } from '@parker/core-client'
import { AuthenticationStore } from '../store/AuthenticationStore'

export class CoreClientBuilder {
  public static build() {
    return CoreClient.build({
      // TODO: provide a "tap 10 times" style workflow for setting the host
      baseURL: 'http://localhost:3501',
      token: AuthenticationStore.getToken(),
    })
  }
}
