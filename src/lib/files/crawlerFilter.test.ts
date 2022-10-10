import { Item } from 'klaw'
import { stub } from '../test-utils/stub'
import { filterByExtension } from './crawlerFilter'

describe('filterByExtension', () => {
  it('should return empty array if no extensions are provided', () => {
    const predicate = filterByExtension([])
    const files = stub<Item[]>([{ path: 'file1' }, { path: 'file2.mp3' }])

    const result = files.filter(predicate)

    expect(result).toHaveLength(0)
  })

  it('should return nothing if no files match', () => {
    const predicate = filterByExtension(['.mp4'])
    const files = stub<Item[]>([{ path: 'file1' }, { path: 'file2.mp3' }])

    const result = files.filter(predicate)

    expect(result).toHaveLength(0)
  })

  it('should return matches if a file with no extension is present and searched for', () => {
    const predicate = filterByExtension([''])
    const files = stub<Item[]>([{ path: 'file1' }, { path: 'file2.mp3' }])

    const result = files.filter(predicate)

    expect(result).toHaveLength(1)
  })

  it('should return matches if a file matches searched for extension', () => {
    const predicate = filterByExtension(['.mp3'])
    const files = stub<Item[]>([{ path: 'file1' }, { path: 'file2.mp3' }])

    const result = files.filter(predicate)

    expect(result).toHaveLength(1)
  })

  it("should return matches even if extension case doesn't match", () => {
    const predicate = filterByExtension(['.Mp3'])
    const files = stub<Item[]>([{ path: 'file2.mP3' }])

    const result = files.filter(predicate)

    expect(result).toHaveLength(1)
  })
})
