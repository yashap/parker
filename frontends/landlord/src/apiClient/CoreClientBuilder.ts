import { CoreClient } from '@parker/core-client'
import { AxiosInstanceBuilder } from 'src/apiClient/AxiosInstanceBuilder'
import { config } from 'src/config'

export class CoreClientBuilder {
  public static build() {
    return new CoreClient(
      AxiosInstanceBuilder.build({
        baseURL: config.coreUrl,
      })
    )
  }
}
