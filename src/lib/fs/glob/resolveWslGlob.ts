import { fixWslPath } from './fixWslPath.ts';
import { readFilesFromGlob, readFromGlob } from './resolveGlob.ts';

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
