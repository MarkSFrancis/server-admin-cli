import glob from 'glob'
import { promisify } from 'util'

/**
 * Converts a glob pattern to a file list array
 */
export const resolveGlob = promisify(glob)
