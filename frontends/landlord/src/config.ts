import { required } from '@parker/errors'
import Constants from 'expo-constants'

// Note: this read values set in app.config.ts
const getRequiredString = (key: string): string =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  required(Constants.expoConfig?.extra?.[key], `No config value with key ${key}`)

export const config = {
  coreUrl: getRequiredString('coreUrl'),
}
