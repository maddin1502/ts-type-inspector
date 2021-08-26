import { Example } from '../../src/example';
import { JestClassExtended } from 'jest-class-extended';

const jce = new JestClassExtended(Example);

jce.describe(() => {
  jce.test(
    'value',
    1,
    () => {
      const instance = jce.mock(42).instance;
      expect(instance.value).toBe(42);
    }
  );
});
