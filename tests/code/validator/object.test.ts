import { JestClassExtended } from 'jest-class-extended';
import tva from '../../../src';
import { ObjectValidator } from '../../../src/validator/object';

const jce = new JestClassExtended(ObjectValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    2,
    () => {
      expect(
        tva.object({
          stringProperty: tva.string,
          numberProperty: tva.number,
          arrayProperty: tva.array(tva.boolean),
          unionProperty: tva.union(tva.undefined, tva.date),
          dateProperty: tva.date,
          methodProperty: tva.method(),
          strictStringProperty: tva.strict('world')
        }).isValid({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [ true, false, false, true, false ],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
      ).toBe(true);

      expect(tva.object({ test: tva.string }).isValid({ test: 'hello', test2: 'world' })).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    13,
    () => {
      expect(
        tva.object({
          stringProperty: tva.string,
          numberProperty: tva.number,
          arrayProperty: tva.array(tva.boolean),
          unionProperty: tva.union(tva.undefined, tva.date),
          dateProperty: tva.date,
          methodProperty: tva.method(),
          strictStringProperty: tva.strict('world')
        }).isValid({
          stringProperty: 42,
          numberProperty: 42,
          arrayProperty: [ true, false, false, true, false ],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
      ).toBe(false);

      expect(
        tva.object({
          stringProperty: tva.string,
          numberProperty: tva.number,
          arrayProperty: tva.array(tva.boolean),
          unionProperty: tva.union(tva.undefined, tva.date),
          dateProperty: tva.date,
          methodProperty: tva.method(),
          strictStringProperty: tva.strict('world')
        }).isValid({
          stringProperty: 'hello',
          numberProperty: 'hello',
          arrayProperty: [ true, false, false, true, false ],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
      ).toBe(false);

      expect(
        tva.object({
          stringProperty: tva.string,
          numberProperty: tva.number,
          arrayProperty: tva.array(tva.boolean),
          unionProperty: tva.union(tva.undefined, tva.date),
          dateProperty: tva.date,
          methodProperty: tva.method(),
          strictStringProperty: tva.strict('world')
        }).isValid({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [ true, false, false, 1, false ],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
      ).toBe(false);

      expect(
        tva.object({
          stringProperty: tva.string,
          numberProperty: tva.number,
          arrayProperty: tva.array(tva.boolean),
          unionProperty: tva.union(tva.undefined, tva.date),
          dateProperty: tva.date,
          methodProperty: tva.method(),
          strictStringProperty: tva.strict('world')
        }).isValid({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [ true, false, false, true, false ],
          unionProperty: null,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
      ).toBe(false);

      expect(
        tva.object({
          stringProperty: tva.string,
          numberProperty: tva.number,
          arrayProperty: tva.array(tva.boolean),
          unionProperty: tva.union(tva.undefined, tva.date),
          dateProperty: tva.date,
          methodProperty: tva.method(),
          strictStringProperty: tva.strict('world')
        }).isValid({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [ true, false, false, true, false ],
          unionProperty: undefined,
          dateProperty: Date.now(),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
      ).toBe(false);

      expect(
        tva.object({
          stringProperty: tva.string,
          numberProperty: tva.number,
          arrayProperty: tva.array(tva.boolean),
          unionProperty: tva.union(tva.undefined, tva.date),
          dateProperty: tva.date,
          methodProperty: tva.method(),
          strictStringProperty: tva.strict('world')
        }).isValid({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [ true, false, false, true, false ],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: {},
          strictStringProperty: 'world'
        })
      ).toBe(false);

      expect(
        tva.object({
          stringProperty: tva.string,
          numberProperty: tva.number,
          arrayProperty: tva.array(tva.boolean),
          unionProperty: tva.union(tva.undefined, tva.date),
          dateProperty: tva.date,
          methodProperty: tva.method(),
          strictStringProperty: tva.strict('world')
        }).isValid({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [ true, false, false, true, false ],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'hello'
        })
      ).toBe(false);

      expect(
        tva.object({
          stringProperty: tva.string,
          numberProperty: tva.number,
          arrayProperty: tva.array(tva.boolean),
          unionProperty: tva.union(tva.undefined, tva.date),
          dateProperty: tva.date,
          methodProperty: tva.method(),
          strictStringProperty: tva.strict('world')
        }).isValid({})
      ).toBe(false);

      expect(tva.object({}).isValid(undefined)).toBe(false);
      expect(tva.object({}).isValid(1)).toBe(false);
      expect(tva.object({}).isValid(() => true)).toBe(false);
      expect(tva.object({}).isValid(ObjectValidator)).toBe(false);
      expect(tva.object({}).isValid(null)).toBe(false);
    }
  );

  jce.test(
    ['isValid', 'correct conditions'],
    1,
    () => {
      expect(tva.object({ p1: tva.string }).noOverload.isValid({ p1: 'hello' })).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'incorrect conditions'],
    1,
    () => {
      expect(tva.object({ p1: tva.string }).noOverload.isValid({ p1: 'hello', p2: 'world' })).toBe(false);
    }
  );

  jce.test(
    ['validate', 'success'],
    2,
    () => {
      expect(
        () => tva.object({
          stringProperty: tva.string,
          numberProperty: tva.number,
          arrayProperty: tva.array(tva.boolean),
          unionProperty: tva.union(tva.undefined, tva.date),
          dateProperty: tva.date,
          methodProperty: tva.method(),
          strictStringProperty: tva.strict('world')
        }).validate({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [ true, false, false, true, false ],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
      ).not.toThrow();

      expect(
        () => tva.object({
          test: tva.string
        }).isValid({
          test: 'hello',
          test2: 'world'
        })
      ).not.toThrow();
    }
  );

  jce.test(
    ['validate', 'failure'],
    8,
    () => {
      expect(
        () => tva.object({
          stringProperty: tva.string,
          numberProperty: tva.number,
          arrayProperty: tva.array(tva.boolean),
          unionProperty: tva.union(tva.undefined, tva.date),
          dateProperty: tva.date,
          methodProperty: tva.method(),
          strictStringProperty: tva.strict('world')
        }).validate({
          stringProperty: 42,
          numberProperty: 42,
          arrayProperty: [ true, false, false, true, false ],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
      ).toThrow('value is not a string');

      expect(
        () => tva.object({
          stringProperty: tva.string,
          numberProperty: tva.number,
          arrayProperty: tva.array(tva.boolean),
          unionProperty: tva.union(tva.undefined, tva.date),
          dateProperty: tva.date,
          methodProperty: tva.method(),
          strictStringProperty: tva.strict('world')
        }).validate({
          stringProperty: 'hello',
          numberProperty: 'hello',
          arrayProperty: [ true, false, false, true, false ],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
      ).toThrow('value is not a number');

      expect(
        () => tva.object({
          stringProperty: tva.string,
          numberProperty: tva.number,
          arrayProperty: tva.array(tva.boolean),
          unionProperty: tva.union(tva.undefined, tva.date),
          dateProperty: tva.date,
          methodProperty: tva.method(),
          strictStringProperty: tva.strict('world')
        }).validate({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [ true, false, false, 1, false ],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
      ).toThrow('value is not a boolean');

      expect(
        () => tva.object({
          stringProperty: tva.string,
          numberProperty: tva.number,
          arrayProperty: tva.array(tva.boolean),
          unionProperty: tva.union(tva.undefined, tva.date),
          dateProperty: tva.date,
          methodProperty: tva.method(),
          strictStringProperty: tva.strict('world')
        }).validate({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [ true, false, false, true, false ],
          unionProperty: null,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
      ).toThrow('value does not match any of the possible types');

      expect(
        () => tva.object({
          stringProperty: tva.string,
          numberProperty: tva.number,
          arrayProperty: tva.array(tva.boolean),
          unionProperty: tva.union(tva.undefined, tva.date),
          dateProperty: tva.date,
          methodProperty: tva.method(),
          strictStringProperty: tva.strict('world')
        }).validate({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [ true, false, false, true, false ],
          unionProperty: undefined,
          dateProperty: Date.now(),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
      ).toThrow('value is not a date');

      expect(
        () => tva.object({
          stringProperty: tva.string,
          numberProperty: tva.number,
          arrayProperty: tva.array(tva.boolean),
          unionProperty: tva.union(tva.undefined, tva.date),
          dateProperty: tva.date,
          methodProperty: tva.method(),
          strictStringProperty: tva.strict('world')
        }).validate({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [ true, false, false, true, false ],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: {},
          strictStringProperty: 'world'
        })
      ).toThrow('value is not a method');

      expect(
        () => tva.object({
          stringProperty: tva.string,
          numberProperty: tva.number,
          arrayProperty: tva.array(tva.boolean),
          unionProperty: tva.union(tva.undefined, tva.date),
          dateProperty: tva.date,
          methodProperty: tva.method(),
          strictStringProperty: tva.strict('world')
        }).validate({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [ true, false, false, true, false ],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'hello'
        })
      ).toThrow('no equality found');

      expect(
        () => tva.object({
          stringProperty: tva.string,
          numberProperty: tva.number,
          arrayProperty: tva.array(tva.boolean),
          unionProperty: tva.union(tva.undefined, tva.date),
          dateProperty: tva.date,
          methodProperty: tva.method(),
          strictStringProperty: tva.strict('world')
        }).validate({})
      ).toThrow('value is not a string');
    }
  );
});
