# Parker

A monorepo for the Parker parking app.

## Dependencies

Install the following:

- [nvm](https://github.com/nvm-sh/nvm)
  - For managing multiple node versions
  - Suggest setting up `nvm` to [auto-switch to the right node version on cd](https://github.com/nvm-sh/nvm#deeper-shell-integration)
- [pnpm](https://pnpm.io/)
  - A package manager (similar to `npm`/`yarn`) that works particularly well with [Turborepo](https://turborepo.org/)
  - Fist, ensure you're using the right `node` version
    - From `parker` run `nvm use`
  - `npm install -g pnpm`
- Docker Desktop
  - For your local platform, e.g. [Docker for Mac](https://docs.docker.com/desktop/install/mac-install/) for a Mac

After this, you can try running `pnpm install && pnpm db:migrate && pnpm db:migrate:test && pnpm build && pnpm format && pnpm lint && pnpm test && pnpm dev` to ensure everything works.

## Dev Workflows

All of the below commands can be run at the root of the repo, where they will use the root `package.json` scripts. For the most part, this will invoke some sort of `turbo run` command, to run them in all workspaces (all apps and packages). Alternately, you can also run `pnpm` commands from the various app/package subdirectories, which will in turn use their `package.json` scripts, but running via the root directory (and thus `turbo`) is generally better, as it takes advantage of `turborepo` caching.

For any of the above commands, you can filter to a workspace (a library in `packages/` or an app in `apps/`) via `--filter`, e.g.:

```bash
pnpm test --filter context-propagation
```

### Commands

Build everything (libraries, etc.):

```bash
pnpm build
```

Run DB migrations:

```bash
pnpm db:migrate && pnpm db:migrate:test
```

Run all apps in local development mode:

```bash
pnpm dev
```

Run all tests:

```bash
pnpm test
```

Format the code:

```bash
pnpm format
```

Lint the code:

```bash
pnpm lint
```

Install an external dependency (e.g. an npm package):

```bash
# Add a package to a workspace
pnpm add <package> --filter <workspace>

# Add a dev package to a workspace
pnpm add -D <package> --filter <workspace>
```

Install an internal dependency (e.g. depend on something in `packages/`):

```bash
# Add a dependency like this to your package.json
"<package>": "workspace:*"

# e.g. to make the @parker/core app depend on @parker/context-propagation
{
  "name": "@parker/core",
  ...
  "dependencies": {
    "@parker/context-propagation": "workspace:*",
    ...
  }
}
```

Ensure all dependencies installed, turborepo symlinks setup, etc.:

```bash
pnpm install
```

Clear all build artifacts (`node_modules`, etc.):

```bash
pnpm clean

# Or for a real "hard" version
pnpm clean && rm pnpm-lock.yaml
```

Create production-ready builds of all apps and libraries:

```bash
pnpm build
```

### Adding a new app/package

For adding a new package, see `packages/context-propagation` as an example. Basically you should:

- Create a new directory inside `packages/`
- Within this directory:
  - Add a similar `.eslintrc.js`, `tsconfig.json` and `package.json` to `packages/context-propagation`
  - Setup `jest` using [these instructions](https://kulshekhar.github.io/ts-jest/docs/getting-started/installation/)
  - Add a main entrypoint for exports at `src/index.ts`

For adding a new backend service, same idea, but use `src/apps/core` as an example.

For adding a new React web frontend, see TODO

For adding a new React Native frontend, see TODO
