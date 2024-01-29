# Feature List

What am I planning to work on next?

- Real implementation of parking spot bookings and time rules (landlord and BE)
  - BE remaining, for time rules:
    - Tests
    - Transactions?
    - Time zones?
  - BE remaining, for bookings:
    - Add more than just the POST method to the API contract
    - Implement controller, using Temporal in the domain layer
    - Tests
- Real implementation of place/location picking (landlord and BE)
  - Probably a new service, that wraps Google Places API?
- Photos of the parking spot
- Fare rules
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
- TypeScript 
- Validate flows around bad auth
  - Handled well on BE and FE? Ideally some BE tests!
- E2E tests, possibly using [Maestro](https://www.mobile.dev/)
