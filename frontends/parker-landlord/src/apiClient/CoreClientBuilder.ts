import { DefaultApiFactory, Configuration } from '@parker/core-client'
import { AuthenticationStore } from '../store/AuthenticationStore'

export class CoreClientBuilder {
  public static build() {
    // TODO: provide a "tap 10 times" style workflow for setting the host
    return DefaultApiFactory(
      new Configuration({
        basePath: 'http://localhost:3501/core',
        apiKey: AuthenticationStore.getToken(),
        baseOptions: {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      })
    )
  }
}
