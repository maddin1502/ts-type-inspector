import { JestClassExtended } from 'jest-class-extended';
import tva, { TypedValueApprover } from '../../src';

const jce = new JestClassExtended(TypedValueApprover);

jce.describe(() => {
  jce.test(
    'boolean',
    1,
    () => {
      expect(tva.boolean === tva.boolean).toBe(false);
    }
  );

  jce.test(
    'number',
    1,
    () => {
      expect(tva.number === tva.number).toBe(false);
    }
  );

  // jce.test(
  //   'string',
  //   1,
  //   () => {
  //     expect(tva.string === tva.string).toBe(false);
  //   }
  // );

  jce.test(
    'method',
    1,
    () => {
      expect(tva.method() === tva.method()).toBe(false);
    }
  );

  jce.test(
    'date',
    1,
    () => {
      expect(tva.date === tva.date).toBe(false);
    }
  );

  jce.test(
    'undefined',
    1,
    () => {
      expect(tva.undefined === tva.undefined).toBe(false);
    }
  );

  jce.test(
    'array',
    1,
    () => {
      expect(tva.array(tva.any) === tva.array(tva.any)).toBe(false);
    }
  );

  jce.test(
    'strict',
    1,
    () => {
      expect(tva.strict(tva.any) === tva.strict(tva.any)).toBe(false);
    }
  );

  jce.test(
    'union',
    1,
    () => {
      expect(tva.union(tva.any, tva.any) === tva.union(tva.any, tva.any)).toBe(false);
    }
  );

  jce.test(
    'object',
    1,
    () => {
      expect(tva.object({}) === tva.object({})).toBe(false);
    }
  );

  jce.test(
    'dictionary',
    1,
    () => {
      expect(tva.dictionary(tva.any) === tva.dictionary(tva.any)).toBe(false);
    }
  );

  jce.test(
    'any',
    1,
    () => {
      expect(tva.any === tva.any).toBe(false);
    }
  );

  jce.test(
    'optional',
    1,
    () => {
      expect(tva.optional(tva.any) === tva.optional(tva.any)).toBe(false);
    }
  );
});
