import { distinct } from './distinct';
import { it } from 'node:test';
import assert from 'node:assert';

it('should return an empty array when given an empty array', () => {
  const unique = [].reduce(distinct, []);

  assert.deepStrictEqual(unique, []);
});

it('should return all items when all items are unique', () => {
  const unique = [1, 2, 3].reduce<number[]>(distinct, []);

  assert.deepStrictEqual(unique, [1, 2, 3]);
});

it('should return distinct items when some are duplicates', () => {
  const unique = [1, 2, 1, 1, 3, 3].reduce<number[]>(distinct, []);

  assert.deepStrictEqual(unique, [1, 2, 3]);
});
