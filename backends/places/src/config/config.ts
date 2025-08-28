import { AuthModuleConfig, buildAuthModuleConfig } from '@parker/nest-utils'

export interface Configuration {
  environment: 'dev' | 'prod'
  port: number
  auth: AuthModuleConfig
}

const port = Number(process.env['PORT'] ?? 3502)
const hostName: string = process.env['HOST_NAME'] ?? 'http://localhost'

export const config: Configuration = {
  environment: 'dev',
  port,
  auth: buildAuthModuleConfig({ apiUrl: `${hostName}:${port}` }),
}
