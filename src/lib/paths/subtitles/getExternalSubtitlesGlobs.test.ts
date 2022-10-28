import { getExternalSubtitlesGlobs } from './getExternalSubtitlesGlobs'
import minimatch from 'minimatch'

it('generates pattern for simple linux file path', () => {
  const pattern = getExternalSubtitlesGlobs('/var/file1.mkv')

  expect(pattern[0]).toEqual(
    '/var/**/file1/**/*+(.ass|.idx|.sub|.srt|.ssa|.smi|.vtt)'
  )
  expect(pattern[1]).toEqual(
    '/var/**/file1*+(.ass|.idx|.sub|.srt|.ssa|.smi|.vtt)'
  )
})

it('generates pattern for windows file path', () => {
  const pattern = getExternalSubtitlesGlobs('C:\\files\\file1.mkv')

  expect(pattern[0]).toEqual(
    'C:/files/**/file1/**/*+(.ass|.idx|.sub|.srt|.ssa|.smi|.vtt)'
  )
  expect(pattern[1]).toEqual(
    'C:/files/**/file1*+(.ass|.idx|.sub|.srt|.ssa|.smi|.vtt)'
  )
})

it('matches sibling subtitles', () => {
  const patterns = getExternalSubtitlesGlobs('/var/file1.mkv')

  const matches = patterns.find((p) => minimatch('/var/file1.eng.srt', p))

  expect(matches).toBeTruthy()
})

it('matches child subtitles with the video file name', () => {
  const patterns = getExternalSubtitlesGlobs('/var/file1.mkv')

  const matches = patterns.find((p) => minimatch('/var/subs/file1.eng.srt', p))

  expect(matches).toBeTruthy()
})

it('matches child subtitles with the video file name in a subfolder', () => {
  const patterns = getExternalSubtitlesGlobs('/var/file1.mkv')

  const matches = patterns.find((p) => minimatch('/var/file1/English_1.srt', p))

  expect(matches).toBeTruthy()
})

it('does not match child subtitles with no video name', () => {
  const patterns = getExternalSubtitlesGlobs('/var/file1.mkv')

  const matches = patterns.find((p) => minimatch('/var/subs/English_1.srt', p))

  expect(matches).toBeFalsy()
})
