import { convertPathToGlob } from './convertPathToGlob'

it('should escape all special characters', () => {
  const escaped = convertPathToGlob('^[]()?!+@|*')

  expect(escaped).toEqual('\\^\\[\\]\\(\\)\\?\\!\\+\\@\\|\\*')
})

it('should escape multiple instaces of the same special character', () => {
  const escaped = convertPathToGlob('[[[test]]]')

  expect(escaped).toEqual('\\[\\[\\[test\\]\\]\\]')
})

it('should ignore non-special characters', () => {
  const escaped = convertPathToGlob('test')

  expect(escaped).toEqual('test')
})
