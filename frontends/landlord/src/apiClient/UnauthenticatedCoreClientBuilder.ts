import { CoreClient } from '@parker/core-client'
import { config } from '../config'

export class UnauthenticatedCoreClientBuilder {
  public static build(): CoreClient {
    return CoreClient.build({
      baseURL: config.coreUrl,
    })
  }
}
