import klaw, { Item } from 'klaw'

/**
 * Recursively gets all files from within a directory
 */
export const getAllFilesInDir = async (dir: string) => {
  return await new Promise<Item[]>((resolve, reject) => {
    const allFiles: Item[] = []

    klaw(dir)
      .on('data', (file) => allFiles.push(file))
      .on('end', () => resolve(allFiles))
      .on('error', (err) => reject(err))
  })
}
