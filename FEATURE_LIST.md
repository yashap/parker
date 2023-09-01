# Feature List

What am I planning to work on next?

- Change LogContextPropagator to CorrelationIdPropagator
  - And move out of the logging package
- Add some tests about input validation, make sure it's working (and returning 400s)
- Add tests around full server logging (logging responses properly, logging exceptions properly, correlation ids, etc.)
- Setup proper accounts
  - Using something like Keycloak or Ory Kratos
- Improve "landlord" app, that lets you list a parking spot
  - Support a full flow of logging in, listing a parking spot (maybe just location to start?), and viewing your parking spots
  - Then maybe add things like:
    - Date/time availability
    - Pricing
    - Pics
- Create a mega-simple "parker" app, that lets you book a parking spot
