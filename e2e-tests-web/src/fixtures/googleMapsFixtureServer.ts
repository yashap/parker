import { createServer, type Server } from 'node:http'

/**
 * A stand-in for the Google Maps Places API so e2e runs (especially CI) never hit the real thing.
 * Serves one address, "160 Spear Street", for autocomplete + details. Point the places backend at
 * it via GOOGLE_MAPS_API_URL (see .github/workflows/ci.yml); without that env var the backend
 * talks to real Google Maps, which also works for local runs (with a real GOOGLE_MAPS_API_KEY).
 *
 * The response shapes mirror what GoogleClient (backends/places/src/domain/google/GoogleClient.ts)
 * actually reads: autocomplete predictions ({place_id, description, structured_formatting}) and
 * place details ({place_id, name, formatted_address, geometry.location, address_components}).
 */

export const GOOGLE_MAPS_FIXTURE_PORT = 4599

/** What tests type into the address input to get the fixture suggestion. */
export const FIXTURE_ADDRESS_QUERY = '160 Spear'
/** The suggestion's main text — this is what the app saves as the parking spot's address. */
export const FIXTURE_ADDRESS_LABEL = '160 Spear Street'
export const FIXTURE_PLACE_ID = 'e2e-fixture-place-1'
export const FIXTURE_LOCATION = { latitude: 37.7909, longitude: -122.3925 }

const autocompleteOkBody = JSON.stringify({
  status: 'OK',
  predictions: [
    {
      place_id: FIXTURE_PLACE_ID,
      description: '160 Spear Street, San Francisco, CA, USA',
      structured_formatting: {
        main_text: FIXTURE_ADDRESS_LABEL,
        secondary_text: 'San Francisco, CA, USA',
      },
    },
  ],
})

const autocompleteZeroResultsBody = JSON.stringify({ status: 'ZERO_RESULTS', predictions: [] })

const detailsOkBody = JSON.stringify({
  status: 'OK',
  result: {
    place_id: FIXTURE_PLACE_ID,
    name: FIXTURE_ADDRESS_LABEL,
    formatted_address: '160 Spear St, San Francisco, CA 94105, USA',
    geometry: {
      location: { lat: FIXTURE_LOCATION.latitude, lng: FIXTURE_LOCATION.longitude },
    },
    address_components: [
      { long_name: '160', short_name: '160', types: ['street_number'] },
      { long_name: 'Spear Street', short_name: 'Spear St', types: ['route'] },
      { long_name: 'San Francisco', short_name: 'SF', types: ['locality'] },
      { long_name: 'California', short_name: 'CA', types: ['administrative_area_level_1'] },
      { long_name: 'United States', short_name: 'US', types: ['country'] },
      { long_name: '94105', short_name: '94105', types: ['postal_code'] },
    ],
  },
})

const detailsInvalidRequestBody = JSON.stringify({ status: 'INVALID_REQUEST' })

export const startGoogleMapsFixtureServer = async (port = GOOGLE_MAPS_FIXTURE_PORT): Promise<Server> => {
  const server = createServer((req, res) => {
    const respondJson = (body: string): void => {
      // The Google Maps API itself responds 200 even for ZERO_RESULTS / INVALID_REQUEST — the
      // outcome is communicated via the JSON `status` field
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(body)
    }
    const url = new URL(req.url ?? '/', `http://localhost:${port}`)
    if (url.pathname === '/maps/api/place/autocomplete/json') {
      const input = url.searchParams.get('input') ?? ''
      const matches = input.toLowerCase().includes(FIXTURE_ADDRESS_QUERY.toLowerCase())
      respondJson(matches ? autocompleteOkBody : autocompleteZeroResultsBody)
      return
    }
    if (url.pathname === '/maps/api/place/details/json') {
      const placeId = url.searchParams.get('place_id')
      respondJson(placeId === FIXTURE_PLACE_ID ? detailsOkBody : detailsInvalidRequestBody)
      return
    }
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ status: 'NOT_FOUND' }))
  })
  await new Promise<void>((resolve) => server.listen(port, resolve))
  return server
}
