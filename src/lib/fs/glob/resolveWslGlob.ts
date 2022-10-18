import { fixWindowsGlob } from './fixWindowsGlob'
import { fixWslPath } from './fixWslPath'
import { resolveGlob } from './resolveGlob'

export const resolveWslGlob = async (glob: string) => {
  const fixedGlob = fixWslGlob(glob)

  const results = await resolveGlob(fixedGlob)

  return results
}

export const fixWslGlob = (glob: string) => {
  let fixedGlob = fixWslPath(glob)
  fixedGlob = fixWindowsGlob(glob)

  return fixedGlob
}
