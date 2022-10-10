import { distinct } from './distinct'

describe('distinct', () => {
  it('should return an empty array when given an empty array', () => {
    const unique = [].reduce(distinct, [])

    expect(unique).toEqual([])
  })

  it('should return all items when all items are unique', () => {
    const unique = [1, 2, 3].reduce<number[]>(distinct, [])

    expect(unique).toEqual([1, 2, 3])
  })

  it('should return distinct items when some are duplicates', () => {
    const unique = [1, 2, 1, 1, 3, 3].reduce<number[]>(distinct, [])

    expect(unique).toEqual([1, 2, 3])
  })
})
