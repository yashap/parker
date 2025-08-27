import { AuthModuleConfig } from '@parker/nest-utils'

export interface Configuration {
  environment: 'dev' | 'prod'
  port: number
  auth: AuthModuleConfig
}
