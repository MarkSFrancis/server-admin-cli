import { promptForInput } from '../../console/promptForInput';
import { mock, it, beforeEach } from 'node:test';
import assert from 'node:assert';

const promptForInputMock = mock.fn<typeof promptForInput>();

mock.module('../../console/promptForInput', {
  namedExports: {
    promptForInput: promptForInputMock,
  },
});

const { getTvSeasonNumber } = await import('./getTvSeasonNumber');

beforeEach(() => {
  promptForInputMock.mock.resetCalls();

  promptForInputMock.mock.mockImplementation(async () => {
    throw new Error('Mock should not have been called');
  });
});

it('should return 1 when the path includes "S1" in a a parent folder', async () => {
  const seasonNumber = await getTvSeasonNumber('/S1/E01.mkv');

  assert.strictEqual(seasonNumber, 1);
});

it('should return 2 when the path includes "Season 2" in a a parent folder', async () => {
  const seasonNumber = await getTvSeasonNumber('/Season 2/E01.mkv');

  assert.strictEqual(seasonNumber, 2);
});

it('should return 1 when the basename includes "S01"', async () => {
  const seasonNumber = await getTvSeasonNumber('/S01E01.mkv');

  assert.strictEqual(seasonNumber, 1);
});

it('should return 2 when the basename includes "Season 2"', async () => {
  const seasonNumber = await getTvSeasonNumber('/Season 2 E01.mkv');

  assert.strictEqual(seasonNumber, 2);
});

it('should ask for input when the path and basename include conflicting season IDs', async () => {
  promptForInputMock.mock.mockImplementation(async () => '5');
  const seasonNumber = await getTvSeasonNumber('/S01/Season 2 E01.mkv');

  assert.strictEqual(promptForInputMock.mock.callCount(), 1);
  assert.strictEqual(seasonNumber, 5);
});

it('should ask for input when no season IDs are found', async () => {
  promptForInputMock.mock.mockImplementation(async () => '5');
  const seasonNumber = await getTvSeasonNumber('/E01.mkv');

  assert.strictEqual(promptForInputMock.mock.callCount(), 1);
  assert.strictEqual(seasonNumber, 5);
});

it('should use season when the path and basename include matching season IDs', async () => {
  const seasonNumber = await getTvSeasonNumber('/S02/Season 2 E01.mkv');

  assert.strictEqual(promptForInputMock.mock.callCount(), 0);
  assert.strictEqual(seasonNumber, 2);
});
