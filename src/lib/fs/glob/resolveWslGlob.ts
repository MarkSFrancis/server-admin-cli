import { fixWslPath } from './fixWslPath'
import { resolveGlob } from './resolveGlob'

export const resolveWslGlob = async (glob: string) => {
  const fixedGlob = fixWslGlob(glob)

  const results = await resolveGlob(fixedGlob)

  return results
}

export const fixWslGlob = (glob: string) => {
  const fixedGlob = fixWslPath(glob)

  return fixedGlob
}
