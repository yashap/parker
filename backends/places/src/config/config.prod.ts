import { config as defaultConfig, Configuration } from 'src/config/config'

export const config: Configuration = {
  ...defaultConfig,
  environment: 'prod',
}
