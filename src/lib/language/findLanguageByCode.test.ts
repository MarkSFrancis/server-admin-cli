import { findLanguageByCode } from './findLanguageByCode';
import { it } from 'node:test';
import assert from 'node:assert';

it('should return English for "en"', () => {
  const language = findLanguageByCode('en');

  assert.strictEqual(language?.name, 'English');
});

it('should return English for "eng"', () => {
  const language = findLanguageByCode('eng');

  assert.strictEqual(language?.name, 'English');
});

it('should return English for "English"', () => {
  const language = findLanguageByCode('English');

  assert.strictEqual(language?.name, 'English');
});

it('should return `undefined` for ""', () => {
  const language = findLanguageByCode('');

  assert.strictEqual(language, undefined);
});

it('should return English for "ENGLISH"', () => {
  const language = findLanguageByCode('ENGLISH');

  assert.strictEqual(language?.name, 'English');
});

it('should return Modern Greek (1453-) for "Greek"', () => {
  const language = findLanguageByCode('Greek');

  assert.strictEqual(language?.name, 'Modern Greek (1453-)');
});

it('should return Norwegian Bokmål for "Bokmal"', () => {
  const language = findLanguageByCode('Bokmal');

  assert.strictEqual(language?.name, 'Norwegian Bokmål');
});
