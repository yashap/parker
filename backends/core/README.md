# Core Service

The default/main/monolithic service. Functionality that can be cleanly split out into other micro-services goes there, but this is the main, monolithic backend service for Parker.

## Dev Workflow

On top of general workflow described in the [main README](../../README.md):

### Migrations

First, make changes to `src/db/schema.ts`, with the state you'd like your DB to be in. Then:

- Generate migration file, based on your current DB state vs. the desired state from schema.ts
  - `yarn db:generate-migration your_migration_file_name`
- Apply the migration to your local dev DB
  - `yarn db:migrate-up`
- Apply the migration to your local test DB
  - `yarn db:migrate-up:test`

Or more special case workflows:

- Create a custom migration file, vs. one derived from your schema.ts
  - `yarn db:generate-custom-migration your_migration_file_name`
- Tweak a generated migration file
  - Just generate it first, then edit the file

### API spec changes

TODO describe api spec changes ... or maybe describe in main README.md?

- DB migrations
  - TODO describe migration/codegen
- API spec changes
  - TODO describe api spec changes

^ TODO: maybe describe the above in the main README?
