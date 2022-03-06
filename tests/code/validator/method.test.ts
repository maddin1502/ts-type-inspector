import { JestClassExtended } from 'jest-class-extended';
import { InspectorGadget } from '../../../src/inspectorGadget';
import { MethodValidator } from '../../../src/validator/method';

const ig = new InspectorGadget();
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
      expect(ig.method().isValid(methodDummy)).toBe(true);
      expect(ig.method().isValid(methodDummy2)).toBe(true);
      const container = new DummyMethodContainer();
      expect(ig.method().isValid(container.one.bind(container))).toBe(true);
      expect(ig.method().isValid(container.two.bind(container))).toBe(true);
      expect(ig.method().isValid(container.three.bind(container))).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'failure'],
    7,
    () => {
      expect(ig.method().isValid(undefined)).toBe(false);
      expect(ig.method().isValid(null)).toBe(false);
      expect(ig.method().isValid('42')).toBe(false);
      expect(ig.method().isValid(42)).toBe(false);
      expect(ig.method().isValid({ oh: 'no' })).toBe(false);
      expect(ig.method().isValid(/.*oh.*no:+/)).toBe(false);
      expect(ig.method().isValid(true)).toBe(false);
    }
  );

  jce.test(
    ['isValid', 'correct conditions'],
    5,
    () => {
      expect(ig.method().count(2).isValid(methodDummy)).toBe(true);
      expect(ig.method().count(2).isValid(methodDummy2)).toBe(true);
      const container = new DummyMethodContainer();
      expect(ig.method().count(2).isValid(container.two.bind(container))).toBe(true);
      expect(ig.method().max(2).isValid(container.two.bind(container))).toBe(true);
      expect(ig.method().min(3).isValid(container.three.bind(container))).toBe(true);
    }
  );

  jce.test(
    ['isValid', 'incorrect conditions'],
    5,
    () => {
      expect(ig.method().count(3).isValid(methodDummy)).toBe(false);
      expect(ig.method().count(1).isValid(methodDummy2)).toBe(false);
      const container = new DummyMethodContainer();
      expect(ig.method().count(2).isValid(container.one.bind(container))).toBe(false);
      expect(ig.method().max(2).isValid(container.three.bind(container))).toBe(false);
      expect(ig.method().min(3).isValid(container.two.bind(container))).toBe(false);
    }
  );
});
