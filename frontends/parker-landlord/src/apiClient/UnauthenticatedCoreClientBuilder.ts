import { CoreClient } from '@parker/core-client'

export class UnauthenticatedCoreClientBuilder {
  public static build(): CoreClient {
    return CoreClient.build({
      // TODO: provide a "tap 10 times" style workflow for setting the host
      baseURL: 'http://localhost:3501',
    })
  }
}
