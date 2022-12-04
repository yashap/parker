import { CoreClient } from '@parker/core-client'

export class UnauthenticatedCoreClientBuilder {
  public static build(): CoreClient {
    // TODO: provide a "tap 10 times" style workflow for setting the host
    return CoreClient.build({ baseUrl: 'http://localhost:3333' })
  }
}
