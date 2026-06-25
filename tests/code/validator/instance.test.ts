import { TypeInspector } from '@/inspector.js';
import { DefaultInstanceValidator } from '@/validator/instance.js';
import { describe, expect, test } from 'vitest';

const ti = new TypeInspector();

class Animal {
  public legs = 4;
}

class Dog extends Animal {
  public bark(): string {
    return 'woof';
  }
}

describe(DefaultInstanceValidator, () => {
  test('isValid - success', () => {
    expect.assertions(4);
    expect(ti.instance(Animal).isValid(new Animal())).toBe(true);
    expect(ti.instance(Animal).isValid(new Dog())).toBe(true); // subclass
    expect(ti.instance(Dog).isValid(new Dog())).toBe(true);
    expect(ti.instance(Date).isValid(new Date())).toBe(true);
  });

  test('isValid - failure', () => {
    expect.assertions(5);
    expect(ti.instance(Dog).isValid(new Animal())).toBe(false); // superclass
    expect(ti.instance(Animal).isValid({})).toBe(false);
    expect(ti.instance(Animal).isValid(null)).toBe(false);
    expect(ti.instance(Animal).isValid(undefined)).toBe(false);
    expect(ti.instance(Date).isValid('2021-01-01')).toBe(false);
  });
});
