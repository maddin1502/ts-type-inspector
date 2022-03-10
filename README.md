# type-inspector
> The TypeInspector is a data validation tool that is heavily inspired by [Joi](https://www.npmjs.com/package/joi). Due to the type-safety, it can prevent a misconfigured data validation (in contrast to Joi).

[![npm version](https://badge.fury.io/js/type-inspector.svg)](https://badge.fury.io/js/type-inspector)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![npm downloads](https://badgen.net/npm/dw/type-inspector)](https://badge.fury.io/js/type-inspector)

## Features
- type safe
- custom error messages
- additional custom validation
- predefined validators for most data types

## Installation
```bash
npm i type-inspector
```
or
```bash
yarn add type-inspector
```

## Usage

```ts
import ti from 'type-inspector';

ti.<VALIDATOR>(<VALIDATION_PARAMS>).<CONDITION1>().<CONDITION2>()...;
```

Parameter | Description
--- | ---
`<VALIDATOR>` | There are various validators that can be used for validation of diverse value-types (string, number, date, object, ...)
`<VALIDATION_PARAMS>` | Some validators need configuration parameters to work correctly (array -> item validator, object -> property validators, ...)
`<CONDITION>` | The TVA uses method-chaining to define special validation conditions. These are additional checks that evaluate the incoming value more precisely (string().length(42), number().max(42), ...)

### Validation modes

All validators provide **two** validation modes:
- `<VALIDATOR>`.isValid(`<UNKNOWN_VALUE>`)
- `<VALIDATOR>`.validate(`<UNKNOWN_VALUE>`)

Both modes perform the same validation, but their result outputs are different.

#### isValid()

This mode uses the [type predicate](https://www.typescriptlang.org/docs/handbook/advanced-types.html#using-type-predicates) feature of Typescript and therefore returns a boolean value as validation result. This assigns an exact type to the (successfully) validated value based on the validator used.

```ts
import { tva } from '@hbc/data-validation';

function processIncomingValueAsString(value_: unknown): number {
	if (tva.string().isValid(value_)) {
		return value_.length; // typescript knows that the value_ is of type string at this point
	}

	return NaN;
}
```

#### validate()

This mode throws a `ValidationError` when validation fails. On success it returns the **same** value (same object reference - in contrast to Joi) that was validated but with the correct type information.

```ts
import { tva } from '@hbc/data-validation';

function processIncomingValueAsString(value_: unknown): number {
	try {
		const message = tva.string().validate(value_);
		return message.length; // typescript knows that the value_ is of type string at this point
	} catch {
		return NaN;
	}
}
```

### Validation order

1. Basic data type
2. Conditions
3. Custom validation

The validation is terminated immediately when an invalidity occurs.

### Validation error

The validation error is saved in the validator and can therefore be easily evaluated. Since the validation is terminated immediately when an invalidity occurs, the error only contains information about this specific invalidity.

```ts
import { tva } from '@hbc/data-validation';

function processIncomingValueAsString(value_: unknown): number {
	if (tva.string().isValid(value_)) {
		return value_.length; // typescript knows that the value_ is of type string at this point
	} else {
		const <VALIDATION_ERROR> = tva.string().validationError;
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

#### String

Validator for string values.
- empty strings are rejected by default.

| Condition | Description |
|---|---|
| allowEmpty | allow empty strings |
| length | reject strings with divergent length |
| json | strings have to be json parsable |
| base64 | allow just base64 encoded strings |
| hex | allow just hexadecimal strings |
| date | reject strings that are not in ISO8601 date format |
| numeric | strings have to contain a numeric value |
| pattern | a certain pattern of characters have to be met; example pattern `xxx-xxxxx-xx` |
| uuid | reject strings that are no UUIDs |
| email | string has to match email pattern |
| min | reject strings with lenght less than minimal value |
| max | reject strings with lenght greater than maximal value |
| allow | allow specific values only; `regexp` can be used to apply patterns |
| forbid | forbid specific values; `regexp` can be used to apply patterns |

#### Number

Validator for number values.
- NaN is rejected by default
- INFINITY is rejected by default

| Condition | Description |
|---|---|
| positive | allow positive values only (zero is not positiv) |
| negative | allow negative values only (zero is not negative) |
| allowNaN | don't reject NaN |
| allowInfinity | don't reject INFINITY |
| notZero | reject 0 |
| min | reject numbers less than minimal value |
| max | reject numbers greater than maximal value |
| allow | allow specific numbers only |
| forbid | forbid specific values |

#### Boolean

Validator for boolean values.

| Condition | Description |
|---|---|
| true | only true is valid |
| false | only false is valid |

#### Undefined

This validator rejects all values that are defined (!== undefined)

#### Object

Validator for object based values.
- `null` is rejected by default

```ts
import { tva } from '@hbc/data-validation';

interface DataInterface {
	prop1: string;
	prop2: number;
}

tva.object<DataInterface>({
	prop1: tva.string();
	prop2: tva.number();
});
```

| Condition | Description |
|---|---|
| noOverload | reject objects that contain more keys than have been validated **USE FOR POJOs ONLY!**. Getter/Setter or private properties will lead to false negative results |
| empty | has to be empty |

#### Dictionary

Validator for dictionary objects

```ts
import { tva } from '@hbc/data-validation';

interface DataInterface {
	prop1: string;
	prop2: number;
}

interface DictionaryDataInterface {
	[key: string]: DataInterface;
}

tva.dictionary<DataInterface>(
	tva.object({
		prop1: tva.string();
		prop2: tva.number();
	})
);
```

| Condition | Description |
|---|---|
| keys | a string validator will check the dictionary keys |

#### Array

Validator for array-like values

```ts
import { tva } from '@hbc/data-validation';

interface DataInterface {
	prop1: string;
	prop2: number;
}

type DataArrayType = DataInterface[];

tva.array<DataInterface>(
	tva.object({
		prop1: tva.string();
		prop2: tva.number();
	})
);
```

| Condition | Description |
|---|---|
| length | reject arrays with divergent length |
| min | reject arrays with length less than minimal value |
| max | reject arrays with length greater than maximal value |
| allow | allow arrays with specific length only |
| forbid | forbid arrays with specific length values |

#### Date

Validator for date objects.
- invalid date objects (`isNaN(date.getTime())`) are rejected

| Condition | Description |
|---|---|
| min* | reject dates earlier than minimal value |
| max* | reject dates later than maximal value |
| allow* | allow specific values only |
| forbid* | forbid specific values |

\* `string` (ISO8601), `number` (timestamp) and `date` can be used.

#### Method

Validator for method-like values.

Unfortunately (for technical reasons), this validator can only validate the number of parameters.

| Condition | Description |
|---|---|
| params | reject methods with divergent params count |
| min | reject methods with params count less than minimal value |
| max | reject methods with params count greater than maximal value |
| allow | allow methods with specific params count only |
| forbid | forbid methods with specific params count |

#### Union

Validator for union type values (like "string | number")

This is just a wrapper, other validators will do the job.

```ts
import { tva } from '@hbc/data-validation';

type UnionDataType = string | number;

tva.union(
	tva.string(),
	tva.number()
);
```

#### Buffer

Validator for buffer values.

```ts
import { tva } from '@hbc/data-validation';

tva.buffer();
```

#### Not

Validator for reversed validation. This validator fails if the wrapped validator succeeds.

```ts
import { tva } from '@hbc/data-validation';

tva.not(
	tva.string()
);
```

#### Strict

Validator for a precisely defined value (not just of specific type).

```ts
import { tva } from '@hbc/data-validation';

type StrictType = 'hello';

const hello: StrictType = tva.strict('hello');
```

#### Multi strict

Validator for precisely defined values (not just of specific type).

```ts
import { tva } from '@hbc/data-validation';

type StrictType = 'hello' | 'world';

const helloWorld: StrictType = tva.multiStrict('hello', 'world');
```

#### Optional

Validator for optional values.
- `undefined` is valid by default

This is just a wrapper, other validators will do the job.

```ts
import { tva } from '@hbc/data-validation';

interface DataInterface {
	prop1: string;
	prop2: number;
}

interface MoreDataInterface {
	data1?: DataInterface;
	data2: DataInterface | undefined;
}

tva.object<MoreDataInterface>(
	data1: tva.optional(
		tva.object({
			prop1: tva.string();
			prop2: tva.number();
		})
	),
	data2: tva.optional(
		tva.object({
			prop1: tva.string();
			prop2: tva.number();
		})
	)
);
```

#### Detail Id

Validator for DetailIds.

```ts
import { tva } from '@hbc/data-validation';

const detailId = tva.detailId().validate('PI2');
```

#### Any

USE THIS VALIDATOR FOR ANY TYPES ONLY !!!!
Actually this validator does not validate.

| Condition | Description |
|---|---|
| notNullish | reject null or undefined |
