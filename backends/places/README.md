# places

A thin Fastify wrapper around the Google Places APIs — address autocomplete (place suggestions) and place
details lookup. No database of its own.

- API contract: `packages/places-client`, served under the `/places` path prefix
- Runs on `:4502` (`PORT`), auth'd via SuperTokens — a `preHandler` hook calls `requireSession` for every
  request whose URL starts with `/places/`
- Routes: `registerPlaceSuggestionsRoutes(app, deps)` and `registerPlaceDetailsRoutes(app, deps)`. `src/main.ts`
  constructs a `GoogleClient` by hand and passes it into `buildApp` (`src/app.ts`)

```bash
pnpm serve:places                       # tsx watch, from the repo root (also starts SuperTokens)
pnpm --filter @parker/places test       # vitest — the GoogleClient specs stub HTTP, no real API calls
```

## Config

See `src/config.ts`. Everything has a dev default **except `GOOGLE_MAPS_API_KEY`**, which is the only hard
requirement in the whole repo — the service throws on startup if it's missing.

| Variable               | Required | Default                               |
| ---------------------- | -------- | ------------------------------------- |
| `GOOGLE_MAPS_API_KEY`  | **yes**  | none — throws if unset                |
| `GOOGLE_MAPS_API_URL`  | no       | `https://maps.googleapis.com`         |
| `PORT`                 | no       | `4502`                                |
| `HOST_NAME`            | no       | `http://localhost`                    |
| `ENVIRONMENT`          | no       | `dev`                                 |
| `PARKER_WEB_URL`       | no       | `http://localhost:9081` (CORS origin) |
| `SUPERTOKENS_CORE_URL` | no       | `http://localhost:4567`               |
| `SUPERTOKENS_API_KEY`  | no       | unset                                 |

### Supplying the API key

This service's `serve` script is the one place we load a `.env` file, via Node's own flag:

```
tsx watch --conditions=development --env-file-if-exists=.env src/main.ts
```

So put your key in `backends/places/.env` (gitignored):

```
GOOGLE_MAPS_API_KEY=your_key_here
```

Note `--env-file-if-exists` never overrides a variable that's already set in the environment, so **the shell env
wins over `.env`**.

### `GOOGLE_MAPS_API_URL` and testing

`GOOGLE_MAPS_API_URL` exists so the real Google API can be swapped for a stub. The web e2e tests use it to point
this service at a local fixture server on `:4599` (started by Playwright's `globalSetup`), which means the e2e
suite never spends quota or needs a real key:

```bash
GOOGLE_MAPS_API_URL=http://localhost:4599 GOOGLE_MAPS_API_KEY=e2e-fixture-key pnpm serve:backend
```

See [the web e2e README](../../e2e-tests-web/README.md) for the full picture.
