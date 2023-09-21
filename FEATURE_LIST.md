# Feature List

What am I planning to work on next?

- Figure out why landlord FE isn't getting the expected error
  - e.g. why isn't Axios error mapping middleware working?
- Setup proper accounts
  - Using something like Keycloak or Ory Kratos
- Improve "landlord" app, that lets you list a parking spot
  - Support a full flow of logging in, listing a parking spot (maybe just location to start?), and viewing your parking spots
  - Error handling (maybe switching client to @ts-rest/react-query?)
  - Then maybe add things like:
    - Date/time availability
    - Pricing
    - Pics
  - Better styling
- Create a simple "parker" app, that lets you book a parking spot
  - View spots near you on a map
  - Click one to view details, with the option to book
  - No payments for now, all free
