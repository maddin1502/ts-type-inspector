import { JestClassExtended } from 'jest-class-extended';
import tva from '../../../src';
import { MethodValidator } from '../../../src/validator/method';

const jce = new JestClassExtended(MethodValidator);

const methodDummy = (x_: number, y_: number) => {
  return x_ * y_;
};

function methodDummy2(x_: number, y_: number): number {
  return x_ * y_;
}

type DummyMethodType = (x_: number, y_?: number, z_?: number) => number;

interface DummyMethodContainerInterface {
  one: DummyMethodType;
  two: DummyMethodType;
  three: DummyMethodType;
}

class DummyMethodContainer implements DummyMethodContainerInterface {
  public one(x_: number): number {
    return x_;
  }

  public two(x_: number, y_?: number): number {
    return x_ + (y_ ?? 0);
  }

  public three(x_: number, y_?: number, z_?: number): number {
    return (z_ ?? 1) * (x_ + (y_ ?? 0));
  }
}

jce.describe(() => {
  jce.test(
    ['isValid', 'success'],
    5,
    () => {
      expect(tva.method().isValid(methodDummy)).toBe(true);
      expect(tva.method().isValid(methodDummy2)).toBe(true);
      const container = new DummyMethodContainer();
      expect(tva.method().isValid(container.one)).toBe(true);
      expect(tva.method().isValid(container.two)).toBe(true);
      expect(tva.method().isValid(container.three)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    7,
    () => {
      expect(tva.method().isValid(undefined)).toBe(false);
      expect(tva.method().isValid(null)).toBe(false);
      expect(tva.method().isValid('42')).toBe(false);
      expect(tva.method().isValid(42)).toBe(false);
      expect(tva.method().isValid({ oh: 'no'})).toBe(false);
      expect(tva.method().isValid(/.*oh.*no:+/)).toBe(false);
      expect(tva.method().isValid(true)).toBe(false);
    }
  );

  jce.test(
    ['isValid', 'correct conditions'],
    5,
    () => {
      expect(tva.method().params(2).isValid(methodDummy)).toBe(true);
      expect(tva.method().params(2).isValid(methodDummy2)).toBe(true);
      const container = new DummyMethodContainer();
      expect(tva.method().params(2).isValid(container.two)).toBe(true);
      expect(tva.method().max(2).isValid(container.two)).toBe(true);
      expect(tva.method().min(3).isValid(container.three)).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'incorrect conditions'],
    5,
    () => {
      expect(tva.method().params(3).isValid(methodDummy)).toBe(false);
      expect(tva.method().params(1).isValid(methodDummy2)).toBe(false);
      const container = new DummyMethodContainer();
      expect(tva.method().params(2).isValid(container.one)).toBe(false);
      expect(tva.method().max(2).isValid(container.three)).toBe(false);
      expect(tva.method().min(3).isValid(container.two)).toBe(false);
    }
  );
});
