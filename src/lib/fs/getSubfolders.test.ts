import { type Stats } from 'fs';
import { stub } from '../test-utils/stub';
import { beforeEach, it, mock } from 'node:test';
import assert from 'node:assert';

const statMock = mock.fn<(path: string) => Promise<Stats>>();
const readdirMock = mock.fn<(path: string) => Promise<string[]>>();

mock.module('fs/promises', {
  namedExports: {
    stat: statMock,
    readdir: readdirMock,
  },
});

const { getSubfolders } = await import('./getSubfolders');

beforeEach(() => {
  statMock.mock.resetCalls();
  readdirMock.mock.resetCalls();
});

it('should return a list of subfolders if the path exists', async () => {
  readdirMock.mock.mockImplementation(async () => ['dir-path-1', 'dir-path-2']);
  statMock.mock.mockImplementation(async () =>
    stub<Stats>({
      isDirectory: () => true,
    })
  );

  const subdirs = await getSubfolders('/var/');

  assert.deepStrictEqual(subdirs, ['/var/dir-path-1', '/var/dir-path-2']);
});

it('should throw an error if the path does not exist', async () => {
  readdirMock.mock.mockImplementation(async () => {
    throw new Error();
  });

  await assert.rejects(async () => await getSubfolders('/var/'));
});

it('should exclude files from the result', async () => {
  readdirMock.mock.mockImplementation(async () => [
    'dir-path-1',
    'file-path-1',
    'dir-path-2',
  ]);

  statMock.mock.mockImplementation(async () =>
    stub<Stats>({
      isDirectory: () => true,
    })
  );
  statMock.mock.mockImplementationOnce(
    async () =>
      stub<Stats>({
        isDirectory: () => false,
      }),
    1
  );

  const subfolders = await getSubfolders('/var/');

  assert.deepStrictEqual(subfolders, ['/var/dir-path-1', '/var/dir-path-2']);
});
