import { config as defaultConfig } from './config'
import { Configuration } from './Configuration'

export const config: Configuration = {
  ...defaultConfig,
  environment: 'prod',
}
