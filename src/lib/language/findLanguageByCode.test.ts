import { findLanguageByCode } from './findLanguageByCode'

it('should return English for "en"', () => {
  const language = findLanguageByCode('en')

  expect(language?.name).toEqual('English')
})

it('should return English for "eng"', () => {
  const language = findLanguageByCode('eng')

  expect(language?.name).toEqual('English')
})

it('should return English for "English"', () => {
  const language = findLanguageByCode('English')

  expect(language?.name).toEqual('English')
})

it('should return `undefined` for ""', () => {
  const language = findLanguageByCode('')

  expect(language).toBeUndefined()
})

it('should return English for "ENGLISH"', () => {
  const language = findLanguageByCode('ENGLISH')

  expect(language?.name).toEqual('English')
})

it('should return Modern Greek (1453-) for "Greek"', () => {
  const language = findLanguageByCode('Greek')

  expect(language?.name).toEqual('Modern Greek (1453-)')
})

it('should return Norwegian Bokmål for "Bokmal"', () => {
  const language = findLanguageByCode('Bokmal')

  expect(language?.name).toEqual('Norwegian Bokmål')
})
