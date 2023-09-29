import { GlobOptionsWithFileTypesUnset } from 'glob'
import { fixWslPath } from './fixWslPath'
import { resolveGlob } from './resolveGlob'

export const resolveWslGlob = async (
  glob: string,
  options?: GlobOptionsWithFileTypesUnset
) => {
  const fixedGlob = fixWslGlob(glob)

  const results = await resolveGlob(fixedGlob, options)

  return results
}

export const fixWslGlob = (glob: string) => {
  const fixedGlob = fixWslPath(glob)

  return fixedGlob
}
