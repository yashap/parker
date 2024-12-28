# Feature List

What am I planning to work on next?

- Cursor stuff
  - Extract into a lib
  - Check out the `TODO-lib-cursor` bits
  - Tests, and also api client "fetch all pages"
- More complete tests for the LIST parkingSpots endpoint
- Can I make supertokens migrate during normal migrations, not on startup?
- Better create parking spot FE
  - With time rules and overrides, and properly viewing and editing your parking spot(s)
- General landlord improvements
  - Form lib?
  - Styling
  - [Default font styles](https://tailwindcss.com/docs/font-family) and whatnot for tailwind?
  - Maybe move everything from `frontends/landlord/app.json` into `frontends/landlord/app.config.ts`?
- Real implementation of place/location picking (landlord and BE)
  - Probably a new service, that wraps Google Places API?
- Real implementation of parking spot bookings and time rules (BE)
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
- Create a simple renter app, that lets you book a parking spot
  - View spots near you on a map
  - Click one to view details, with the option to book
    - Will probably require a concept of "availability" on FE and BE, based on time rules and existing bookings
  - No payments for now, all free
- Implement fares/fare rules/payments
- Validate flows around bad auth
  - Handled well on BE and FE? Ideally some BE tests!
- Photos of the parking spot
  - BE
  - Landlord
  - Renter
  - Possibly a generic service for uploading files?
- Maybe switch to pnpm instead of yarn v1 workspaces?
  - I believe new RN supports pnpm
- E2E tests, possibly using [Maestro](https://www.mobile.dev/)
- Move libs to absolute imports

  - In theory this is just:

    ```ts
    // ================================
    // jest.config.js
    // ================================
    // Make absolute imports work in jest tests
    moduleNameMapper: {
      '^src/(.*)$': '<rootDir>/src/$1',
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

  - But for some reason, when I do this in libs, I get weird unexpeceted any types in consumers of libs
  - Maybe it's the baseUrl thing? I didn't experiment with it
