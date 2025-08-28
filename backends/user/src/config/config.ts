import { AuthModuleConfig, buildAuthModuleConfig } from '@parker/nest-utils'

const port = Number(process.env['PORT'] ?? 3503)
const hostName: string = process.env['HOST_NAME'] ?? 'http://localhost'

export interface Configuration {
  environment: 'dev' | 'prod'
  port: number
  auth: AuthModuleConfig
}

export const config: Configuration = {
  environment: 'dev',
  port,
  auth: buildAuthModuleConfig({ apiUrl: `${hostName}:${port}` }),
}
