import { CoreClient } from '@parker/core-client'
import { config } from '../config'
import { AxiosInstanceBuilder } from './AxiosInstanceBuilder'

export class CoreClientBuilder {
  public static build() {
    return new CoreClient(
      AxiosInstanceBuilder.build({
        baseURL: config.coreUrl,
      })
    )
  }
}
