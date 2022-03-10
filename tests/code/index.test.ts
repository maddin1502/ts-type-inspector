import ti, { TypeInspector } from '../../src';

describe('root export', () => {
  test('default', () => {
    expect.assertions(1);
    expect(ti).toBeInstanceOf(TypeInspector);
  });
});
