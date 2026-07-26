import { required } from '@parker/errors'

const env = (key: string, fallback?: string): string => {
  const value = process.env[key] ?? fallback
  return required(value, `Missing required env var: ${key}`)
}

const port = Number(env('PORT', '4502'))
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
  googleMapsApiKey: required(process.env['GOOGLE_MAPS_API_KEY'], 'Must set the env var GOOGLE_MAPS_API_KEY'),
  // Overridable so e2e tests (and CI) can point at a local fixture server instead of the real Google Maps API
  googleMapsApiUrl: env('GOOGLE_MAPS_API_URL', 'https://maps.googleapis.com'),
} as const
