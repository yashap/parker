import { ExpoConfig } from 'expo/config'

const getEnvVar = (envVar: string): string | undefined => {
  const env = process.env ?? {}
  return env[envVar]
}

const getEnvVarWithDefault = (envVar: string, defaultValue: string): string => getEnvVar(envVar) ?? defaultValue

export default (parentConfig: ExpoConfig): ExpoConfig => {
  const parkingUrl = getEnvVarWithDefault('PARKING_URL', 'http://localhost:3501')
  const placesUrl = getEnvVarWithDefault('PLACES_URL', 'http://localhost:3502')
  const authUrl = getEnvVarWithDefault('USER_URL', 'http://localhost:3503')
  return {
    ...parentConfig,
    extra: {
      authUrl,
      parkingUrl,
      placesUrl,
    },
    scheme: 'parkerlandlord',
    plugins: [
      'expo-localization',
      [
        'expo-location',
        {
          locationAlwaysAndWhenInUsePermission: 'Allow $(PRODUCT_NAME) to use your location.',
        },
      ],
    ],
  }
}
