import { CoreClient } from '@parker/core-client'
import { AuthenticationStore } from '../store/AuthenticationStore'

export class CoreClientBuilder {
  public static build(): CoreClient {
    // TODO: provide a "tap 10 times" style workflow for setting the host
    return CoreClient.build({ baseUrl: 'http://localhost:3501', token: AuthenticationStore.getToken() })
  }
}
