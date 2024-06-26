# Feature List

What am I planning to work on next?

- Real implementation of parking spot bookings and time rules (landlord and BE)
  - BE remaining, for time rules:
    - Tests
    - Transactions in ParkingSpotRepository, for the places where we do multiple operations?
    - Time zones?
  - BE remaining, for bookings:
    - Add more than just the POST method to the API contract
      - Probably an ability to get availability windows as well?
    - Proper implementation of business logic around bookings (e.g. based on availability, time rules, etc.)
    - Tests
- Real implementation of place/location picking (landlord and BE)
  - Probably a new service, that wraps Google Places API?
- General landlord improvements
  - Form lib?
  - Styling
  - [Default font styles](https://tailwindcss.com/docs/font-family) and whatnot for tailwind?
  - Maybe move everything from `frontends/landlord/app.json` into `frontends/landlord/app.config.ts`?
- Create a simple renter app, that lets you book a parking spot
  - View spots near you on a map
  - Click one to view details, with the option to book
    - Will probably require a concept of "availability" on FE and BE, based on time rules and existing bookings
  - No payments for now, all free
- Implement fares/fare rules/payments
- TypeScript migrations
- Validate flows around bad auth
  - Handled well on BE and FE? Ideally some BE tests!
- E2E tests, possibly using [Maestro](https://www.mobile.dev/)
- Photos of the parking spot
  - BE
  - Landlord
  - Renter
  - Possibly a generic service for uploading files?
- Maybe switch to most recent ReactNative/everything, and to pnpm instead of yarn v1 workspaces?
  - I believe new RN supports pnpm
