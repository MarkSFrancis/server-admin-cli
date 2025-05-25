import { type Stats } from 'fs';
import { stat } from 'fs/promises';

export const pathExists = async (path: string): Promise<false | Stats> => {
  try {
    const stats = await stat(path);
    return stats;
  } catch {
    return false;
  }
};
