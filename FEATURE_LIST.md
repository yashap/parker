# Feature List

What am I planning to work on next?

- Real implementation of time rules (landlord and BE)
  - BE remaining:
    - Tests
    - Transactions?
    - Make the times Temporal times in the BE models? Is it worth trying to do this in DTOs too?
      - Should I actually be storing times WITH time zone?  Or should I be storing TZ separately?
- Real implementation of place/location picking (landlord and BE)
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
- Validate flows around bad auth
  - Handled well on BE and FE? Ideally some BE tests!
- E2E tests, possibly using [Maestro](https://www.mobile.dev/)
