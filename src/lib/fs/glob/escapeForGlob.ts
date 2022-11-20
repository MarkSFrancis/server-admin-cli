const specialGlobChars = ['^', '[', ']', '(', ')', '?', '!', '+', '@', '|', '*']

export const escapeForGlob = (patternToEscape: string) => {
  let escaped = patternToEscape

  for (const specialChar of specialGlobChars) {
    escaped = escaped.replaceAll(specialChar, `\\${specialChar}`)
  }

  return escaped
}
