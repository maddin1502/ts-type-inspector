import ti, { TypeInspector, ti as ti2 } from '@/index.js';
import { describe, expect, test } from 'vitest';

describe('root export', () => {
  test('default', () => {
    expect.assertions(3);
    expect(ti).toBeInstanceOf(TypeInspector);
    expect(ti2).toBeInstanceOf(TypeInspector);
    expect(ti).toEqual(ti2);
  });
});
