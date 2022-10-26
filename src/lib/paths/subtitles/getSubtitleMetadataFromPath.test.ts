import { getSubtitleMetadataFromPath } from './getSubtitleMetadataFromPath'

it('should set `default` to `undefined`', () => {
  const metadata = getSubtitleMetadataFromPath('/var/file.srt')

  expect(metadata.default).toBeUndefined()
})

it('should set `title` to `undefined`', () => {
  const metadata = getSubtitleMetadataFromPath('/var/file.srt')

  expect(metadata.title).toBeUndefined()
})

it('should set `codec` to the file extension without the "."', () => {
  const metadata = getSubtitleMetadataFromPath('/var/file.srt')

  expect(metadata.codec).toEqual('srt')
})

it('should set `codec` to `undefined` if no extension is present', () => {
  const metadata = getSubtitleMetadataFromPath('/var/file')

  expect(metadata.codec).toBeUndefined()
})

it.only('should set `forced` to `true` when using ".forced"', () => {
  const metadata = getSubtitleMetadataFromPath('/var/file.forced.srt')

  expect(metadata.isForced).toBeTruthy()
})

it('should set `closedCaptions` to `true` when using ".cc"', () => {
  const metadata = getSubtitleMetadataFromPath('/var/file.cc.srt')

  expect(metadata.isClosedCaptions).toBeTruthy()
})

it('should set `closedCaptions` to `true` when using ".sdh"', () => {
  const metadata = getSubtitleMetadataFromPath('/var/file.sdh.srt')

  expect(metadata.isClosedCaptions).toBeTruthy()
})

it('should set `closedCaptions` and forced to `true` when both are set in the path', () => {
  const metadata = getSubtitleMetadataFromPath('/var/file.cc.forced.srt')

  expect(metadata.isClosedCaptions).toBeTruthy()
  expect(metadata.isForced).toBeTruthy()
})

it('should set `closedCaptions` and `forced` to `false` when not set in the path', () => {
  const metadata = getSubtitleMetadataFromPath('/var/file.srt')

  expect(metadata.isClosedCaptions).toBeFalsy()
  expect(metadata.isForced).toBeFalsy()
})

it('should set `language` to `undefined` when unspecified', () => {
  const metadata = getSubtitleMetadataFromPath('/var/file.srt')

  expect(metadata.language).toBeUndefined()
})

it('should set `language` to "en" when set as "en" in the path', () => {
  const metadata = getSubtitleMetadataFromPath('/var/file.en.srt')

  expect(metadata.language).toEqual('en')
})

it('should set `language` to "eng" when set as "eng" in the path', () => {
  const metadata = getSubtitleMetadataFromPath('/var/file.eng.srt')

  expect(metadata.language).toEqual('eng')
})

it('should set `language` to "gre" when set as "gre" in the path', () => {
  const metadata = getSubtitleMetadataFromPath('/var/file.gre.srt')

  expect(metadata.language).toEqual('gre')
})

it('should set `language` to "el" when set as "el" in the path', () => {
  const metadata = getSubtitleMetadataFromPath('/var/file.el.srt')

  expect(metadata.language).toEqual('el')
})

it('should set `language` to `undefined` when set as an invalid language in the path', () => {
  const metadata = getSubtitleMetadataFromPath('/var/file.engrish.srt')

  expect(metadata.language).toBeUndefined()
})
