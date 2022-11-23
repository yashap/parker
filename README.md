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
  - Then run `npm install -g pnpm`
    - Note that it's only "global" to this particular npm version
- Docker Desktop
  - For your local platform, e.g. [Docker for Mac](https://docs.docker.com/desktop/install/mac-install/) for a Mac

After this, you can try running `pnpm post-sync && pnpm format && pnpm lint && pnpm test && pnpm dev` to ensure everything works.

## Dev Workflows

All `pnpm` commands can be run at the root of the repo, where they will use the root `package.json` scripts. For the most part, this will invoke some sort of `turbo run` command, to run them in all workspaces (all backends, frontends and packages). Alternately, you can also run `pnpm` commands from the various app/package subdirectories, which will in turn use their `package.json` scripts, but running via the root directory (and thus `turbo`) is generally better, as it takes advantage of `turborepo` caching.

For any of the above commands, you can filter to a workspace (a library in `packages/`, a backend in `backends/` or a frontend in `frontends/`) via `--filter`, e.g.:

```bash
pnpm test --filter context-propagation
```

### Core Dev Workflow

```bash
# When starting work for the day, or after running git pull
pnpm post-sync

# To start developing in watch mode
pnpm dev

# Before you push
pnpm format && pnpm test
```

### Install an external dependency (e.g. an npm package)

```bash
# Add a package to a workspace
pnpm add <package> --filter <workspace>

# Add a dev package to a workspace
pnpm add -D <package> --filter <workspace>
```

### Install an internal dependency (e.g. depend on something in `packages/`)

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

# And then run
pnpm install
```

### Clear all build artifacts (`node_modules`, `dist`, etc.)

```bash
pnpm clean

# Or for a real "hard" version
pnpm clean && rm pnpm-lock.yaml
```

### Adding a new app/package

For adding a new package, copy `packages/context-propagation` as an example.

For adding a new backend service, copy `src/backends/core` as an example.

For adding a new React Native app, copy `src/frontends/landlord` as an example.
