import { readFromGlob } from '@/lib/fs/glob/resolveGlob';
import { getExternalTvSubtitlesGlobs } from '@/lib/paths/subtitles/getExternalTvSubtitlesGlobs';
import assert from 'node:assert';
import { beforeEach, it, mock } from 'node:test';

const getExternalTvSubtitlesGlobsMock =
  mock.fn<typeof getExternalTvSubtitlesGlobs>();
mock.module('@/lib/paths/subtitles/getExternalTvSubtitlesGlobs', {
  namedExports: {
    getExternalTvSubtitlesGlobs: getExternalTvSubtitlesGlobsMock,
  },
});

const resolveGlobMock = mock.fn<typeof readFromGlob>();
mock.module('@/lib/fs/glob/resolveGlob', {
  namedExports: { readFromGlob: resolveGlobMock },
});

const { getExternalSubtitlesForTv } = await import(
  './getExternalSubtitlesForTv'
);

beforeEach(() => {
  getExternalTvSubtitlesGlobsMock.mock.resetCalls();
  resolveGlobMock.mock.resetCalls();

  getExternalTvSubtitlesGlobsMock.mock.mockImplementation(() => ['test-glob']);
  resolveGlobMock.mock.mockImplementation(async () => []);
});

it('should get and execute glob', async () => {
  getExternalTvSubtitlesGlobsMock.mock.mockImplementation(() => ['file-glob']);

  await getExternalSubtitlesForTv('/var/file.mkv');

  assert.deepStrictEqual(
    getExternalTvSubtitlesGlobsMock.mock.calls.map((c) => c.arguments),
    [['/var/file.mkv']]
  );
  assert.deepStrictEqual(
    resolveGlobMock.mock.calls.map((c) => c.arguments),
    [['file-glob']]
  );
});

it('should get and execute each glob', async () => {
  getExternalTvSubtitlesGlobsMock.mock.mockImplementation(() => [
    'file-glob',
    'file-glob-2',
  ]);

  await getExternalSubtitlesForTv('/var/file.mkv');

  assert.deepStrictEqual(
    getExternalTvSubtitlesGlobsMock.mock.calls.map((c) => c.arguments),
    [['/var/file.mkv']]
  );
  assert.deepStrictEqual(
    resolveGlobMock.mock.calls.map((c) => c.arguments),
    [['file-glob'], ['file-glob-2']]
  );
});

it('should return all found paths', async () => {
  getExternalTvSubtitlesGlobsMock.mock.mockImplementation(() => [
    'file-glob-1',
    'file-glob-2',
  ]);
  resolveGlobMock.mock.mockImplementation(async (glob) => {
    if (glob === 'file-glob-1') {
      return ['file-1', 'file-2'];
    } else if (glob === 'file-glob-2') {
      return ['file-3', 'file-4', 'file-5'];
    } else {
      throw new Error('Called with non-test glob');
    }
  });

  const results = await getExternalSubtitlesForTv('/var/file.mkv');

  assert.ok(results.includes('file-1'));
  assert.ok(results.includes('file-2'));
  assert.ok(results.includes('file-3'));
  assert.ok(results.includes('file-4'));
  assert.ok(results.includes('file-5'));
});
