import { AppInfo } from 'supertokens-node/types'

export const ConfigInjectionToken = 'ConfigInjectionToken'

export type AuthConfig = {
  appInfo: AppInfo
  connectionURI: string
  apiKey?: string
}

export interface Configuration {
  environment: 'dev' | 'prod'
  port: number
  auth: AuthConfig
}
