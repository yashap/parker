import { required } from '@parker/errors'

const env = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback
  return required(value, `Missing required env var: ${key}`)
}

const port = Number(env('PORT', '4501'))
const hostName = env('HOST_NAME', 'http://localhost')

export const config = {
  environment: env('ENVIRONMENT', 'dev') as 'dev' | 'prod',
  port,
  apiDomain: `${hostName}:${port}`,
  websiteDomain: env('PARKER_WEB_URL', 'http://localhost:9081'),
  supertokens: {
    connectionUri: env('SUPERTOKENS_CORE_URL', 'http://localhost:4567'),
    apiKey: process.env['SUPERTOKENS_API_KEY'],
  },
  databaseUrl: env('DATABASE_URL', 'postgresql://parking:parking_password@localhost:6440/parking?schema=public'),
} as const
