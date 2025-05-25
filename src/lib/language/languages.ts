import iso6393 from 'iso-639-3';

/**
 * Category of a language:
 *
 * *   `'living'`
 *   — currently spoken language
 *   (example: `nhi` for `Zacatlán-Ahuacatlán-Tepetzintla Nahuatl`)
 * *   `'historical'`
 *   — extinct language distinct from modern languages that descended from it
 *   (example: `ofs` for `Old Frisian`)
 * *   `'extinct'`
 *   — language that went extinct recently
 *   (example: `rbp` for `Barababaraba`)
 * *   `'ancient'`
 *   — language that went extinct long ago
 *   (example: `got` for `Gothic`)
 * *   `'constructed'`
 *   — artificial languages, excluding programming languages
 *   (example: `epo` for `Esperanto`)
 * *   `'special'`
 *   — non-language codes
 *   (example: `und` for `Undetermined`)
 */
export type LanguageType =
  | 'living'
  | 'historical'
  | 'extinct'
  | 'ancient'
  | 'constructed'
  | 'special';

/**
 * Scope of a language:
 *
 * *   `'individual'`
 *   — normal, single language
 *   (example: `eng` for `English`)
 * *   `'macrolanguage'`
 *   — one-to-many grouping of languages, because older ISO 639s included them
 *   (example: `ara` for `Arabic`)
 * *   `'special'`
 *   — non-language codes
 *   (example: `und` for `Undetermined`)
 */
export type LanguageScope = 'individual' | 'macrolanguage' | 'special';

export interface Language {
  /**
   *   Name (example: `'English'`).
   */
  name: string;
  /**
   *   Type (example: `'living'`).
   */
  type: LanguageType;
  /**
   *   Scope (example: `'individual'`)
   */
  scope: LanguageScope;
  /**
   *   ISO 639-3 code.
   */
  iso6393: string;
  /**
   * ISO 639-2 (bibliographic) code (example: `'eng'`).
   */
  iso6392B?: string | undefined;
  /**
   * ISO 639-2 (terminologic) code (example: `'eng'`).
   */
  iso6392T?: string | undefined;
  /**
   * ISO 639-1 code (example: `'en'`).
   */
  iso6391?: string | undefined;
}

export const Iso6393Languages = iso6393 as Language[];
