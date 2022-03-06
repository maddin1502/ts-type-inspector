import { JestClassExtended } from 'jest-class-extended';
import { InspectorGadget } from '../../src/inspectorGadget';

const ig = new InspectorGadget();
const jce = new JestClassExtended(InspectorGadget);

jce.describe(() => {
  jce.test(
    'boolean',
    1,
    () => {
      expect(ig.boolean === ig.boolean).toBe(false);
    }
  );

  jce.test(
    'number',
    1,
    () => {
      expect(ig.number === ig.number).toBe(false);
    }
  );

  jce.test(
    'string',
    1,
    () => {
      expect(ig.string === ig.string).toBe(false);
    }
  );

  jce.test(
    'method',
    1,
    () => {
      expect(ig.method() === ig.method()).toBe(false);
    }
  );

  jce.test(
    'date',
    1,
    () => {
      expect(ig.date === ig.date).toBe(false);
    }
  );

  jce.test(
    'undefined',
    1,
    () => {
      expect(ig.undefined === ig.undefined).toBe(false);
    }
  );

  jce.test(
    'array',
    1,
    () => {
      expect(ig.array(ig.any) === ig.array(ig.any)).toBe(false);
    }
  );

  jce.test(
    'strict',
    1,
    () => {
      expect(ig.strict(ig.any) === ig.strict(ig.any)).toBe(false);
    }
  );

  jce.test(
    'union',
    1,
    () => {
      expect(ig.union(ig.any, ig.any) === ig.union(ig.any, ig.any)).toBe(false);
    }
  );

  jce.test(
    'object',
    1,
    () => {
      expect(ig.object({}) === ig.object({})).toBe(false);
    }
  );

  jce.test(
    'dictionary',
    1,
    () => {
      expect(ig.dictionary(ig.any) === ig.dictionary(ig.any)).toBe(false);
    }
  );

  jce.test(
    'any',
    1,
    () => {
      expect(ig.any === ig.any).toBe(false);
    }
  );

  jce.test(
    'optional',
    1,
    () => {
      expect(ig.optional(ig.any) === ig.optional(ig.any)).toBe(false);
    }
  );
});
