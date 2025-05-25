import { type Stats } from 'fs';
import { stub } from '../test-utils/stub';
import { mock, beforeEach, it } from 'node:test';
import assert from 'node:assert';

const statMock = mock.fn<(path: string) => Promise<Stats>>();
mock.module('fs/promises', {
  namedExports: {
    stat: statMock,
  },
});

const { pathExists } = await import('./pathExists');

beforeEach(() => {
  statMock.mock.resetCalls();
});

it('should return `Stats` if the path exists', async () => {
  statMock.mock.mockImplementation(async () => stub<Stats>({}));

  const exists = await pathExists('/var/file.txt');

  assert.deepStrictEqual(exists, {});
});

it('should return `false` if the path does not exist', async () => {
  statMock.mock.mockImplementation(() => {
    throw new Error();
  });

  const exists = await pathExists('/var/file.txt');

  assert.strictEqual(exists, false);
});

it('should return `false` if the path is invalid', async () => {
  statMock.mock.mockImplementation(() => {
    throw new Error();
  });

  const exists = await pathExists('this?is?an?invalid?path');

  assert.strictEqual(exists, false);
});
