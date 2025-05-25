import { getSubtitleMetadataFromPath } from './getSubtitleMetadataFromPath';
import { it } from 'node:test';
import assert from 'node:assert';

it('should set `default` to `undefined`', () => {
  const metadata = getSubtitleMetadataFromPath('/var/file.srt');

  assert.strictEqual(metadata.default, undefined);
});

it('should set `title` to `undefined`', () => {
  const metadata = getSubtitleMetadataFromPath('/var/file.srt');

  assert.strictEqual(metadata.title, undefined);
});

it('should set `codec` to the file extension without the "."', () => {
  const metadata = getSubtitleMetadataFromPath('/var/file.srt');

  assert.strictEqual(metadata.codec, 'srt');
});

it('should set `codec` to `undefined` if no extension is present', () => {
  const metadata = getSubtitleMetadataFromPath('/var/file');

  assert.strictEqual(metadata.codec, undefined);
});

it.only('should set `forced` to `true` when using ".forced"', () => {
  const metadata = getSubtitleMetadataFromPath('/var/file.forced.srt');

  assert.ok(metadata.isForced);
});

it('should set `closedCaptions` to `true` when using ".cc"', () => {
  const metadata = getSubtitleMetadataFromPath('/var/file.cc.srt');

  assert.ok(metadata.isClosedCaptions);
});

it('should set `closedCaptions` to `true` when using ".sdh"', () => {
  const metadata = getSubtitleMetadataFromPath('/var/file.sdh.srt');

  assert.ok(metadata.isClosedCaptions);
});

it('should set `closedCaptions` and forced to `true` when both are set in the path', () => {
  const metadata = getSubtitleMetadataFromPath('/var/file.cc.forced.srt');

  assert.ok(metadata.isClosedCaptions);
  assert.ok(metadata.isForced);
});

it('should set `closedCaptions` and `forced` to `undefined` when not set in the path', () => {
  const metadata = getSubtitleMetadataFromPath('/var/file.srt');

  assert.strictEqual(metadata.isClosedCaptions, undefined);
  assert.strictEqual(metadata.isForced, undefined);
});

it('should set `language` to `undefined` when unspecified', () => {
  const metadata = getSubtitleMetadataFromPath('/var/file.srt');

  assert.strictEqual(metadata.language, undefined);
});

it('should set `language` to "en" when set as "en" in the path', () => {
  const metadata = getSubtitleMetadataFromPath('/var/file.en.srt');

  assert.strictEqual(metadata.language, 'en');
});

it('should set `language` to "eng" when set as "eng" in the path', () => {
  const metadata = getSubtitleMetadataFromPath('/var/file.eng.srt');

  assert.strictEqual(metadata.language, 'eng');
});

it('should set `language` to "gre" when set as "gre" in the path', () => {
  const metadata = getSubtitleMetadataFromPath('/var/file.gre.srt');

  assert.strictEqual(metadata.language, 'gre');
});

it('should set `language` to "el" when set as "el" in the path', () => {
  const metadata = getSubtitleMetadataFromPath('/var/file.el.srt');

  assert.strictEqual(metadata.language, 'el');
});

it('should set `language` to `undefined` when set as an invalid language in the path', () => {
  const metadata = getSubtitleMetadataFromPath('/var/file.engrish.srt');

  assert.strictEqual(metadata.language, undefined);
});
