import { JestClassExtended } from 'jest-class-extended';
import { InspectorGadget } from '../../../src/inspectorGadget';
import { ObjectValidator } from '../../../src/validator/object';

const ig = new InspectorGadget();
const jce = new JestClassExtended(ObjectValidator);

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    2,
    () => {
      expect(
        ig.object({
          stringProperty: ig.string,
          numberProperty: ig.number,
          arrayProperty: ig.array(ig.boolean),
          unionProperty: ig.union(ig.undefined, ig.date),
          dateProperty: ig.date,
          methodProperty: ig.method(),
          strictStringProperty: ig.strict('world')
        }).isValid({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [true, false, false, true, false],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
      ).toBe(true);

      expect(ig.object({ test: ig.string }).isValid({ test: 'hello', test2: 'world' })).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    13,
    () => {
      expect(
        ig.object({
          stringProperty: ig.string,
          numberProperty: ig.number,
          arrayProperty: ig.array(ig.boolean),
          unionProperty: ig.union(ig.undefined, ig.date),
          dateProperty: ig.date,
          methodProperty: ig.method(),
          strictStringProperty: ig.strict('world')
        }).isValid({
          stringProperty: 42,
          numberProperty: 42,
          arrayProperty: [true, false, false, true, false],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
      ).toBe(false);

      expect(
        ig.object({
          stringProperty: ig.string,
          numberProperty: ig.number,
          arrayProperty: ig.array(ig.boolean),
          unionProperty: ig.union(ig.undefined, ig.date),
          dateProperty: ig.date,
          methodProperty: ig.method(),
          strictStringProperty: ig.strict('world')
        }).isValid({
          stringProperty: 'hello',
          numberProperty: 'hello',
          arrayProperty: [true, false, false, true, false],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
      ).toBe(false);

      expect(
        ig.object({
          stringProperty: ig.string,
          numberProperty: ig.number,
          arrayProperty: ig.array(ig.boolean),
          unionProperty: ig.union(ig.undefined, ig.date),
          dateProperty: ig.date,
          methodProperty: ig.method(),
          strictStringProperty: ig.strict('world')
        }).isValid({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [true, false, false, 1, false],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
      ).toBe(false);

      expect(
        ig.object({
          stringProperty: ig.string,
          numberProperty: ig.number,
          arrayProperty: ig.array(ig.boolean),
          unionProperty: ig.union(ig.undefined, ig.date),
          dateProperty: ig.date,
          methodProperty: ig.method(),
          strictStringProperty: ig.strict('world')
        }).isValid({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [true, false, false, true, false],
          unionProperty: null,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
      ).toBe(false);

      expect(
        ig.object({
          stringProperty: ig.string,
          numberProperty: ig.number,
          arrayProperty: ig.array(ig.boolean),
          unionProperty: ig.union(ig.undefined, ig.date),
          dateProperty: ig.date,
          methodProperty: ig.method(),
          strictStringProperty: ig.strict('world')
        }).isValid({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [true, false, false, true, false],
          unionProperty: undefined,
          dateProperty: Date.now(),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
      ).toBe(false);

      expect(
        ig.object({
          stringProperty: ig.string,
          numberProperty: ig.number,
          arrayProperty: ig.array(ig.boolean),
          unionProperty: ig.union(ig.undefined, ig.date),
          dateProperty: ig.date,
          methodProperty: ig.method(),
          strictStringProperty: ig.strict('world')
        }).isValid({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [true, false, false, true, false],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: {},
          strictStringProperty: 'world'
        })
      ).toBe(false);

      expect(
        ig.object({
          stringProperty: ig.string,
          numberProperty: ig.number,
          arrayProperty: ig.array(ig.boolean),
          unionProperty: ig.union(ig.undefined, ig.date),
          dateProperty: ig.date,
          methodProperty: ig.method(),
          strictStringProperty: ig.strict('world')
        }).isValid({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [true, false, false, true, false],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'hello'
        })
      ).toBe(false);

      expect(
        ig.object({
          stringProperty: ig.string,
          numberProperty: ig.number,
          arrayProperty: ig.array(ig.boolean),
          unionProperty: ig.union(ig.undefined, ig.date),
          dateProperty: ig.date,
          methodProperty: ig.method(),
          strictStringProperty: ig.strict('world')
        }).isValid({})
      ).toBe(false);

      expect(ig.object({}).isValid(undefined)).toBe(false);
      expect(ig.object({}).isValid(1)).toBe(false);
      expect(ig.object({}).isValid(() => true)).toBe(false);
      expect(ig.object({}).isValid(ObjectValidator)).toBe(false);
      expect(ig.object({}).isValid(null)).toBe(false);
    }
  );

  jce.test(
    ['isValid', 'correct conditions'],
    1,
    () => {
      expect(ig.object({ p1: ig.string }).noOverload.isValid({ p1: 'hello' })).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'incorrect conditions'],
    1,
    () => {
      expect(ig.object({ p1: ig.string }).noOverload.isValid({ p1: 'hello', p2: 'world' })).toBe(false);
    }
  );

  jce.test(
    ['validate', 'success'],
    2,
    () => {
      expect(
        () => ig.object({
          stringProperty: ig.string,
          numberProperty: ig.number,
          arrayProperty: ig.array(ig.boolean),
          unionProperty: ig.union(ig.undefined, ig.date),
          dateProperty: ig.date,
          methodProperty: ig.method(),
          strictStringProperty: ig.strict('world')
        }).validate({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [true, false, false, true, false],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
      ).not.toThrow();

      expect(
        () => ig.object({
          test: ig.string
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
        () => ig.object({
          stringProperty: ig.string,
          numberProperty: ig.number,
          arrayProperty: ig.array(ig.boolean),
          unionProperty: ig.union(ig.undefined, ig.date),
          dateProperty: ig.date,
          methodProperty: ig.method(),
          strictStringProperty: ig.strict('world')
        }).validate({
          stringProperty: 42,
          numberProperty: 42,
          arrayProperty: [true, false, false, true, false],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
      ).toThrow('value is not a string');

      expect(
        () => ig.object({
          stringProperty: ig.string,
          numberProperty: ig.number,
          arrayProperty: ig.array(ig.boolean),
          unionProperty: ig.union(ig.undefined, ig.date),
          dateProperty: ig.date,
          methodProperty: ig.method(),
          strictStringProperty: ig.strict('world')
        }).validate({
          stringProperty: 'hello',
          numberProperty: 'hello',
          arrayProperty: [true, false, false, true, false],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
      ).toThrow('value is not a number');

      expect(
        () => ig.object({
          stringProperty: ig.string,
          numberProperty: ig.number,
          arrayProperty: ig.array(ig.boolean),
          unionProperty: ig.union(ig.undefined, ig.date),
          dateProperty: ig.date,
          methodProperty: ig.method(),
          strictStringProperty: ig.strict('world')
        }).validate({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [true, false, false, 1, false],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
      ).toThrow('value is not a boolean');

      expect(
        () => ig.object({
          stringProperty: ig.string,
          numberProperty: ig.number,
          arrayProperty: ig.array(ig.boolean),
          unionProperty: ig.union(ig.undefined, ig.date),
          dateProperty: ig.date,
          methodProperty: ig.method(),
          strictStringProperty: ig.strict('world')
        }).validate({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [true, false, false, true, false],
          unionProperty: null,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
      ).toThrow('value does not match any of the possible types');

      expect(
        () => ig.object({
          stringProperty: ig.string,
          numberProperty: ig.number,
          arrayProperty: ig.array(ig.boolean),
          unionProperty: ig.union(ig.undefined, ig.date),
          dateProperty: ig.date,
          methodProperty: ig.method(),
          strictStringProperty: ig.strict('world')
        }).validate({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [true, false, false, true, false],
          unionProperty: undefined,
          dateProperty: Date.now(),
          methodProperty: () => null,
          strictStringProperty: 'world'
        })
      ).toThrow('value is not a date');

      expect(
        () => ig.object({
          stringProperty: ig.string,
          numberProperty: ig.number,
          arrayProperty: ig.array(ig.boolean),
          unionProperty: ig.union(ig.undefined, ig.date),
          dateProperty: ig.date,
          methodProperty: ig.method(),
          strictStringProperty: ig.strict('world')
        }).validate({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [true, false, false, true, false],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: {},
          strictStringProperty: 'world'
        })
      ).toThrow('value is not a method');

      expect(
        () => ig.object({
          stringProperty: ig.string,
          numberProperty: ig.number,
          arrayProperty: ig.array(ig.boolean),
          unionProperty: ig.union(ig.undefined, ig.date),
          dateProperty: ig.date,
          methodProperty: ig.method(),
          strictStringProperty: ig.strict('world')
        }).validate({
          stringProperty: 'hello',
          numberProperty: 42,
          arrayProperty: [true, false, false, true, false],
          unionProperty: undefined,
          dateProperty: new Date('1970-01-01'),
          methodProperty: () => null,
          strictStringProperty: 'hello'
        })
      ).toThrow('no equality found');

      expect(
        () => ig.object({
          stringProperty: ig.string,
          numberProperty: ig.number,
          arrayProperty: ig.array(ig.boolean),
          unionProperty: ig.union(ig.undefined, ig.date),
          dateProperty: ig.date,
          methodProperty: ig.method(),
          strictStringProperty: ig.strict('world')
        }).validate({})
      ).toThrow('value is not a string');
    }
  );
});
