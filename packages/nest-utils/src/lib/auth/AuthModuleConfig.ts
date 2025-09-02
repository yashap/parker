export interface AuthModuleConfig {
  apiUrl: string
  supertokensUrl: string
  websiteDomain: string
  apiKey?: string
}

export const buildAuthModuleConfig = (
  config: Omit<AuthModuleConfig, 'supertokensUrl' | 'websiteDomain'>
): AuthModuleConfig => {
  return {
    ...config,
    supertokensUrl: process.env['SUPERTOKENS_CORE_URL'] ?? 'http://localhost:3567',
    websiteDomain: process.env['PARKER_WEB_URL'] ?? 'http://localhost:3000',
  }
}
