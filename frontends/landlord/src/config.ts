import { required } from '@parker/errors'
import Constants from 'expo-constants'

// Note: this read values set in app.config.ts
const getRequiredString = (key: string): string =>
  required((Constants.manifest?.extra ?? {})[key], `No config value with key ${key}`)

export const config = {
  kratosUrl: getRequiredString('kratosUrl'),
  coreUrl: getRequiredString('coreUrl'),
}
