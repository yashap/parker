# Parker Mobile E2E Tests

[Maestro](https://maestro.mobile.dev/) flows that drive the **iOS Simulator** (and optionally an Android
Emulator) running the Expo build of `@parker/landlord`. Mirrors [`e2e-tests-web/`](../e2e-tests-web/README.md)
but exercises the native render pipeline instead of Expo Web.

## Running the tests

`pnpm test:e2e:mobile` does **not** start any services or simulators for you. Bring them up first — see the
standard local dev flow in the [main README](../README.md).

Or more briefly:

```bash
# From the repo root:

# 1. After pulling: install deps + migrate DBs
pnpm sync

# 2. Start the backends (parking, places, user + the SuperTokens core container, in parallel via turbo).
#    Optionally point the places backend at a stubbed Google Maps API - see "Google Maps" below.
pnpm serve:backend

# 3. Start the Expo dev server with the iOS Simulator. This opens the Simulator, installs the
#    Expo Go runtime if needed, and loads our app.
pnpm serve:landlord:ios

# 4. Once the app is visible in the Simulator on the log-in screen, run the tests:
pnpm test:e2e:mobile
```

To run a single flow: `pnpm --filter @parker/e2e-tests-mobile exec maestro test flows/sign-up-and-log-in.yaml`.
`maestro studio` (from this directory) is useful for inspecting the running app's element tree when writing
new flows.

## The flows

| Flow                                    | Covers                                                                                                                                        |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `sign-up-and-log-in.yaml`               | Sign up as a fresh landlord → land on the spot list → log out → log back in                                                                   |
| `create-spot-and-set-availability.yaml` | Sign up → create a spot via address autocomplete → add a Monday rule + a "blocked for 4h" override → save → reopen and confirm both persisted |

## State isolation

Each flow signs up a **freshly generated email**, so a landlord only ever sees the spots that run created, and
signing up replaces whatever session the previous run left behind. There is deliberately no database cleanup —
same rationale as the web suite. Residue is one throwaway user (plus their spots) per flow per run in the dev
database; `pnpm db:clean` wipes everything if it ever matters.

Note the flows deliberately do **not** use Maestro's `clearState`. It wipes Expo Go's own storage along with
ours, which resets Expo Go's first-launch onboarding, the location permission grant, and iOS's Keychain prompt
state — so every run would have to fight three dialogs instead of none. Unique emails give us the isolation we
actually need without that cost.

## iOS dialogs

Three dialogs can appear in front of the app, none of them ours:

| Dialog                                       | When                                                              |
| -------------------------------------------- | ----------------------------------------------------------------- |
| Expo Go's "This is the developer menu" sheet | First launch after Expo Go is installed or its storage is cleared |
| "Allow Expo Go to use your location?"        | First time the new-spot screen mounts (it biases suggestions)     |
| "Save this password in your Keychain?"       | After a successful sign up or log in                              |

All three are dismissed by [`subflows/clear-stray-ios-dialogs.yaml`](./subflows/clear-stray-ios-dialogs.yaml).
Note how the flows invoke it: at each screen transition they wait for the screen they expect
(`optional: true`), and only run the sweep if that screen never appeared. Maestro re-dumps the whole
accessibility hierarchy for every condition it evaluates (~1-2s each), so checking for dialogs
unconditionally on every run cost far more than the tests themselves. This way the normal path pays one
fast wait plus one check, and the cost of clearing dialogs falls only on the runs that actually have them.

Separately, the password fields on the log-in and sign-up screens set `textContentType='oneTimeCode'` and
`autoComplete='off'`. Without those, iOS covers the field with its "Automatic Strong Password" suggestion and
Maestro's typing lands nowhere. The comment in the code says as much, so nobody "cleans it up" later.

Subflows live outside `flows/` on purpose, so `maestro test flows/` doesn't pick them up as tests of their own.

## Google Maps

The spot-creation flow types `160 Spear` into the address autocomplete and taps the first suggestion. That
query matches the [web suite's Google Maps fixture server](../e2e-tests-web/src/fixtures/googleMapsFixtureServer.ts)
_and_ is a real San Francisco address, so the flow works either way:

- **Against the real API** (the default locally — `backends/places/.env` supplies `GOOGLE_MAPS_API_KEY`): real
  suggestions come back, and the flow taps the first one.
- **Against a stub**: start the backends with `GOOGLE_MAPS_API_URL` pointed at a fixture server to avoid
  spending real API quota.

The flow deliberately asserts only that the selected-location panel appears, never on the address text, so it
doesn't care which mode you're in.

## Not run in CI

These flows need a simulator, so they are local-only — CI runs the [web e2e suite](../e2e-tests-web/README.md)
instead. Running them in CI would need a macOS runner plus a booted simulator, which is slow and expensive; the
web suite already covers the same user journeys against the same backends.

## Troubleshooting

- **`maestro: command not found`** — install Maestro (see the [main README](../README.md)).
- **`No devices found`** — make sure the iOS Simulator is open AND showing our app. `pnpm serve:landlord:ios`
  handles both.
- **`Element not visible`** — the testIDs live in `frontends/landlord/src/app/**` and
  `frontends/landlord/src/components/**`, and are shared with the web suite. If a flow fails on an element
  lookup, check the testID still exists in the React code.
- **Stale Expo bundle** — restart `pnpm serve:landlord:ios` to force a re-bundle if you've changed frontend
  code recently.
- **Metro claims a file that exists can't be resolved** — `watchman watch-del-all`, then restart the dev
  server.
