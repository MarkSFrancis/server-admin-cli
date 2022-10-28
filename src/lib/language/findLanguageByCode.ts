import { Language, Iso6393Languages } from './languages'

/**
 * Converts a language code to a language if it's recognised against ISO-639-1, ISO-639-2/B, or ISO-639-2/T standards
 * @param code The language code to search for
 */
export const findLanguageByCode = (code: string): Language | undefined => {
  if (code.toUpperCase() === 'GREEK') {
    // Default to modern greek
    return findLanguageByCode('gre')
  }

  const languageMatch = Iso6393Languages.find(
    (l) =>
      l.iso6391 === code ||
      l.iso6392B === code ||
      l.iso6392T === code ||
      l.name.toUpperCase() === code.toUpperCase()
  )

  return languageMatch
}
