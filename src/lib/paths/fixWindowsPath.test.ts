import { fixWindowsPath } from './fixWindowsPath'

describe('fixWindowsPath', () => {
  it('should do nothing if the path is not a windows drive path', () => {
    const path = fixWindowsPath('/var/data.db')

    expect(path).toEqual('/var/data.db')
  })

  it('should preserve drive letter and use /mnt/', () => {
    const path = fixWindowsPath('c:\\file.txt')

    expect(path).toEqual('/mnt/c/file.txt')
  })

  it('should ignore case of the drive letter', () => {
    const path = fixWindowsPath('Z:\\file.txt')

    expect(path).toEqual('/mnt/z/file.txt')
  })

  it('should preserve path', () => {
    const path = fixWindowsPath('Z:\\folder\\file.txt')

    expect(path).toEqual('/mnt/z/folder/file.txt')
  })
})
