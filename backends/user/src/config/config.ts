import { Configuration } from 'src/config/Configuration'

const port = Number(process.env['PORT'] ?? 3503)
const hostName: string = process.env['HOST_NAME'] ?? 'http://localhost'

export const config: Configuration = {
  environment: 'dev',
  port,
  auth: {
    apiUrl: `${hostName}:${port}`,
    supertokensUrl: process.env['SUPERTOKENS_CORE_URL'],
    websiteDomain: process.env['PARKER_WEB_URL'],
  },
}
