# ts-type-inspector <!-- omit in toc -->
> The TypeInspector is a data validation tool that is heavily inspired by [Joi](https://www.npmjs.com/package/joi). Due to the type-safety, it can prevent a misconfigured data validation (in contrast to Joi).

[![npm version](https://badge.fury.io/js/ts-type-inspector.svg)](https://badge.fury.io/js/ts-type-inspector)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm downloads](https://badgen.net/npm/dw/ts-type-inspector)](https://badge.fury.io/js/ts-type-inspector)

- [Features](#features)
- [Installation](#installation)
- [Basics](#basics)
- [Validation modes](#validation-modes)
  - [isValid](#isvalid)
  - [validate](#validate)
  - [validOrDefault / validOrFallback](#validordefault--validorfallback)
- [Error evaluation](#error-evaluation)
- [Collect all errors](#collect-all-errors)
- [How to define custom validators](#how-to-define-custom-validators)
  - [Create specialized (data type related) validators](#create-specialized-data-type-related-validators)
  - [Validation based on external influences](#validation-based-on-external-influences)
  - [External influences and nested validators](#external-influences-and-nested-validators)
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
  - [BigInt](#bigint)
  - [Symbol](#symbol)
  - [Instance](#instance)
  - [Map](#map)
  - [Set](#set)
  - [Lazy](#lazy)
  - [Undefined](#undefined)
  - [Null](#null)
  - [Nullish](#nullish)

## Features
- type safe (no automatic type conversions/casting)
- determine the value's data type based on the validators used (generic type arguments are mostly optional)
- custom error messages
- flexible and additional custom validation
- predefined default-validators for most common data types
- extendable validators to take external dependencies into account

## Installation
```bash
npm i ts-type-inspector
```

## Basics

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

## Validation modes

All validators provide **two** validation modes:
- `<VALIDATOR>`.isValid(`<UNKNOWN_VALUE>`)
- `<VALIDATOR>`.validate(`<UNKNOWN_VALUE>`)

Both modes perform the same validation, but their result outputs are different.

### isValid

This mode uses the [type predicate](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates) feature of TypeScript and therefore returns a boolean value as validation result. This assigns an exact type to the (successfully) validated value based on the validator used.

```ts
import ti from 'ts-type-inspector';

function processIncomingValueAsString(value_: unknown): number {
  if (ti.string.isValid(value_)) {
    return value_.length; // typescript knows that the value_ is of type string at this point
  }

  return NaN;
}
```

### validate

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

### validOrDefault / validOrFallback

> since 4.0.0

Two shortcuts when you don't want to deal with `true`/`false` or try-catch. They don't throw: `validOrDefault` returns the validated value or `undefined`, `validOrFallback` returns the validated value or a fallback you provide.

```ts
import ti from 'ts-type-inspector';

ti.number.validOrDefault(42);      // 42
ti.number.validOrDefault('nope');  // undefined

ti.number.validOrFallback(42, 0);     // 42
ti.number.validOrFallback('nope', 0); // 0
```

## Error evaluation

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

Or you can use `isValidationError` with try-catch.

```ts
import ti, { isValidationError } from 'ts-type-inspector';

function processIncomingValueAsString(value_: unknown): number {
  try {
    const stringValue = ti.string.validate(value_);
    return stringValue.length;
  } catch (reason_) {
    if (isValidationError(reason_)) {
      console.log(reason_); // <VALIDATION_ERROR>
    }

    return NaN;
  }
}
```

Parameter | Description
--- | ---
`<VALIDATION_ERROR>` | Undefined if validation succeeds; Defined else; Contains reason for failed validation
&rarr; `propertyPath` | Trace/Path of property keys (array index, property name) to invalid value; only set if validation value is a complex data type (object, array) >> example: `propertyX.5.propertyY`
&rarr; `propertyTrace` | equivalent to `propertyPath` but stored as array >> `[propertyX, 5, propertyY]`
&rarr; `subErrors` | Each chained validator has its own validation error instance. Errors are caught, processed/expanded and then thrown again by parent validators. Each validator captures thrown child validation errors.
&rarr; `message` | Specific message describing the invalidity

## Collect all errors

By default validation stops at the first invalidity. If you want ALL of them instead (e.g. to show every invalid form field at once) add `.aggregate` to a container validator (object, partial, array, tuple, dictionary, map, set). It collects one sub-error per invalid child instead of throwing on the first one.

```ts
import ti, { flattenValidationError } from 'ts-type-inspector';

const validator = ti.object({
  name: ti.string,
  age: ti.number
}).aggregate;

validator.isValid({ name: 42, age: 'old' }); // false

// flattenValidationError turns the (nested) error into a flat list
flattenValidationError(validator.validationError);
/*
  [
    { path: 'name', message: 'value is not a string' },
    { path: 'age', message: 'value is not a number' }
  ]
*/
```

> `.aggregate` only affects container validators. On value validators (string, number, ...) it does nothing.
> `flattenValidationError` also works without `.aggregate` - then you simply get a single entry.

## How to define custom validators

### Create specialized (data type related) validators

All predefined default validators can be inherited to create custom validators for specific data types. Validation of complex data types can therefore be easily centralized for reuse.

```ts
import { DefaultObjectValidator, ti } from 'ts-type-inspector';

export type CommonData = {
  data: string | undefined;
};

export class CommonDataValidator extends DefaultObjectValidator<CommonData> {
  constructor() {
    super({
      data: ti.optional(ti.string)
    });
  }
}

const cdv = new CommonDataValidator();
cdv.isValid({ data: undefined }) // true
cdv.isValid({ data: false }) // false
```

### Validation based on external influences

Sometimes data validation depends on external influences that limit the actual data type or its range of values. These influencing factors can be defined for custom validators and passed during validation. This means that a new validator does not necessarily have to be developed for every use case.

This simple example demonstrates 3 options to implement extended validation:

```ts
import { DefaultObjectValidator, ti } from 'ts-type-inspector';

export type CommonData = {
  data: string | undefined;
};

export type CommonDataValidationParameter = {
  valueRequired?: boolean;
};

export class CommonDataValidator extends DefaultObjectValidator<
  CommonData,
  CommonDataValidationParameter
> {
  constructor() {
    super({
      data: ti.optional(ti.string)
    });

    // 1. option - use the custom condition
    this.custom((value_, params_) => {
      if (params_?.valueRequired && value_.data === undefined) {
        return 'data is required';
      }
    });
  }

  // 2. option - create a new condition
  public get failWhenRequired() {
    this.setupCondition((value_, params_) => {
      if (params_?.valueRequired && value_.data === undefined) {
        this.throwValidationError('data is required');
      }
    });
    return this;
  }

  // 3. option - extend base type validation
  protected validateBaseType(
    value_: unknown,
    params_?: CommonDataValidationParameter
  ): CommonData {
    const base = super.validateBaseType(value_, params_);

    if (params_?.valueRequired && base.data === undefined) {
      this.throwValidationError('data is required');
    }

    return base;
  }
}

const cdv = new CommonDataValidator();
const value: CommonData = { data: undefined };

// when using 1. or 3. option
cdv.isValid(value); // true
cdv.isValid(value, { valueRequired: true }); // false

// when using 2. option
cdv.isValid(value, { valueRequired: true }); // true
cdv.failWhenRequired.isValid(value, { valueRequired: true }); // false
```

### External influences and nested validators

Relevant to: Object, Partial, Dictionary, Array, Tuple, Map, Set

Sometimes a nested validator needs the parent's validation params. `ti.nested` (since 4.0.0) wraps a validator and maps the parent params to the nested validator's params. The type of the parent params is **inferred automatically** from the surrounding validator - no annotation, no assertion.

```ts
import { DefaultObjectValidator, DefaultStringValidator, ti } from 'ts-type-inspector';

export type CommonData = {
  data: string;
};
export type SpecialStringValidationParams = {
  notEmpty?: boolean;
};

type CommonDataValidationParams = {
  dataParams?: SpecialStringValidationParams;
};

export class SpecialStringValidator extends DefaultStringValidator<SpecialStringValidationParams> {
  constructor() {
    super();
    this.custom((value_, params_) => {
      if (params_?.notEmpty && value_ === '') {
        return 'empty is not allowed';
      }
    });
  }
}

export class CommonDataValidator extends DefaultObjectValidator<
  CommonData,
  CommonDataValidationParams
> {
  constructor() {
    super({
      // params_ is automatically typed as CommonDataValidationParams | undefined
      data: ti.nested(
        new SpecialStringValidator(),
        (params_) => params_?.dataParams
      )
    });
  }
}

const cdv = new CommonDataValidator();
cdv.isValid({ data: '' }); // true
cdv.isValid({ data: '' }, { dataParams: { notEmpty: true } }); // false
```

> `ti.nested` only makes sense inside a container (object, partial, dictionary, array, tuple, map, set) - it is not a standalone validator.

## Predefined validators

Most of the examples given here indicate generic type information of validators. This is optional, in most cases you can validate values without additional type information. The TypeInspector automatically calculates the resulting value type.

```ts
import ti from 'ts-type-inspector';

const <VALUE> = ti.object({
  greeting: ti.string.accept('hello', 'hi'),
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

### String

> since 1.0.0

Validator for string values.

| Condition | Description |
|---|---|
| shortest | reject strings with length less than minimal value |
| longest | reject strings with length greater than maximal value |
| accept | accept specific values only; `regexp` can be used to apply patterns |
| reject | reject specific values; `regexp` can be used to apply patterns |
| length | reject strings with divergent length |
| rejectEmpty | reject empty strings |
| base64 | accept only base64 encoded strings |
| json | strings have to be json parsable |
| date | reject strings that are not in ISO8601 date format |
| numeric | strings have to contain a numeric value |
| uuid | reject strings that are not UUIDs |
| email | string has to match email pattern (uses [email-validator](https://www.npmjs.com/package/email-validator)) |
| uri | string has to match uri pattern (uses [valid-url](https://www.npmjs.com/package/valid-url)) |
| url | string has to match url pattern |
| hex | accept only hexadecimal strings |
| startsWith | string has to start with the given value |
| endsWith | string has to end with the given value |
| includes | string has to contain the given value |

### Number

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
| integer | accept integers only |
| safeInteger | accept safe integers only |
| multipleOf | number has to be a multiple of the given base |

### Object

> since 1.0.0

Validator for object based values.
- `null` is rejected by default

| Condition | Description |
|---|---|
| noOverload | reject objects that contain more keys than have been validated. **USE FOR POJOs ONLY!**. Getters/setters or private properties can produce false negatives. |
| rejectArray | reject array values (arrays are objects too and pass by default) |

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

Since 4.0.0 you can get back the validators you defined for the properties via `prop` / `props` (works on object and partial):

```ts
import ti from 'ts-type-inspector';

const validator = ti.object({ prop1: ti.string, prop2: ti.number });

validator.prop('prop1'); // the validator defined for prop1
validator.props();       // the whole property validators map
```

### Partial

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

### Dictionary

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

### Array

> since 1.0.0

Validator for array values.

| Condition | Description |
|---|---|
| length | reject arrays with divergent length |
| min | reject arrays with length less than minimal value |
| max | reject arrays with length greater than maximal value |
| accept | accept only arrays whose items are all among the given values |
| reject | reject arrays that contain any of the given values |

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

### Tuple

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

### Date

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

### Method

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

### Union

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

### Strict

> since 1.0.0

Validator for precisely defined values (not just of specific type).

```ts
import ti from 'ts-type-inspector';

type StrictType = 'hello' | 'world';

const <VALUE> = ti.strict<StrictType>('hello', 'world');
```

> In contrast to `union` the strict validator validates the exact value and not just the value type. The resulting `<VALUE>` will be of type `'hello' | 'world'` (and not just `string`)

### Optional

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

ti.object<MoreDataInterface>({
  data1: ti.optional(
    ti.object({
      prop1: ti.string,
      prop2: ti.number
    })
  ),
  data2: ti.optional(
    ti.object({
      prop1: ti.string,
      prop2: ti.number
    })
  )
});
```

### Any

> since 1.0.0

This validator should only be used when a value is indeterminate or when you want to bypass deep validation of an object.

| Condition | Description |
|---|---|
| notNullish | reject null or undefined |
| notFalsy | reject null, undefined, 0, '', false, NaN, ... |

### Custom

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

### Enum

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

Since 3.3.0 enum validation is compatible with flags by passing the "allowFlags" parameter.

```ts
import ti from 'ts-type-inspector';

enum FlagsEnum {
  flag1 = 1,
  flag2 = 2,
  flag3 = 4,
  flag4 = 8
}

ti.enum(FlagsEnum, true);
// .isValid(FlagsEnum.flag2 | FlagsEnum.flag4) ==> true
```

| Condition | Description |
|---|---|
| values | add validator for additional base type validation |

### Exclude

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

### Boolean

> since 1.0.0

Validator for boolean values.

| Condition | Description |
|---|---|
| true | only true is valid |
| false | only false is valid |

### BigInt

> since 4.0.0

Validator for bigint values.

| Condition | Description |
|---|---|
| positive | accept positive values only (zero is not positive) |
| negative | accept negative values only (zero is not negative) |
| rejectZero | reject 0n |
| min | reject values less than minimal value |
| max | reject values greater than maximal value |
| accept | accept specific values only |
| reject | reject specific values |

### Symbol

> since 4.0.0

Validator for symbol values.

### Instance

> since 4.0.0

Validator for class instances. Uses the `instanceof` operator.

```ts
import ti from 'ts-type-inspector';

class Animal {}

ti.instance(Animal);
// .isValid(new Animal()) ==> true
```

### Map

> since 4.0.0

Validator for Map values. Each key and value has to match its validator.

```ts
import ti from 'ts-type-inspector';

ti.map(ti.string, ti.number);
// .isValid(new Map([['a', 1]])) ==> true
```

### Set

> since 4.0.0

Validator for Set values. Each item has to match the item validator.

```ts
import ti from 'ts-type-inspector';

ti.set(ti.number);
// .isValid(new Set([1, 2, 3])) ==> true
```

### Lazy

> since 4.0.0

Resolves the validator lazily (on validation). Use this for recursive/self-referential types where the validator has to reference itself.

```ts
import ti from 'ts-type-inspector';

interface TreeNode {
  value: number;
  children: TreeNode[];
}

const treeValidator = ti.object<TreeNode>({
  value: ti.number,
  children: ti.array(ti.lazy(() => treeValidator)) // reference itself
});
```

### Undefined

> since 1.0.0

This validator rejects all values that are defined (!== undefined).

### Null

> since 1.0.0

This validator rejects all values that are not null.

### Nullish

> since 1.0.0

This validator rejects all values that are not null or undefined.
