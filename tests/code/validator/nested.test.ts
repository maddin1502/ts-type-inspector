import { DefaultObjectValidator, DefaultStringValidator } from '@/index.js';
import { TypeInspector } from '@/inspector.js';
import { describe, expect, test } from 'vitest';

const ti = new TypeInspector();

type ChildParams = { notEmpty?: boolean };

class SpecialString extends DefaultStringValidator<ChildParams> {
  constructor() {
    super();
    this.custom((value_, params_) =>
      params_?.notEmpty && value_ === '' ? 'empty is not allowed' : undefined
    );
  }
}

type ParentParams = { stringParams?: ChildParams };

class WithParams extends DefaultObjectValidator<{ test: string }, ParentParams> {
  constructor() {
    super({
      test: ti.nested(
        new SpecialString(),
        (parentParams_) => parentParams_?.stringParams
      )
    });
  }
}

describe('ti.nested', () => {
  test('forwards + maps the parent params to the wrapped validator', () => {
    expect.assertions(4);
    const validator = new WithParams();
    expect(validator.isValid({ test: '' })).toBe(true); // no params
    expect(validator.isValid({ test: '' }, {})).toBe(true); // notEmpty unset
    expect(
      validator.isValid({ test: '' }, { stringParams: { notEmpty: true } })
    ).toBe(false);
    expect(
      validator.isValid({ test: 'x' }, { stringParams: { notEmpty: true } })
    ).toBe(true);
  });

  test('reports the failing property path', () => {
    expect.assertions(1);
    expect(() =>
      new WithParams().validate(
        { test: '' },
        { stringParams: { notEmpty: true } }
      )
    ).toThrow('test');
  });
});
