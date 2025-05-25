import { basename } from 'path';
import { promptForInput } from '../../console/promptForInput';
import { distinct } from '../../distinct';

export const getTvSeasonNumber = async (path: string): Promise<number> => {
  const seasonPattern = /(S\d+)|(Season \d+)|(Specials)/gi;

  const results = [...path.matchAll(seasonPattern)];

  let seasonNumber = -1;

  const possibleSeasonNumbers = results
    .map((r) => {
      const specialSeasonName = 'specials';
      const longSeasonName = 'season ';
      const shortSeasonName = 's';
      const matchText = r[0];
      const normalizedMatchText = r[0].toLowerCase();

      if (normalizedMatchText.startsWith(longSeasonName)) {
        return matchText.substring(longSeasonName.length);
      } else if (normalizedMatchText.includes(specialSeasonName)) {
        return '0';
      } else {
        return matchText.substring(shortSeasonName.length);
      }
    })
    .map((r) => Number(r))
    .reduce<number[]>(distinct, []);

  if (possibleSeasonNumbers.length === 1) {
    seasonNumber = possibleSeasonNumbers[0];
  }

  while (seasonNumber < 0 || !Number.isInteger(seasonNumber)) {
    const seasonNumberText = await promptForInput(
      `Could not auto-detect season for ${basename(
        path
      )}. Please enter it manually: `
    );

    seasonNumber = Number(seasonNumberText);
  }

  return seasonNumber;
};
