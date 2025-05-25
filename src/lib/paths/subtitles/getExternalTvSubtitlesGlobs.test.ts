import { getExternalTvSubtitlesGlobs } from './getExternalTvSubtitlesGlobs';
import { minimatch } from 'minimatch';
import { it } from 'node:test';
import assert from 'node:assert';

it('generates pattern for simple linux file path', () => {
  const pattern = getExternalTvSubtitlesGlobs('/var/file1.mkv');

  assert.strictEqual(
    pattern[0],
    '/var/**/file1/**/*+(.ass|.idx|.sub|.srt|.ssa|.smi|.vtt)'
  );
  assert.strictEqual(
    pattern[1],
    '/var/**/file1*+(.ass|.idx|.sub|.srt|.ssa|.smi|.vtt)'
  );
});

it('generates pattern for windows file path', () => {
  const pattern = getExternalTvSubtitlesGlobs('C:\\files\\file1.mkv');

  assert.strictEqual(
    pattern[0],
    'C:/files/**/file1/**/*+(.ass|.idx|.sub|.srt|.ssa|.smi|.vtt)'
  );
  assert.strictEqual(
    pattern[1],
    'C:/files/**/file1*+(.ass|.idx|.sub|.srt|.ssa|.smi|.vtt)'
  );
});

it('matches sibling subtitles', () => {
  const patterns = getExternalTvSubtitlesGlobs('/var/file1.mkv');

  const matches = patterns.find((p) => minimatch('/var/file1.eng.srt', p));

  assert.ok(matches);
});

it('matches child subtitles with the video file name', () => {
  const patterns = getExternalTvSubtitlesGlobs('/var/file1.mkv');

  const matches = patterns.find((p) => minimatch('/var/subs/file1.eng.srt', p));

  assert.ok(matches);
});

it('matches child subtitles with the video file name in a subfolder', () => {
  const patterns = getExternalTvSubtitlesGlobs('/var/file1.mkv');

  const matches = patterns.find((p) =>
    minimatch('/var/file1/English_1.srt', p)
  );

  assert.ok(matches);
});

it('does not match child subtitles with no video name', () => {
  const patterns = getExternalTvSubtitlesGlobs('/var/file1.mkv');

  const matches = patterns.find((p) => minimatch('/var/subs/English_1.srt', p));

  assert.strictEqual(matches, undefined);
});
