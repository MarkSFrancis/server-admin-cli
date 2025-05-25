import { fixWslPath } from './fixWslPath';
import { readFilesFromGlob, readFromGlob } from './resolveGlob';

export const resolveWslGlob = async (
  glob: string,
  options?: { nodir?: boolean }
) => {
  const fixedGlob = fixWslGlob(glob);

  if (options?.nodir) {
    return readFilesFromGlob(fixedGlob);
  } else {
    return readFromGlob(fixedGlob);
  }
};

export const fixWslGlob = (glob: string) => {
  const fixedGlob = fixWslPath(glob);

  return fixedGlob;
};
