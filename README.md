# ts-type-inspector
> The TypeInspector is a data validation tool that is heavily inspired by [Joi](https://www.npmjs.com/package/joi). Due to the type-safety, it can prevent a misconfigured data validation (in contrast to Joi).

[![npm version](https://badge.fury.io/js/ts-type-inspector.svg)](https://badge.fury.io/js/ts-type-inspector)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm downloads](https://badgen.net/npm/dw/ts-type-inspector)](https://badge.fury.io/js/ts-type-inspector)

## Features
- type safe
- custom error messages
- additional custom validation
- predefined validators for most data types

## Installation
```bash
npm i ts-type-inspector
```
or
```bash
yarn add ts-type-inspector
```

## Usage

```ts
import ti from 'ts-type-inspector';

ti.<VALIDATOR>.<CONDITION1>.<CONDITION2>()...;
ti.<VALIDATOR>(<VALIDATION_PARAMS>).<CONDITION1>.<CONDITION2>()...;
```

Parameter | Description
--- | ---
`<VALIDATOR>` | There are various validators that can be used for validation of diverse value-types (string, number, date, object, ...)
`<VALIDATION_PARAMS>` | Some validators need configuration parameters to work correctly (array -> item validator, object -> property validators, ...)
`<CONDITION>` | The TypeInspector uses method-chaining to define special validation conditions. These are additional checks that evaluate the incoming value more precisely
### Validation modes

All validators provide **two** validation modes:
- `<VALIDATOR>`.isValid(`<UNKNOWN_VALUE>`)
- `<VALIDATOR>`.validate(`<UNKNOWN_VALUE>`)

Both modes perform the same validation, but their result outputs are different.

#### isValid()

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

#### validate()

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

### Validation order

1. Basic data type
2. Conditions

The validation is terminated immediately when an invalidity occurs.

### Validation error

The validation error is saved in the validator and can therefore be easily evaluated. Since the validation is terminated immediately when an invalidity occurs, the error only contains information about this specific invalidity.

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
`-> propertyPath` | Trace/Path of property keys (array index, property name) to invalid value; only set if validation value is a complex data type (object, array) >> example: `propertyX.5.propertyY`
`-> propertyTrace` | equivalent to `propertyPath` but stored as array >> `[propertyX, 5, propertyY]`
`-> subErrors` | Each chained validator has its own validation error instance. Errors are caught, processed/expanded and then thrown again by parent validators. Each validator captures thrown child validation errors.
`-> message` | Specific message describing the invalidity

### Validators

Most of the examples given here indicate generic type information of validators. This is optional, in most cases you can validate values without additional type information. The TypeInspector automatically calculates the resulting value type

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
| email | string has to match email pattern |
| uri | string has to match uri pattern |
| url | string has to match url pattern |
| hex | accept just hexadecimal strings |

#### Number

> since 1.0.0

Validator for number values.

| Condition | Description |
|---|---|
| positive | accept positive values only (zero is not positiv) |
| negative | accept negative values only (zero is not negative) |
| finite | reject `NaN` or `Infinity` |
| rejectNaN | reject `NaN` |
| rejectInfinity | reject `Infinity` |
| rejectZero | reject 0 |
| min | reject numbers less than minimal value |
| max | reject numbers greater than maximal value |
| accept | accept specific numbers only |
| reject | reject specific numbers |

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

#### Object

> since 1.0.0

Validator for object based values.
- `null` is rejected

| Condition | Description |
|---|---|
| noOverload | reject objects that contain more keys than have been validated **USE FOR POJOs ONLY!**. Getter/Setter or private properties will lead to false negative results |

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
