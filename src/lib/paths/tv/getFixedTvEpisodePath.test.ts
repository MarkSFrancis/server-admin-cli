import { getTvEpisodeNumber } from './getTvEpisodeNumber';
import { getTvSeasonNumber } from './getTvSeasonNumber';
import { mock, it, beforeEach } from 'node:test';
import assert from 'node:assert';

const getTvSeasonNumberMock = mock.fn(getTvSeasonNumber);
const getTvEpisodeNumberMock = mock.fn(getTvEpisodeNumber);

mock.module('./getTvEpisodeNumber', {
  namedExports: {
    getTvEpisodeNumber: getTvEpisodeNumberMock,
  },
});
mock.module('./getTvSeasonNumber', {
  namedExports: {
    getTvSeasonNumber: getTvSeasonNumberMock,
  },
});

const { getFixedTvEpisodePath } = await import('./getFixedTvEpisodePath');

const defaults = {
  seasonNumber: 2,
  episodeNumber: 3,
};

beforeEach(() => {
  getTvSeasonNumberMock.mock.resetCalls();
  getTvEpisodeNumberMock.mock.resetCalls();

  getTvSeasonNumberMock.mock.mockImplementation(
    async () => defaults.seasonNumber
  );
  getTvEpisodeNumberMock.mock.mockImplementation(
    async () => defaults.episodeNumber
  );
});

it('should preserve current episode path', async () => {
  const rootPath = '/test1/test2/test3/test4';
  const fixedPath = await getFixedTvEpisodePath(`${rootPath}/File.mkv`);

  assert.ok(fixedPath.startsWith(rootPath));
});

it('should preserve file extension', async () => {
  const fixedPath = await getFixedTvEpisodePath('/File.mp3');

  assert.ok(fixedPath.endsWith('.mp3'));
});

it('should set episode name as a padded episode number', async () => {
  getTvEpisodeNumberMock.mock.mockImplementation(async () => 1);

  const fixedPath = await getFixedTvEpisodePath('/File.mkv');

  assert.ok(fixedPath.endsWith('/E01.mkv'));
});

it("should set episode name without padding if it's 3 digits long", async () => {
  getTvEpisodeNumberMock.mock.mockImplementation(async () => 200);

  const fixedPath = await getFixedTvEpisodePath('/File.mkv');

  assert.ok(fixedPath.endsWith('/E200.mkv'));
});

it("should create season folder if one doesn't exist", async () => {
  getTvSeasonNumberMock.mock.mockImplementation(async () => 2);

  const fixedPath = await getFixedTvEpisodePath('/File.mkv');

  assert.ok(fixedPath.startsWith('/Season 2/'));
});

it('should not create season folder if one already exists', async () => {
  getTvSeasonNumberMock.mock.mockImplementation(async () => 2);
  getTvEpisodeNumberMock.mock.mockImplementation(async () => 1);

  const fixedPath = await getFixedTvEpisodePath('/Season 2/File.mkv');

  assert.strictEqual(fixedPath, '/Season 2/E01.mkv');
});

it('should use Specials if season is zero', async () => {
  getTvSeasonNumberMock.mock.mockImplementation(async () => 0);

  const fixedPath = await getFixedTvEpisodePath('/File.mkv');

  assert.ok(fixedPath.startsWith('/Specials/'));
});

it('should not create Specials folder if one already exists', async () => {
  getTvSeasonNumberMock.mock.mockImplementation(async () => 0);
  getTvEpisodeNumberMock.mock.mockImplementation(async () => 1);

  const fixedPath = await getFixedTvEpisodePath('/Specials/File.mkv');

  assert.strictEqual(fixedPath, '/Specials/S00E01.mkv');
});

it('should use S00 in filename if season is zero', async () => {
  getTvSeasonNumberMock.mock.mockImplementation(async () => 0);
  getTvEpisodeNumberMock.mock.mockImplementation(async () => 1);

  const fixedPath = await getFixedTvEpisodePath('/File.mkv');

  assert.strictEqual(fixedPath, '/Specials/S00E01.mkv');
});
