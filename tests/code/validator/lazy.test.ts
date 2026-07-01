import { TypeInspector } from '@/inspector.js';
import type { Validator } from '@/types.js';
import { DefaultLazyValidator } from '@/validator/lazy.js';
import { describe, expect, test } from 'vitest';

const ti = new TypeInspector();

interface TreeNode {
  value: number;
  children: TreeNode[];
}

describe(DefaultLazyValidator, () => {
  test('isValid - recursive schema', () => {
    expect.assertions(2);
    const treeValidator: Validator<TreeNode> = ti.object<TreeNode>({
      value: ti.number,
      children: ti.array(ti.lazy(() => treeValidator))
    });

    expect(
      treeValidator.isValid({
        value: 1,
        children: [{ value: 2, children: [{ value: 3, children: [] }] }]
      })
    ).toBe(true);
    expect(
      treeValidator.isValid({
        value: 1,
        children: [{ value: 'nope', children: [] }]
      })
    ).toBe(false);
  });

  test('isValid - simple delegation + failure', () => {
    expect.assertions(2);
    expect(ti.lazy(() => ti.string).isValid('hello')).toBe(true);
    expect(ti.lazy(() => ti.string).isValid(42)).toBe(false);
  });
});
