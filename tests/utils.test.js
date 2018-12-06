import { removeEmpty } from '../src/utils'

describe('Utils', () => {
  describe('removeEmpty', () => {
    it('should work with empty value', () => {
      expect(removeEmpty()).toEqual([])
      expect(removeEmpty(null)).toEqual([])
      expect(removeEmpty({})).toEqual([])
      expect(removeEmpty([])).toEqual([])
    })

    it('should work with different valid arrays of objects', () => {
      const expectedFinalArray = [{ id: 1 }, { id: 2 }]

      expect(removeEmpty(expectedFinalArray)).toEqual(expectedFinalArray)

      expect(removeEmpty([{ id: 1 }, [], { id: 2 }])).toEqual(
        expectedFinalArray
      )

      expect(removeEmpty([{ id: 1 }, {}, { id: 2 }])).toEqual(
        expectedFinalArray
      )

      expect(
        removeEmpty([null, { id: 1 }, undefined, {}, { id: 2 }, {}])
      ).toEqual(expectedFinalArray)
    })

    it('should work with different valid arrays of numbers, booleans and objects', () => {
      expect(removeEmpty([1, 2])).toEqual([1, 2])

      expect(removeEmpty([true, false])).toEqual([true])

      expect(
        removeEmpty([true, { id: 1 }, null, false, 0, 1, 2, { id: 2 }, {}, []])
      ).toEqual([true, { id: 1 }, 0, 1, 2, { id: 2 }])
    })
  })
})
