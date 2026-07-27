# Feature List

What am I planning to work on next?

## Features

- **`Landlord FE:`** Add a map to show where the parking spot is
- **`Landlord FE:`** Add editing of parking spots
  - The Edit button currently just fires a TODO alert
- **`Landlord FE:`** Build UI for bookings, and for searching spots near a point
  - Both already exist in the API and are covered by API-level e2e tests, but have no screens
- **`Landlord FE:`** Ability to add a photo of the parking spot
  - Probably backed by a generic file upload service?
- **`BE:`** Real implementation of parking spot bookings and time rules
  - BE remaining, for time rules/overrides:
    - Time rule evaluation should be able to:
      - Account for time rules + overrides
      - Handle not just instants, but "is time range valid"
      - For time range, handle ranges that go past the border of a date
      - Maybe should all be moved out of the timeRule module, into its own module? Or into the parking spot module?
  - BE remaining, for bookings:
    - Add more than just the POST method to the API contract
      - Probably an ability to get availability windows as well?
    - Proper implementation of business logic around bookings (e.g. based on availability, time rules, etc.)
    - Tests
- **`Renter FE:`** Create a simple renter app, that lets you book a parking spot
  - View spots near you on a map
  - Click one to view details, with the option to book
    - Will probably require a concept of "availability" on FE and BE, based on time rules and existing bookings
  - No payments for now, all free
- **`Full Stack:`** Implement fares/fare rules/payments
  - Including ability to add credit card/apple pay
  - Both renters and landlords should be able to see past payments
- **`Renter FE:`** Navigate to parking spot once booked in renter
  - Some sort of map-based navigation UI
- **`Renter FE:`** AI-backed voice interface for booking parking spots
- **`Full Stack:`** Implement SSO for both landlord and renter apps
  - Google, FB, Apple, etc. signup/login
- **`FE:`** Add splash screens, logos, etc.
- **`FE:`** Ensure both renter and landlord work on Android
  - **Maybe**: RN-web version of landlord and/or renter?

## Tech Debt

- **`Full Stack:`** Clean up all the vibe-coded code from adding places search (frontend and backend)
  - Cleanup of code from [this PR](https://github.com/yashap/parker/pull/20)
  - `places` service:
    - `GoogleClient.getPlaceDetails` should return `undefined` if the place id doesn't exist. Need to test against real Google what happens here
    - Once that's done, `PlaceDetailsController` should not catch errors
    - There's no caching yet, I should add caching!
    - Check that all of the logic seems reasonable
    - Place details are returning an `AddressComponents[]`, but should it just be `AddressComponents`?
  - `landlord` app:
    - Just generally review the code for messiness
- **`BE:`** Switch to [encrypted .env](https://dotenvx.com/), and stop ignoring .env files
- **`BE:`** Is it possible to do conversion to `Temporal.Instant` within `ts-rest`?
- **`BE:`** Can I make supertokens migrate during normal migrations, not on startup?
- General landlord improvements
  - Form lib?
  - Styling
  - [Default font styles](https://tailwindcss.com/docs/font-family) and whatnot for tailwind?
    - And upgrade to latest tailwind/nativewind
  - Maybe move everything from `frontends/landlord/app.json` into `frontends/landlord/app.config.ts`?
- **`Full Stack:`** Validate flows around bad auth
  - Handled well on BE and FE? Ideally some BE tests!
- **`FE:`** Mobile e2e tests, possibly using [Maestro](https://www.mobile.dev/)
  - Web e2e tests are done (Playwright, in `e2e-tests-web`) - mobile is still uncovered
- **`BE:`** Upgrade SuperTokens - SDK is pinned to `supertokens-node` ^23, core to 11.4.5
  - SDK 24 requires core 12, which needs a staged operator migration, so this was deliberately deferred
  - Both need to be bumped together
- **`FE:`** Cover the `react-native-paper-dates` picker paths in the web e2e tests
  - Changing a time rule's start/end times, and picking custom dates/times in the override editor, both go through
    paper-dates modals that are brittle to drive from Playwright, so they're currently untested
- **`BE:`** `backends/user` has no tests of its own
  - Only covered indirectly, via the auth web e2e specs
- **`Full Stack:`** - Move libs to absolute imports
  - In theory this is just:

    ```ts
    // ================================
    // vitest.config.ts
    // ================================
    // Make absolute imports work in vitest tests
    resolve: {
      alias: {
        src: path.resolve(__dirname, 'src'),
      },
    },

    // ================================
    // tsconfig.json
    // ================================
    "baseUrl": "./",
    "paths": {
      "src/*": ["src/*"]
    }

    // ================================
    // eslint.config.mjs
    // ================================
    // Move all the no-relative-import-paths stuff to the shared config
    // Including install of eslint-plugin-no-relative-import-paths
    ```

  - But for some reason, when I do this in libs, I get weird unexpected any types in consumers of libs
  - Maybe it's the baseUrl thing? I didn't experiment with it
