import { expand, rawlist, Separator } from '@inquirer/prompts';
import { basename } from 'path';
import { getSubfolders } from '../fs/getSubfolders';
import { convertPathToGlob } from '../fs/glob/convertPathToGlob';
import { SpecialFolders } from '../paths/SpeciaFolders';
import { promptForInput } from './promptForInput';

export const promptForMediaGlob = async () => {
  const specialPath = await getFolderSuggestPath();

  let globPattern: string;
  if (specialPath) {
    const path = await askForPathWithinSuggestion(specialPath);
    globPattern = convertPathToGlob(path);
    globPattern = `${globPattern}/**/*`;
  } else {
    globPattern = await promptForInput('Please enter a full glob pattern');
  }

  return globPattern;
};

const askForPathWithinSuggestion = async (suggestion: string) => {
  const subfolders = await getSubfolders(suggestion);

  const answer = await rawlist({
    message: 'Choose a subfolder',
    choices: subfolders.map((s) => ({
      name: basename(s),
      value: s,
    })),
  } as const);

  return answer;
};

const getFolderSuggestPath = async () => {
  const answer = await expand<SpecialFolders | undefined>({
    message:
      'Use a default glob pattern for a subfolder in a well known folder',
    choices: [
      {
        key: 'b',
        name: 'Books',
        value: SpecialFolders.Books,
      },
      {
        key: 'c',
        name: 'Clips',
        value: SpecialFolders.Clips,
      },
      {
        key: 'd',
        name: 'Downloads',
        value: SpecialFolders.Downloads,
      },
      {
        key: 'm',
        name: 'Movies',
        value: SpecialFolders.Movies,
      },
      {
        key: 'l',
        name: 'Music Library',
        value: SpecialFolders.Music,
      },
      {
        key: 'p',
        name: 'Pictures',
        value: SpecialFolders.Pictures,
      },
      {
        key: 't',
        name: 'TV',
        value: SpecialFolders.Tv,
      },
      new Separator(),
      {
        key: 'x',
        name: 'Use a custom glob pattern',
        value: undefined,
      },
    ],
  } as const);

  return answer;
};
