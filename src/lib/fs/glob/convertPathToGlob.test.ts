import { convertPathToGlob } from './convertPathToGlob';
import { it } from 'node:test';
import assert from 'node:assert';

it('should escape all special characters', () => {
  const escaped = convertPathToGlob('^[]()?!+@|*');

  assert.strictEqual(escaped, '\\^\\[\\]\\(\\)\\?\\!\\+\\@\\|\\*');
});

it('should escape multiple instaces of the same special character', () => {
  const escaped = convertPathToGlob('[[[test]]]');

  assert.strictEqual(escaped, '\\[\\[\\[test\\]\\]\\]');
});

it('should ignore non-special characters', () => {
  const escaped = convertPathToGlob('test');

  assert.strictEqual(escaped, 'test');
});
