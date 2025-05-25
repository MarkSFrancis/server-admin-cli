import { Iso6393Languages } from '@/lib/language/languages';
import { type SubtitleMetadata } from '@/lib/media-container/subtitles/getSubtitleMetadataFromStream';
import { confirm, select } from '@inquirer/prompts';

export const askForMissingSubtitlesMeta = async (meta: SubtitleMetadata) => {
  const newMeta: SubtitleMetadata = {
    ...meta,
  };

  if (!meta.language) {
    const response = await select<string>({
      message: 'What language are these subtitles?',
      choices: Iso6393Languages.map((l) => l.iso6392B).filter(
        (l): l is string => !!l
      ),
      default: 'eng',
    } as const);

    newMeta.language = response;
  }

  if (typeof meta.isForced === 'undefined') {
    const response = await confirm({
      message: 'Are these forced captions?',
      default: false,
    });

    newMeta.isForced = response;
  }

  if (typeof meta.isClosedCaptions === 'undefined') {
    const response = await confirm({
      message: 'Are these closed captions?',
      default: false,
    });

    newMeta.isClosedCaptions = response;
  }

  return newMeta;
};
