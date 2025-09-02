import { required } from '@parker/errors'
import { AuthModuleConfig, buildAuthModuleConfig } from '@parker/nest-utils'

export interface Configuration {
  environment: 'dev' | 'prod'
  port: number
  auth: AuthModuleConfig
  googleMapsApiKey: string
}

const port = Number(process.env['PORT'] ?? 3502)
const hostName: string = process.env['HOST_NAME'] ?? 'http://localhost'

export const config: Configuration = {
  environment: 'dev',
  port,
  auth: buildAuthModuleConfig({ apiUrl: `${hostName}:${port}` }),
  googleMapsApiKey: required(process.env['GOOGLE_MAPS_API_KEY'], 'Must set the env var GOOGLE_MAPS_API_KEY'),
}
