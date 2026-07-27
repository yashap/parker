# @parker/eslint-config

The shared ESLint [flat config](https://eslint.org/docs/latest/use/configure/configuration-files) for every
workspace in the repo.

## Usage

Each workspace has an `eslint.config.mjs` that just re-exports the shared config:

```js
import baseConfig from '@parker/eslint-config/default.config.mjs'

export default baseConfig
```

Add workspace-specific rules by spreading it:

```js
import baseConfig from '@parker/eslint-config/default.config.mjs'

export default [...baseConfig, { rules: { 'no-console': 'off' } }]
```

Note this package is plain ESM JS with no build step, so it's exported by path
(`./default.config.mjs`) rather than through a `development`/`default` conditional export like the TS packages.

## The import resolver

The one setting worth knowing about:

```js
'import/resolver': {
  typescript: {
    conditionNames: ['development', 'types', 'import', 'require', 'node', 'default'],
  },
}
```

`development` has to come first so `eslint-plugin-import` resolves workspace deps to their TS source, matching the
`customConditions` in `@parker/tsconfig`. Without it, every `@parker/*` import would be reported as unresolved on
a fresh clone with no `dist/` built.
