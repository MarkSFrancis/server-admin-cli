const specialGlobChars = ['^', '[', ']', '(', ')', '?', '!', '+', '@', '|', '*']

export const escapeForGlob = (patternToEscape: string) => {
  let escaped = patternToEscape

  for (const specialChar of specialGlobChars) {
    escaped = escaped.replaceAll(specialChar, `\\${specialChar}`)
  }

  return escaped
}

it('should escape all special characters', () => {
  const escaped = escapeForGlob('^[]()?!+@|*')

  expect(escaped).toEqual('\\^\\[\\]\\(\\)\\?\\!\\+\\@\\|\\*')
})

it('should escape multiple instaces of the same special character', () => {
  const escaped = escapeForGlob('[[[test]]]')

  expect(escaped).toEqual('\\[\\[\\[test\\]\\]\\]')
})

it('should ignore non-special characters', () => {
  const escaped = escapeForGlob('test')

  expect(escaped).toEqual('test')
})
