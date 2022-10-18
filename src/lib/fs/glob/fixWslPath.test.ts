import { fixWslPath } from './fixWslPath'

it('should do nothing if the path is not a windows drive path', () => {
  const path = fixWslPath('/var/data.db')

  expect(path).toEqual('/var/data.db')
})

it('should preserve drive letter and use /mnt/', () => {
  const path = fixWslPath('c:\\file.txt')

  expect(path).toEqual('/mnt/c/file.txt')
})

it('should ignore case of the drive letter', () => {
  const path = fixWslPath('Z:\\file.txt')

  expect(path).toEqual('/mnt/z/file.txt')
})

it('should preserve path', () => {
  const path = fixWslPath('Z:\\folder\\file.txt')

  expect(path).toEqual('/mnt/z/folder/file.txt')
})
