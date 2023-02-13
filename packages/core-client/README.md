# @parker/core-client

A client for calling the `core` service.

## Workflow

We first define the client in the [Open API Spec](https://www.openapis.org/) format, then use tooling to generate a TypeScript client from the OAS that can be used to call `core` service.

Writing OAS by hand is tedious and error prone, so we use a GUI editor.

- Download [Stoplight Studio](https://stoplight.io/studio)
- Open it, choose "Open an Existing Folder", and open this directory (`packages/core-client`)
- Add/edit/delete endpoints, models, etc.
  - Note, we give everything a named model, vs. defining models inline, as this is better for code generation

Once you've make your changes, run `yarn generate && yarn format && yarn build` from the Parker repository root, to generate this client, and any other generated code.
