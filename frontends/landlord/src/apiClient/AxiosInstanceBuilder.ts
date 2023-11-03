import { AxiosConfig, AxiosInstanceBuilder as LibAxiosInstanceBuilder } from '@parker/api-client-utils'
import { AxiosInstance } from 'axios'
import SuperTokens from 'supertokens-react-native'

export class AxiosInstanceBuilder {
  public static build(axiosConfig: AxiosConfig): AxiosInstance {
    const axiosInstance = LibAxiosInstanceBuilder.build(axiosConfig)
    SuperTokens.addAxiosInterceptors(axiosInstance)
    return axiosInstance
  }
}
