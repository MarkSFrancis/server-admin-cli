import { readFromGlob } from '@/lib/fs/glob/resolveGlob';
import { getExternalMovieSubtitlesGlobs } from '@/lib/paths/subtitles/getExternalMovieSubtitlesGlobs';
import { beforeEach, test, mock } from 'node:test';
import assert from 'node:assert';

const readFromGlobMock = mock.fn<typeof readFromGlob>();

mock.module('@/lib/fs/glob/resolveGlob', {
  namedExports: { readFromGlob: readFromGlobMock },
});

const getExternalMovieSubtitlesGlobsMock =
  mock.fn<typeof getExternalMovieSubtitlesGlobs>();

mock.module('@/lib/paths/subtitles/getExternalMovieSubtitlesGlobs', {
  namedExports: {
    getExternalMovieSubtitlesGlobs: getExternalMovieSubtitlesGlobsMock,
  },
});
const { getExternalSubtitlesForMovie } = await import(
  './getExternalSubtitlesForMovie'
);

beforeEach(() => {
  getExternalMovieSubtitlesGlobsMock.mock.resetCalls();
  getExternalMovieSubtitlesGlobsMock.mock.mockImplementation(() => [
    'test-glob',
  ]);

  readFromGlobMock.mock.resetCalls();
  readFromGlobMock.mock.mockImplementation(async () => []);
});

test('should get and execute glob', async () => {
  getExternalMovieSubtitlesGlobsMock.mock.mockImplementation(() => [
    'file-glob',
  ]);

  await getExternalSubtitlesForMovie('/var/file.mkv');

  assert.deepStrictEqual(
    getExternalMovieSubtitlesGlobsMock.mock.calls.map((c) => c.arguments),
    [['/var/file.mkv']]
  );
  assert.deepStrictEqual(
    readFromGlobMock.mock.calls.map((c) => c.arguments),
    [['file-glob']]
  );
});

test('should get and execute each glob', async () => {
  getExternalMovieSubtitlesGlobsMock.mock.mockImplementation(() => [
    'file-glob',
    'file-glob-2',
  ]);

  await getExternalSubtitlesForMovie('/var/file.mkv');

  assert.deepStrictEqual(
    getExternalMovieSubtitlesGlobsMock.mock.calls.map((c) => c.arguments),
    [['/var/file.mkv']]
  );
  assert.deepStrictEqual(
    readFromGlobMock.mock.calls.map((c) => c.arguments),
    [['file-glob'], ['file-glob-2']]
  );
});

test('should return all found paths', async () => {
  getExternalMovieSubtitlesGlobsMock.mock.mockImplementation(() => [
    'file-glob-1',
    'file-glob-2',
  ]);
  readFromGlobMock.mock.mockImplementation(async (glob) => {
    if (glob === 'file-glob-1') {
      return ['file-1', 'file-2'];
    } else if (glob === 'file-glob-2') {
      return ['file-3', 'file-4', 'file-5'];
    } else {
      throw new Error('Called with non-test glob');
    }
  });

  const results = await getExternalSubtitlesForMovie('/var/file.mkv');

  assert.ok(results.includes('file-1'));
  assert.ok(results.includes('file-2'));
  assert.ok(results.includes('file-3'));
  assert.ok(results.includes('file-4'));
  assert.ok(results.includes('file-5'));
});
