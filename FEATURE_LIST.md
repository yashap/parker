# Feature List

What am I planning to work on next?

- Finish proper login/account management with Kratos
  - Should I still have a user table outside Kratos?
- Maybe move everything from `frontends/landlord/app.json` into `frontends/landlord/app.config.ts`?
- Improve "landlord" app, that lets you list a parking spot
  - Improve UI for base flow (login, add parking spot, list parking spots)
    - Also, switch to just "list my parking spots" everywhere, vs. "list closest to point"
    - Form lib?
    - [Default font styles](https://tailwindcss.com/docs/font-family) and whatnot for tailwind?
  - Error handling/toasts
    - Maybe switching client to @ts-rest/react-query?
  - Then maybe add things like:
    - Date/time availability
    - Pricing
    - Pics
- Create a simple "parker" app, that lets you book a parking spot
  - View spots near you on a map
  - Click one to view details, with the option to book
  - No payments for now, all free
