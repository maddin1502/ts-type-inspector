import { JestClassExtended } from 'jest-class-extended';
import { TypeInspector } from '../../src/inspector';

const ti = new TypeInspector();
const jce = new JestClassExtended(TypeInspector);

jce.describe(() => {
  jce.test(
    'boolean',
    1,
    () => {
      expect(ti.boolean === ti.boolean).toBe(false);
    }
  );

  jce.test(
    'number',
    1,
    () => {
      expect(ti.number === ti.number).toBe(false);
    }
  );

  jce.test(
    'string',
    1,
    () => {
      expect(ti.string === ti.string).toBe(false);
    }
  );

  jce.test(
    'method',
    1,
    () => {
      expect(ti.method === ti.method).toBe(false);
    }
  );

  jce.test(
    'date',
    1,
    () => {
      expect(ti.date === ti.date).toBe(false);
    }
  );

  jce.test(
    'undefined',
    1,
    () => {
      expect(ti.undefined === ti.undefined).toBe(false);
    }
  );

  jce.test(
    'array',
    1,
    () => {
      expect(ti.array(ti.any) === ti.array(ti.any)).toBe(false);
    }
  );

  jce.test(
    'strict',
    1,
    () => {
      expect(ti.strict(ti.any) === ti.strict(ti.any)).toBe(false);
    }
  );

  jce.test(
    'union',
    1,
    () => {
      expect(ti.union(ti.any, ti.any) === ti.union(ti.any, ti.any)).toBe(false);
    }
  );

  jce.test(
    'object',
    1,
    () => {
      expect(ti.object({}) === ti.object({})).toBe(false);
    }
  );

  jce.test(
    'dictionary',
    1,
    () => {
      expect(ti.dictionary(ti.any) === ti.dictionary(ti.any)).toBe(false);
    }
  );

  jce.test(
    'any',
    1,
    () => {
      expect(ti.any === ti.any).toBe(false);
    }
  );

  jce.test(
    'optional',
    1,
    () => {
      expect(ti.optional(ti.any) === ti.optional(ti.any)).toBe(false);
    }
  );
});
