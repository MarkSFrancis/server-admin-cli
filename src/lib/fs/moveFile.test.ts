import { type Stats } from 'fs';
import { mkdir, rename } from 'fs/promises';
import { stub } from '../test-utils/stub';
import { pathExists } from './pathExists';
import { mock, beforeEach, it } from 'node:test';
import assert from 'node:assert';

const mkdirMock = mock.fn<typeof mkdir>();
const renameMock = mock.fn<typeof rename>();
const pathExistsMock = mock.fn<typeof pathExists>();

mock.module('fs/promises', {
  namedExports: {
    mkdir: mkdirMock,
    rename: renameMock,
  },
});
mock.module('./pathExists', {
  namedExports: {
    pathExists: pathExistsMock,
  },
});

const { moveFile } = await import('./moveFile');

beforeEach(() => {
  mkdirMock.mock.resetCalls();
  renameMock.mock.resetCalls();
  pathExistsMock.mock.resetCalls();

  pathExistsMock.mock.mockImplementation(async () => false);
});

it('should throw if `override` is `false` and the file already exists', async () => {
  pathExistsMock.mock.mockImplementation(async () => stub<Stats>({}));

  await assert.rejects(
    async () =>
      await moveFile('/var/source/file1.txt', '/var/dest/file1.txt', {
        overwrite: false,
      })
  );

  assert.deepStrictEqual(
    pathExistsMock.mock.calls.map((c) => c.arguments),
    [['/var/dest/file1.txt']]
  );
  assert.strictEqual(renameMock.mock.calls.length, 0);
});

it('should create the destination folder', async () => {
  await moveFile('/var/source/file1.txt', '/var/dest/file1.txt', {
    overwrite: false,
  });

  assert.deepStrictEqual(
    mkdirMock.mock.calls.map((c) => c.arguments),
    [['/var/dest', { recursive: true }]]
  );
});

it('should override if `override` is `true` and the file already exists', async () => {
  pathExistsMock.mock.mockImplementation(async () => stub<Stats>({}));

  await moveFile('/var/source/file1.txt', '/var/dest/file1.txt', {
    overwrite: true,
  });

  assert.deepStrictEqual(
    mkdirMock.mock.calls.map((c) => c.arguments),
    [['/var/dest', { recursive: true }]]
  );
  assert.deepStrictEqual(
    renameMock.mock.calls.map((c) => c.arguments),
    [['/var/source/file1.txt', '/var/dest/file1.txt']]
  );
});

it('should move the file to the new path if `override` is `false` and the file does not already exist', async () => {
  pathExistsMock.mock.mockImplementation(async () => false);

  await moveFile('/var/source/file1.txt', '/var/dest/file1.txt', {
    overwrite: false,
  });

  assert.deepStrictEqual(
    mkdirMock.mock.calls.map((c) => c.arguments),
    [['/var/dest', { recursive: true }]]
  );
  assert.deepStrictEqual(
    renameMock.mock.calls.map((c) => c.arguments),
    [['/var/source/file1.txt', '/var/dest/file1.txt']]
  );
});
