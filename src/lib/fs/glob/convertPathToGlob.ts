const specialGlobChars = ['^', '[', ']', '(', ')', '?', '!', '+', '@', '|', '*']

export const convertPathToGlob = (pathToEscape: string) => {
  let escaped = fixWindowsPathForGlob(pathToEscape)

  for (const specialChar of specialGlobChars) {
    escaped = escaped.replaceAll(specialChar, `\\${specialChar}`)
  }

  return escaped
}

/**
 * Corrects a glob that contains `\` to glob-compatible `/` seperators
 */
const fixWindowsPathForGlob = (glob: string) => {
  return glob.replaceAll('\\', '/')
}
