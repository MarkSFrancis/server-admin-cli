import { fixWslPath } from './fixWslPath';
import { it } from 'node:test';
import assert from 'node:assert';

it('should do nothing if the path is not a windows drive path', () => {
  const path = fixWslPath('/var/data.db');

  assert.strictEqual(path, '/var/data.db');
});

it('should preserve drive letter and use /mnt/', () => {
  const path = fixWslPath('c:\\file.txt');

  assert.strictEqual(path, '/mnt/c/file.txt');
});

it('should ignore case of the drive letter', () => {
  const path = fixWslPath('Z:\\file.txt');

  assert.strictEqual(path, '/mnt/z/file.txt');
});

it('should preserve path', () => {
  const path = fixWslPath('Z:\\folder\\file.txt');

  assert.strictEqual(path, '/mnt/z/folder/file.txt');
});
