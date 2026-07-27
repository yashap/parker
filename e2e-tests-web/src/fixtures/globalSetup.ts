import { startGoogleMapsFixtureServer } from './googleMapsFixtureServer.js'

/**
 * Starts the Google Maps fixture server for the duration of the test run. Harmless when unused
 * (i.e. when the places backend wasn't started with GOOGLE_MAPS_API_URL pointing at it).
 */
const globalSetup = async (): Promise<() => Promise<void>> => {
  const server = await startGoogleMapsFixtureServer()
  return async () => {
    await new Promise<void>((resolve, reject) => {
      server.close((err) => {
        if (err) {
          reject(err)
        } else {
          resolve()
        }
      })
    })
  }
}

export default globalSetup
