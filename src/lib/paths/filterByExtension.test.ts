import { filterByExtension } from './filterByExtension'

describe('filterByExtension', () => {
  it('should return empty array if no extensions are provided', () => {
    const predicate = filterByExtension([])
    const files = ['file1', 'file2.mp3']

    const result = files.filter(predicate)

    expect(result).toHaveLength(0)
  })

  it('should return nothing if no files match', () => {
    const predicate = filterByExtension(['.mp4'])
    const files = ['file1', 'file2.mp3']

    const result = files.filter(predicate)

    expect(result).toHaveLength(0)
  })

  it('should return matches if a file with no extension is present and searched for', () => {
    const predicate = filterByExtension([''])
    const files = ['file1', 'file2.mp3']

    const result = files.filter(predicate)

    expect(result).toHaveLength(1)
  })

  it('should return matches if a file matches searched for extension', () => {
    const predicate = filterByExtension(['.mp3'])
    const files = ['file1', 'file2.mp3']

    const result = files.filter(predicate)

    expect(result).toHaveLength(1)
  })

  it("should return matches even if extension case doesn't match", () => {
    const predicate = filterByExtension(['.Mp3'])
    const files = ['file2.mP3']

    const result = files.filter(predicate)

    expect(result).toHaveLength(1)
  })
})
