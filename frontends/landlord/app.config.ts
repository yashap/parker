import { ExpoConfig } from 'expo/config'

const getEnvVar = (envVar: string): string | undefined => {
  const env = process.env ?? {}
  return env[envVar]
}

const getEnvVarWithDefault = (envVar: string, defaultValue: string): string => getEnvVar(envVar) ?? defaultValue

export default (parentConfig: ExpoConfig): ExpoConfig => {
  const coreUrl = getEnvVarWithDefault('CORE_URL', 'http://localhost:3501')
  return {
    ...parentConfig,
    extra: {
      coreUrl,
    },
    scheme: 'parkerlandlord',
  }
}
