# Parker Web E2E Tests

Playwright tests that drive the Expo Web build of the landlord app through a real browser and verify the full stack: Expo app → Fastify backends (`parking`, `places`, `user`) → SuperTokens → Postgres. One spec (`parkingApi.spec.ts`) exercises the parking API directly instead of going through the UI.

## Running the tests

`pnpm test:e2e:web` does **not** start any services for you. Bring them up first:

```bash
# From the repo root:

# 1. After pulling: install deps + migrate DBs
pnpm sync

# 2. Start the backends (parking, places, user + the SuperTokens core container, in parallel via turbo).
#    Point the places backend at the local Google Maps fixture server (started automatically by the
#    Playwright globalSetup on port 4599), so tests never hit the real Google Maps API:
GOOGLE_MAPS_API_URL=http://localhost:4599 GOOGLE_MAPS_API_KEY=e2e-fixture-key pnpm serve:backend

# 3. Start the Expo web build (Metro)
pnpm --filter @parker/landlord serve:web

# 4. Once both terminals are running, run the E2E tests:
pnpm test:e2e:web
```

Notes:

- Without `GOOGLE_MAPS_API_URL`, the places backend talks to the real Google Maps API (using whatever `GOOGLE_MAPS_API_KEY` is configured, e.g. in `backends/places/.env`). The address-autocomplete specs type the fixture address `160 Spear` and expect the fixture's single suggestion, so run against the fixture server unless you're debugging something else.
- The shell environment wins over `backends/places/.env`: the places `serve` script uses `--env-file-if-exists=.env`, and Node's `--env-file` never overrides variables that are already set in the environment.
- The first Metro web bundle takes a minute or two to compile; the first test may be slow (or warm it beforehand by loading http://localhost:9081 in a browser).

## State isolation

Tests do **not** touch your local dev data, and there is intentionally no database cleanup. Each test:

- Signs up with a unique email (`parker-e2e-${timestamp}-${random}@example.com`), so it never collides with previous runs or your manual dev accounts.
- Gets a fresh Playwright browser context with no cookies / storage, so there's no carry-over session.
- Only asserts against data owned by the user it just created (the parking spots list is scoped to the logged-in user; the API spec creates spots at randomized coordinates so `closestToPoint` ranks its own spot first).

The residue from each run is a handful of dead SuperTokens users with throwaway emails, plus their parking spots/bookings — harmless to leave around, and safe to run back-to-back.

## Configuration

Service URLs are read from env, with these defaults:

| Variable               | Default                 | What                                            |
| ---------------------- | ----------------------- | ----------------------------------------------- |
| `PARKER_WEB_URL`       | `http://localhost:9081` | Expo web (Metro)                                |
| `PARKING_URL`          | `http://localhost:4501` | parking backend                                 |
| `PLACES_URL`           | `http://localhost:4502` | places backend                                  |
| `USER_URL`             | `http://localhost:4503` | user backend (SuperTokens `/auth/*`)            |
| `SUPERTOKENS_CORE_URL` | `http://localhost:4567` | SuperTokens core                                |
| (fixture server)       | `http://localhost:4599` | Google Maps fixture, started by the globalSetup |

## Known coverage gaps

- **Bookings and spot search have no UI** — the landlord app has no screens for booking a spot or searching spots near a point, so those flows are covered at the API level only (`parkingApi.spec.ts`).
- **Editing a parking spot is unimplemented** in the app (the Edit button is a TODO alert), so `parkingSpotManage.spec.ts` covers create + delete only.
- **react-native-paper-dates picker paths are untested** — changing a time rule's start/end times, and picking custom dates/times in the override editor, both go through paper-dates modals that are brittle to drive from Playwright. The availability specs instead add a weekly rule with its default times (09:00–17:00), add an override via the quick-action buttons, and add one with the editor modal's defaults (available, now → now + 1h).
