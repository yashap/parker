# Parker

A monorepo for the Parker parking app.

## Setup

Install the following:
* [nvm](https://github.com/nvm-sh/nvm)
  * For managing multiple node versions
  * Suggest setting up `nvm` to [auto-switch to the right node version on cd](https://github.com/nvm-sh/nvm#deeper-shell-integration)
* [Nx](https://nx.dev)
  * Our monorepo build tool
  * `npm install -g nx`
* Docker Desktop
  * For your local platform, e.g. [Docker for Mac](https://docs.docker.com/desktop/install/mac-install/) for a Mac

Then you should be able to run `nx serve`, and have all services and frontends build and start up!

## Dev Workflow

* Build
  * `nx build`
* Serve (e.g. start a server or frontend)
  * `nx serve`
* Test
  * `nx test`
* Lint
  * Check linting rules: `nx lint`
  * Check and auto-fix linting rules: `nx lint --fix`
* Add an external dependency
  * `npm install <dep>`
  * Dev-only dependency: `npm install -D <dep>`
  * Note that with `nx`, you're strongly encouraged to declare dependencies once for all apps/libs, not per app/lib
    * This means the above commands should be run at the **root** of the repository, adding deps to the **root** `package.json`

Note that, with every `nx run` command, you can specify a specific app/lib. For example:
* `nx test` runs all tests
* `nx test core` only the tests for the `core` service

Some apps have other app-specific elements to their workflow - if working on one of those apps, see their individual READMEs for more information.

## Nx

We use [Nx](https://nx.dev) as a monorepo build system.

Nx supports many plugins which add capabilities for developing different types of applications and different tools.

These capabilities include generating applications, libraries, etc as well as the devtools to test, and build projects as well.

Below are some relevant core plugins:

- [React](https://reactjs.org)
  - `npm install --save-dev @nrwl/react`
- [Nest](https://nestjs.com)
  - `npm install --save-dev @nrwl/nest`

There are also many [community plugins](https://nx.dev/community).

### Generate an application

Run `nx g @nrwl/react:app my-app` to generate an app:
- In this example, a React app. But other plugins can be used too
- This app will be generated in the `apps/` dir

### Generate a library

Run `nx g @nrwl/react:lib my-lib --buildable` to generate a library
- In this example, a React focused lib. But other plugins can be used too
- This library will be generated in the `libs/` dir
- Libraries are shareable across libraries and applications. They can be imported from `@parker/mylib`

Or to create a generic TS lib, `nx g @nrwl/js:lib --name=my-lib --buildable`

### Development server

Run `nx serve my-app` for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `nx g @nrwl/react:component my-component --project=my-app` to generate a new component.

### Build

Run `nx build my-app` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `nx test my-app` to execute the unit tests via [Jest](https://jestjs.io).

Run `nx affected:test` to execute the unit tests affected by a change.

### Running end-to-end tests

Run `nx e2e my-app` to execute the end-to-end tests via [Cypress](https://www.cypress.io).

Run `nx affected:e2e` to execute the end-to-end tests affected by a change.

### Understand your workspace

Run `nx graph` to see a diagram of the dependencies of your projects.

### Further help

Visit the [Nx Documentation](https://nx.dev) to learn more.

### Nx Cloud

#### Distributed Computation Caching & Distributed Task Execution

Nx Cloud pairs with Nx in order to enable you to build and test code more rapidly, by up to 10 times. Even teams that are new to Nx can connect to Nx Cloud and start saving time instantly.

Teams using Nx gain the advantage of building full-stack applications with their preferred framework alongside Nx’s advanced code generation and project dependency graph, plus a unified experience for both frontend and backend developers.

Visit [Nx Cloud](https://nx.app/) to learn more.
