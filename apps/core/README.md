# Core Service

The default/main/monolithic service. Functionality that can be cleanly split out into other micro-services goes there, but this is the main, monolithic backend service for Parker.

## Dev Workflow

On top of general workflow described in the [main README](../../README.md):

- DB migrations
  - Modify [the Prisma schema file](./prisma/schema.prisma)
  - TODO: MAKE A SCRIPT FOR CREATING MIGRATIONS!
  - From this directory, run `pnpm prisma migrate dev --name <description_of_migration>`
    - e.g. `pnpm prisma migrate dev --name added_foo_table`
    - This will generate a migration script in the [migrations directory](./prisma/migrations/), run it against your local dev db, and rebuild the generated Prima client, so you can start using the changes in your TypeScript code
