import { ExpoConfig } from 'expo/config'

const getEnvVar = (envVar: string): string | undefined => {
  const env = process.env ?? {}
  return env[envVar]
}

const getEnvVarWithDefault = (envVar: string, defaultValue: string): string => getEnvVar(envVar) ?? defaultValue

export default (parentConfig: ExpoConfig): ExpoConfig => {
  const parkingUrl = getEnvVarWithDefault('PARKING_URL', 'http://localhost:3501')
  const placesUrl = getEnvVarWithDefault('PLACES_URL', 'http://localhost:3502')
  return {
    ...parentConfig,
    extra: {
      parkingUrl,
      placesUrl,
    },
    scheme: 'parkerlandlord',
  }
}
