import { promptForInput } from '@/lib/console/promptForInput';
import assert from 'node:assert';
import { beforeEach, mock, test } from 'node:test';

const promptForInputMock = mock.fn<typeof promptForInput>();

mock.module('../../console/promptForInput', {
  namedExports: { promptForInput: promptForInputMock },
});

const { getTvEpisodeNumber } = await import('./getTvEpisodeNumber');

beforeEach(() => {
  promptForInputMock.mock.resetCalls();

  promptForInputMock.mock.mockImplementation(async () => {
    throw new Error('Mock should not have been called');
  });
});

test('should return 2 when the basename includes "E02"', async () => {
  const episodeNumber = await getTvEpisodeNumber('/E01/E02.mkv');

  assert.strictEqual(episodeNumber, 2);
});

test('should ignore folders and only match on basename', async () => {
  const episodeNumber = await getTvEpisodeNumber('/E01/E02.mkv');

  assert.strictEqual(episodeNumber, 2);
});

test('should return 2 when the basename includes "Episode 2"', async () => {
  const episodeNumber = await getTvEpisodeNumber('/E01/E02.mkv');

  assert.strictEqual(episodeNumber, 2);
});

test('should ask for input when the conflicting episode IDs are found', async () => {
  promptForInputMock.mock.mockImplementation(async () => '5');
  const episodeNumber = await getTvEpisodeNumber('/E01 (E02).mkv');

  assert.strictEqual(promptForInputMock.mock.calls.length, 1);
  assert.strictEqual(episodeNumber, 5);
});

test('should ask for input when no episode IDs are found', async () => {
  promptForInputMock.mock.mockImplementation(async () => '5');

  const episodeNumber = await getTvEpisodeNumber('/My Episode.mkv');

  assert.strictEqual(promptForInputMock.mock.calls.length, 1);
  assert.strictEqual(episodeNumber, 5);
});

test('should use episode when matching episode IDs are found', async () => {
  const episodeNumber = await getTvEpisodeNumber('/E02 (Episode 2).mkv');

  assert.strictEqual(promptForInputMock.mock.calls.length, 0);
  assert.strictEqual(episodeNumber, 2);
});

test('should ignore irrelevant [E123] monikers', async () => {
  const episodeNumber = await getTvEpisodeNumber('/E02 [E123].mkv');

  assert.strictEqual(promptForInputMock.mock.calls.length, 0);
  assert.strictEqual(episodeNumber, 2);
});

test('should detect number-only episode IDs', async () => {
  const episodeNumber = await getTvEpisodeNumber('Item - 03 - 1080p.mkv');

  assert.strictEqual(promptForInputMock.mock.calls.length, 0);
  assert.strictEqual(episodeNumber, 3);
});

test('should detect episode IDs right next to season IDs', async () => {
  const episodeNumber = await getTvEpisodeNumber('S01E03.mkv');

  assert.strictEqual(promptForInputMock.mock.calls.length, 0);
  assert.strictEqual(episodeNumber, 3);
});

test('should detect episode ID using . as the delimiter', async () => {
  const episodeNumber = await getTvEpisodeNumber('Item.E03.1080p.mkv');

  assert.strictEqual(promptForInputMock.mock.calls.length, 0);
  assert.strictEqual(episodeNumber, 3);
});
