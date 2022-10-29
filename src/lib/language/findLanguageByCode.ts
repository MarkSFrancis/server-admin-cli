import { Language, Iso6393Languages } from './languages'

/**
 * Converts a language code to a language if it's recognised against ISO-639-1, ISO-639-2/B, or ISO-639-2/T standards
 * @param code The language code to search for
 */
export const findLanguageByCode = (code: string): Language | undefined => {
  const normalizedCode = normalizeLanguageCode(code)

  const languageMatch = Iso6393Languages.find(
    (l) =>
      l.iso6391 === normalizedCode ||
      l.iso6392B === normalizedCode ||
      l.iso6392T === normalizedCode ||
      l.name.toUpperCase() === normalizedCode
  )

  return languageMatch
}

const normalizeLanguageCode = (code: string) => {
  const normalized = code.toUpperCase()

  switch (normalized) {
    case 'GREEK':
      // Default to modern greek
      return 'MODERN GREEK (1453-)'
    case 'BOKMAL':
      return 'NORWEGIAN BOKMÅL'
    default:
      return normalized
  }
}
