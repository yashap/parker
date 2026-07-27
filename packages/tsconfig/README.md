# `@parker/tsconfig`

The shared base `tsconfig.json`s that every workspace inherits from.

| Config                | For                                                               |
| --------------------- | ----------------------------------------------------------------- |
| `base.json`           | Common compiler options — everything else extends this            |
| `library.json`        | A package in `packages/` (typechecking + dev)                     |
| `library.build.json`  | The same, for the `tsc -p tsconfig.build.json` production build   |
| `node-app.json`       | A backend service in `backends/` — adds `"types": ["node"]`       |
| `node-app.build.json` | The same, for the production build                                |
| `react-library.json`  | A library containing React components — adds `"jsx": "react-jsx"` |

Each workspace has a `tsconfig.json` (extending `library.json` / `node-app.json`, used by `tsc --noEmit` and your
IDE) and a `tsconfig.build.json` (extending the matching `.build.json`, used by `pnpm build` to emit `dist/`).

`frontends/landlord` is the exception: it extends `base.json` directly, since it needs
`"jsx": "react-native"` and has no build step of its own (Metro bundles it).

## The two load-bearing options

`base.json` sets:

```json
"moduleResolution": "bundler",
"customConditions": ["development"]
```

Together these make `tsc` and your IDE resolve workspace deps through the `"development"` branch of each
package's `exports` map — straight to its `src/*.ts`. That's what lets a fresh clone typecheck with **no**
`dist/` built anywhere. See [the no-compile section of the root README](../../README.md#the-no-compile-workspace-deps-story).
