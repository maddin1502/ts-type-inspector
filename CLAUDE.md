# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

`ts-type-inspector` is a type-safe data validation library (inspired by Joi). It ships as an ESM-only npm package (`"type": "module"`). The core idea: validators carry full TypeScript type information so a misconfigured validation is a compile error, and `isValid()` acts as a type predicate that narrows `unknown` to the validated type.

## Commands

```bash
npm run build           # tsc (prod) + tsc-alias to rewrite @/* aliases in dist
npm run build:dev       # build with tsconfig.dev.json
npm run build:validate  # build then run full test suite (CI gate)
npm run lint            # eslint src
npm run lint:fix        # eslint src --fix
npm test                # vitest run (single pass)
npm run test:coverage   # vitest run with v8 coverage (90% threshold, gated)
npm run test:watch      # vitest watch
npm run test:ui         # vitest --ui
```

Run a single test file or filter by name:

```bash
npx vitest run tests/code/validator/string.test.ts
npx vitest run -t "rejects empty"
```

Tests live in `tests/` (config `dir: './tests'`), not co-located with source. Reports are written to `tests/reports/` (junit XML + coverage). Coverage thresholds are 90% across lines/branches/functions/statements — keep new code covered or the build:validate gate fails.

## Architecture

**Entry point** `src/index.ts` exports the `ti` singleton (default export) plus every `Default*Validator` class and its matching `*Validator` interface. Consumers normally use `ti.<validator>`; the `Default*Validator` classes are exported so they can be subclassed for custom validators.

**`TypeInspector` (`src/inspector.ts`)** is a factory. Each getter/method (`ti.string`, `ti.object({...})`, `ti.union(...)`, etc.) returns a *fresh* validator instance — validators are stateful (they store the last `validationError`), so they must not be shared across concurrent validations.

**`DefaultValidator<Out, ValidationParams>` (`src/validator/index.ts`)** is the abstract base of every validator and holds all type-agnostic logic:
- Subclasses implement only `validateBaseType(value, params)` — the type check that returns the typed value or calls `throwValidationError`.
- `validate()` runs `validateBaseType` → registered conditions → custom validations, then clears the error. `isValid()` wraps `validate()` in try/catch and returns a type predicate (`value_ is Out`).
- Conditions (the chainable `.shortest()`, `.email`, `.min()` methods) are registered via `setupCondition()` and stored in an array; each returns `this` for chaining. Look at `src/validator/string.ts` for the canonical pattern: public methods/getters register a condition that calls a private `check*` method.
- `ValidationParams` is a second generic for "external influence" parameters passed at validation time — see the README's "Validation based on external influences" section.

**Error propagation.** Nested validators (object/array/tuple/dictionary/partial) call `validateNested()`, catch child errors, and `rethrowError()` with the property key appended to the `propertyTrace`. So a deep failure surfaces a full `propertyPath` like `propertyX.5.propertyY`. `ValidationError` (`src/error.ts`) is identified by a `Symbol` marker, not `instanceof` — always use the exported `isValidationError()` to detect it (cross-realm / multiple-bundle safe).

**Nested validator wrapper.** Property/item validators can be either a plain `Validator` or a function `(validateWith, params) => validateWith(childValidator, childParams)`. This wrapper form is how parent validators forward `ValidationParams` down to children (see `NestedValidator` in `src/types.ts`).

## Conventions

- **Path alias `@/*` → `src/*`.** Source imports use `@/...` (e.g. `import { Validator } from '@/types.js'`); intra-`validator/` imports use relative `./index.js`. `tsc-alias` rewrites `@/*` at build time; vitest resolves it via `vitest.config.ts`.
- **`.js` extensions in import specifiers** are required (`Node16` module resolution + `verbatimModuleSyntax`), even though the files are `.ts`.
- **Trailing-underscore naming**: parameters and local-ish identifiers use a trailing underscore (`value_`, `params_`, `min_`). Unused params are prefixed with a leading underscore (`_params_`).
- TS is `strict` with `noUnusedLocals`/`noUnusedParameters` — dead code fails the build.
- Each validator file defines both an `interface XValidator` (the public surface, used as the type) and a `class DefaultXValidator implements XValidator` (the implementation). Add new chainable conditions to both.
- The `ts-lib-extended` dependency supplies shared type utilities (`InstanceLike`, `MethodLike`, `Dictionary`, `MinArray`, `Enumerable`, etc.).
