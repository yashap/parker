# Parker

A monorepo for the Parker parking app.

## Dependencies

Install the following:

- [nvm](https://github.com/nvm-sh/nvm)
  - For managing multiple node versions
  - Suggest setting up `nvm` to [auto-switch to the right node version on cd](https://github.com/nvm-sh/nvm#deeper-shell-integration)
- [yarn](https://yarnpkg.com/)
  - A package manager/command line tool, similar to `npm`
  - Fist, ensure you're using the right `node` version
    - From `parker` run `nvm use`
  - Then run `corepack enable`
    - `corepack` includes `yarn`, and ships with Node.js >=16.10, but you have to opt in to enabling it
    - If you run `which yarn`, it should show something like `~/.nvm/versions/node/<node_version>/bin/yarn`
- [cmake](https://cmake.org/)
  - On a Mac, `brew install cmake`
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
  - For your local platform, e.g. [Docker for Mac](https://docs.docker.com/desktop/install/mac-install/) for a Mac
- [XCode](https://en.wikipedia.org/wiki/Xcode)
  - Ensure XCode is installed, with command line tools (necessary for running iOS Simulator)
  - Ensure you can open a simulated iPhone with Simulator, and it starts up properly

After this, you can try running `yarn build-migrate && yarn generate && yarn format && yarn lint && yarn test` to ensure everything works, before proceeding to `Dev Workflows` (below).

## Dev Workflows

All `yarn` commands can be run at the root of the repo, where they will use the root `package.json` scripts. For the most part, this will invoke some sort of `turbo run` command, to run them in all workspaces (all backends, frontends and packages). Alternately, you can also run `yarn` commands from the various app/package subdirectories, which will in turn use their `package.json` scripts, but running via the root directory (and thus `turbo`) is generally better, as it takes advantage of `turborepo` caching.

For any of the above commands, you can run against a specific workspace (a library in `packages/`, a backend in `backends/` or a frontend in `frontends/`) via putting `workspace <workspace>` after `yarn` and before the command, e.g.:

```bash
yarn workspace @parker/context-propagation test
```

The name of the workspace is the value of the `name` field in its `package.json`.

### Core Dev Workflow

All commands below should be run from the root of this repo.

```bash
# When starting work for the day, or after running git pull
# Installs dependencies, spins up and migrates local DBs, builds everything, etc.
yarn build-migrate

# Serve all backends (in watch mode)
yarn serve:backend

# Serve landlord frontend (in watch mode)
# It often works best if you manually open up a simulated device using Simulator, let it start up, then run the below command
yarn serve:landlord

# Load email UI to see account verification emails, password reset emails, etc.
yarn email

# Before you push to GitHub (no CI setup yet, so do this manually!)
yarn format && yarn test

# Run code generation (after changing DB schema, etc.)
yarn generate
```

### Email

We don't send emails locally - instead, they get sent to [MailSlurper](https://www.mailslurper.com/), a small SMTP mail server, that saves emails to an in-memory DB, and lets you view them in a UI. If you want to check on emails (e.g. account verification emails, password reset emails, etc.), as long as your local backend is running (`yarn serve:backend`), you can run `yarn email` from the root of this repo to view them.

### Install Dependencies

**Install an external dependency (e.g. an npm package)**

```bash
# Add a package to a workspace
yarn workspace <workspace> add <package>
# e.g. yarn workspace @parker/core add lodash

# Add a dev package to a workspace
yarn workspace <workspace> add -D <package>

# Remove a package from a workspace
yarn workspace <workspace> remove <package>
```

**Install an internal dependency (e.g. depend on something in `packages/`)**

```bash
# Add a dependency like this to your package.json
"<package>": "*"

# e.g. to make the @parker/core app depend on @parker/context-propagation
{
  "name": "@parker/core",
  ...
  "dependencies": {
    "@parker/context-propagation": "*",
    ...
  }
}

# And then run
yarn install
```

### Clear all build artifacts (`node_modules`, `dist`, etc.) and local databases

```bash
yarn clean

# Or for a real "hard" version
yarn clean && rm yarn.lock
```

### Adding a new app/package

- For adding a new package (a.k.a. library), copy `packages/context-propagation` as an example
- For adding a new backend service, copy `backends/core` as an example
- For adding a new React Native app, copy `frontends/landlord` as an example

If adding new packages becomes a pain point, we could consider writing [Turborepo custom code generators](https://turbo.build/repo/docs/core-concepts/monorepos/code-generation).
