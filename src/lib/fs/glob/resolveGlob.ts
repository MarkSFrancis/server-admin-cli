import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * Converts a glob pattern to a file and directory array
 */
export const readFromGlob = (glob: string) => Array.fromAsync(fs.glob(glob));

/**
 * Converts a glob pattern to a file array
 */
export async function readFilesFromGlob(pattern: string | string[]) {
  const files: string[] = [];

  for await (const file of fs.glob(pattern, { withFileTypes: true })) {
    if (!file.isFile()) {
      continue;
    }

    files.push(path.join(file.parentPath, file.name));
  }

  return files;
}
