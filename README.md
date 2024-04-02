# ts-type-inspector <!-- omit in toc -->
> The TypeInspector is a data validation tool that is heavily inspired by [Joi](https://www.npmjs.com/package/joi). Due to the type-safety, it can prevent a misconfigured data validation (in contrast to Joi).

[![npm version](https://badge.fury.io/js/ts-type-inspector.svg)](https://badge.fury.io/js/ts-type-inspector)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm downloads](https://badgen.net/npm/dw/ts-type-inspector)](https://badge.fury.io/js/ts-type-inspector)

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
  - [Basics](#basics)
  - [Modes](#modes)
    - [isValid](#isvalid)
    - [validate](#validate)
  - [Error evaluation](#error-evaluation)
  - [Validation depending on external influences](#validation-depending-on-external-influences)
  - [Predefined validators](#predefined-validators)
    - [String](#string)
    - [Number](#number)
    - [Object](#object)
    - [Partial](#partial)
    - [Dictionary](#dictionary)
    - [Array](#array)
    - [Tuple](#tuple)
    - [Date](#date)
    - [Method](#method)
    - [Union](#union)
    - [Strict](#strict)
    - [Optional](#optional)
    - [Any](#any)
    - [Custom](#custom)
    - [Enum](#enum)
    - [Exclude](#exclude)
    - [Boolean](#boolean)
    - [Undefined](#undefined)
    - [Null](#null)
    - [Nullish](#nullish)

## Features
- type safe (no automatic type conversions/casting)
- determine the value's data type based on the validators used (generic type arguments are mostly optional)
- custom error messages
- flexibel & additional custom validation
- predefined default-validators for most common data types
- extendable valdators to take external dependencies into account

## Installation
```bash
npm i ts-type-inspector
```

## Usage

### Basics

- the validation is terminated immediately when an invalidity occurs.
- validation order:
  1. Basic data type
  2. Conditions
- conditions can be chained to make the validation more precise
- validators can be mixed to achieve more complex validation

```ts
import ti from 'ts-type-inspector';

// condition chaining
ti.<VALIDATOR>.<CONDITION1>.<CONDITION2>()...;
ti.<VALIDATOR>(<VALIDATION_PARAMS>).<CONDITION1>.<CONDITION2>()...;

// mix validators, e.g.:
ti.object({
  prop1: ti.<VALIDATOR>.<CONDITION1>.<CONDITION2>()...,
  prop2: ti.<VALIDATOR>(<VALIDATION_PARAMS>).<CONDITION1>.<CONDITION2>()...
})
```

Parameter | Description
--- | ---
`<VALIDATOR>` | There are various validators that can be used for validation of diverse value-types (string, number, date, object, ...)
`<VALIDATION_PARAMS>` | Some validators need configuration parameters to work correctly (array -> item validator, object -> property validators, ...)
`<CONDITION>` | The TypeInspector uses method-chaining to define special validation conditions. These are additional checks that evaluate the incoming value more precisely

### Modes

All validators provide **two** validation modes:
- `<VALIDATOR>`.isValid(`<UNKNOWN_VALUE>`)
- `<VALIDATOR>`.validate(`<UNKNOWN_VALUE>`)

Both modes perform the same validation, but their result outputs are different.

#### isValid

This mode uses the [type predicate](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates) feature of Typescript and therefore returns a boolean value as validation result. This assigns an exact type to the (successfully) validated value based on the validator used.

```ts
import ti from 'ts-type-inspector';

function processIncomingValueAsString(value_: unknown): number {
  if (ti.string.isValid(value_)) {
    return value_.length; // typescript knows that the value_ is of type string at this point
  }

  return NaN;
}
```

#### validate

This mode throws a `ValidationError` when validation fails. On success it returns the **same** value (same object reference - in contrast to Joi) that was validated but with the correct type information.

```ts
import ti from 'ts-type-inspector';

function processIncomingValueAsString(value_: unknown): number {
  try {
    const message = ti.string.validate(value_);
    return message.length; // typescript knows that the value_ is of type string at this point
  } catch {
    return NaN;
  }
}
```

### Error evaluation

The validator saves the last validation error that occurred, making it easy to evaluate. Since the validation is terminated immediately when an invalidity occurs, the error only contains information about this specific invalidity.

```ts
import ti from 'ts-type-inspector';

function processIncomingValueAsString(value_: unknown): number {
  const validator = ti.string;
  if (validator.isValid(value_)) {
    return value_.length; // typescript knows that the value_ is of type string at this point
  } else {
    const <VALIDATION_ERROR> = validator.validationError;
    console.log(<VALIDATION_ERROR>)
  }

  return NaN;
}
```

Parameter | Description
--- | ---
`<VALIDATION_ERROR>` | Undefined if validation succeeds; Defined else; Contains reason for failed validation
&rarr; `propertyPath` | Trace/Path of property keys (array index, property name) to invalid value; only set if validation value is a complex data type (object, array) >> example: `propertyX.5.propertyY`
&rarr; `propertyTrace` | equivalent to `propertyPath` but stored as array >> `[propertyX, 5, propertyY]`
&rarr; `subErrors` | Each chained validator has its own validation error instance. Errors are caught, processed/expanded and then thrown again by parent validators. Each validator captures thrown child validation errors.
&rarr; `message` | Specific message describing the invalidity

### Validation depending on external influences

!!! WIP !!!

### Predefined validators

Most of the examples given here indicate generic type information of validators. This is optional, in most cases you can validate values without additional type information. The TypeInspector automatically calculates the resulting value type.

```ts
import ti from 'ts-type-inspector';

const <VALUE> = ti.object({
  greeting: ti.string.accept('hello', 'hi')
  greeting2: ti.strict('hello', 'hi')
})

/*
  <VALUE> will assert the following type:
  {
    greeting: string;
    greeting2: 'hello' | 'hi'
  }
*/
```

#### String

> since 1.0.0

Validator for string values.

| Condition | Description |
|---|---|
| shortest | reject strings with lenght less than minimal value |
| longest | reject strings with lenght greater than maximal value |
| accept | accept specific values only; `regexp` can be used to apply patterns |
| reject | reject specific values; `regexp` can be used to apply patterns |
| length | reject strings with divergent length |
| rejectEmpty | reject empty strings |
| base64 | accept just base64 encoded strings |
| json | strings have to be json parsable |
| date | reject strings that are not in ISO8601 date format |
| numeric | strings have to contain a numeric value |
| uuid | reject strings that are no UUIDs |
| email | string has to match email pattern (uses [email-validator](https://www.npmjs.com/package/email-validator)) |
| uri | string has to match uri pattern (uses [url-validator](https://www.npmjs.com/package/url-validator)) |
| url | string has to match url pattern |
| hex | accept just hexadecimal strings |

#### Number

> since 1.0.0

Validator for number values.

| Condition | Description |
|---|---|
| positive | accept positive values only (zero is not positive) |
| negative | accept negative values only (zero is not negative) |
| finite | reject `NaN` or `Infinity` |
| rejectNaN | reject `NaN` |
| rejectInfinity | reject `Infinity` |
| rejectZero | reject 0 |
| min | reject numbers less than minimal value |
| max | reject numbers greater than maximal value |
| accept | accept specific numbers only |
| reject | reject specific numbers |

#### Object

> since 1.0.0

Validator for object based values.
- `null` is rejected by default

| Condition | Description |
|---|---|
| noOverload | reject objects that contain more keys than have been validated. **USE FOR POJOs ONLY!**. Getters/setters or private properties can produce false negatives. |

```ts
import ti from 'ts-type-inspector';

interface DataInterface {
  prop1: string;
  prop2: number;
}

ti.object<DataInterface>({
  prop1: ti.string,
  prop2: ti.number
});
```

#### Partial

> since 2.0.0

Validator for object based values. This is an **UNSAFE** validator that only validates some properties and ignores others
- `null` is rejected

```ts
import ti from 'ts-type-inspector';

interface DataInterface {
  prop1: string;
  prop2: number;
}

ti.partial<DataInterface>({
  prop1: ti.string
});
```

#### Dictionary

> since 1.0.0

Validator for dictionary objects

| Condition | Description |
|---|---|
| keys | a string validator will check the dictionary keys |

```ts
import ti from 'ts-type-inspector';

interface DataInterface {
  prop1: string;
  prop2: number;
}

interface DictionaryDataInterface {
  [key: string]: DataInterface;
}

ti.dictionary<DictionaryDataInterface>(
  ti.object({
    prop1: ti.string,
    prop2: ti.number
  })
);
```

#### Array

> since 1.0.0

Validator for array values.

| Condition | Description |
|---|---|
| length | reject arrays with divergent length |
| min | reject arrays with length less than minimal value |
| max | reject arrays with length greater than maximal value |
| accept | accept arrays with specific length only |
| reject | reject arrays with specific length values |

```ts
import ti from 'ts-type-inspector';

interface DataInterface {
  prop1: string;
  prop2: number;
}

type DataArrayType = DataInterface[];

ti.array<DataArrayType>(
  ti.object({
    prop1: ti.string,
    prop2: ti.number
  })
);
```

#### Tuple

> since 3.0.0

Validator for tuple based values (e.g. `[string, number]`).

| Condition | Description |
|---|---|
| noOverload | reject tuples that contain more entries than have been validated |

```ts
import ti from 'ts-type-inspector';

type DataTuple = [string, number, 'mode1' | 'mode2']

ti.tuple<DataTuple>(
  ti.string,
  ti.number,
  ti.strict('mode1', 'mode2')
);
```

#### Date

> since 1.0.0

Validator for date objects.
- invalid date objects (`isNaN(date.getTime())`) are rejected

| Condition | Description |
|---|---|
| earliest* | reject dates earlier than minimal value |
| latest* | reject dates later than maximal value |
| accept* | accept specific values only |
| reject* | reject specific values |

\* `string` (ISO8601), `number` (timestamp) and `date` can be used.

#### Method

> since 1.0.0

Validator for method-like values.

Unfortunately (for technical reasons), this validator can only validate the number of parameters.

| Condition | Description |
|---|---|
| count | reject methods with divergent params count |
| min | reject methods with params count less than minimal value |
| max | reject methods with params count greater than maximal value |
| accept | accept methods with specific params count only |
| reject | reject methods with specific params count |

#### Union

> since 1.0.0

Validator for union type values (like "string | number")

This is just a wrapper, other validators will do the job.

```ts
import ti from 'ts-type-inspector';

type UnionDataType = string | number;

ti.union<UnionDataType>(
  ti.string,
  ti.number
);
```

#### Strict

> since 1.0.0

Validator for precisely defined values (not just of specific type).

```ts
import ti from 'ts-type-inspector';

type StrictType = 'hello' | 'world';

const <VALUE> = ti.strict<StrictType>('hello', 'world');
```

> In contrast to `union` the strict validator validates the exact value and not just the value type. The resulting `<VALUE>` will be of type `'hello' | 'world'` (and not just `string`)

#### Optional

> since 1.0.0

Validator for optional values.
- `undefined` is valid by default

This is just a wrapper, other validators will do the job.

```ts
import ti from 'ts-type-inspector';

interface DataInterface {
  prop1: string;
  prop2: number;
}

interface MoreDataInterface {
  data1?: DataInterface;
  data2: DataInterface | undefined;
}

ti.object<MoreDataInterface>(
  data1: ti.optional(
    ti.object({
      prop1: ti.string;
      prop2: ti.number;
    })
  ),
  data2: ti.optional(
    ti.object({
      prop1: ti.string;
      prop2: ti.number;
    })
  )
);
```

#### Any

> since 1.0.0

This validator should only be used when a value is indeterminate or when you want to bypass deep validation of an object.

| Condition | Description |
|---|---|
| notNullish | reject null or undefined |
| notFalsy | reject null, undefined, 0, '', false, NaN, ... |

#### Custom

> since 1.0.0

Provide a validation callback to this validator to process a custom validation.

```ts
import ti from 'ts-type-inspector';

ti.custom(value_ => {
  if (value_ === 42) {
    return 'The value cannot be 42'
  }
})
```

> Return an error message if validation fails. Don't throw your own error!

#### Enum

> since 1.0.2

Validator for enum values.

```ts
import ti from 'ts-type-inspector';

enum NumberEnum {
  foo,
  bar
}

enum StringEnum {
  foo = 'foo',
  bar = 'bar'
}

ti.enum(NumberEnum);
ti.enum(StringEnum).values(ti.string.reject(StringEnum.bar));
```

| Condition | Description |
|---|---|
| values | add validator for additional base type validation |

#### Exclude

> since 1.1.0

This validator is able to validate if a type **doesn't** exist in a **KNOWN** union type.

The generics "Out" and "In" have to be set. "In" describes the incoming union type and "Out" the desired output type. The passed validator checks whether the undesired types (= In - Out) exist in the value.

```ts
import ti from 'ts-type-inspector';

type Input = string | number | boolean;

function filter(input_: Input): string | boolean {
  return ti.exclude<string | boolean, Input>(
    ti.number
  ).validate(input_);
}

function filter2(input_: Input): string {
  return ti.exclude<string, Input>(
    ti.union(
      ti.number,
      ti.boolean
    )
  ).validate(input_);
}
```

#### Boolean

> since 1.0.0

Validator for boolean values.

| Condition | Description |
|---|---|
| true | only true is valid |
| false | only false is valid |

#### Undefined

> since 1.0.0

This validator rejects all values that are defined (!== undefined).

#### Null

> since 1.0.0

This validator rejects all values that are not null.

#### Nullish

> since 1.0.0

This validator rejects all values that are not null or undefined.
