import { Iso6393Languages } from '@/lib/language/languages'
import { SubtitleMetadata } from '@/lib/media-container/subtitles/getSubtitleMetadataFromStream'
import { prompt, QuestionCollection } from 'inquirer'

export const askForMissingSubtitlesMeta = async (meta: SubtitleMetadata) => {
  const newMeta: SubtitleMetadata = {
    ...meta,
  }

  if (!meta.language) {
    const languageQuestion: QuestionCollection<{ language: string }> = [
      {
        name: 'language',
        message: 'What language are these subtitles?',
        type: 'list',
        choices: Iso6393Languages.map((l) => l.iso6392B).filter((l) => !!l),
        default: 'eng',
      },
    ]

    const response = await prompt(languageQuestion)

    newMeta.language = response.language
  }

  if (typeof meta.isForced === 'undefined') {
    const forcedQuestion: QuestionCollection<{ forced: boolean }> = [
      {
        name: 'forced',
        message: 'Are these forced captions?',
        type: 'confirm',
        default: false,
      },
    ]

    const response = await prompt(forcedQuestion)

    newMeta.isForced = response.forced
  }

  if (typeof meta.isClosedCaptions === 'undefined') {
    const ccQuestion: QuestionCollection<{ cc: boolean }> = [
      {
        name: 'cc',
        message: 'Are these closed captions?',
        type: 'confirm',
        default: false,
      },
    ]

    const response = await prompt(ccQuestion)

    newMeta.isClosedCaptions = response.cc
  }

  return newMeta
}
