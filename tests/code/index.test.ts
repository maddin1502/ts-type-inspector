import { describe, expect, test } from 'vitest';
import ti, { TypeInspector, ti as ti2 } from '../../src/index.js';

describe('root export', () => {
  test('default', () => {
    expect.assertions(3);
    expect(ti).toBeInstanceOf(TypeInspector);
    expect(ti2).toBeInstanceOf(TypeInspector);
    expect(ti).toEqual(ti2);
  });
});
