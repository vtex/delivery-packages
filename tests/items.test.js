import { getNewItems } from '../src/items'

import { createItems } from './mockGenerator'

describe('Items', () => {
  describe('getNewItems', () => {
    it('should return null if no items is passed', () => {
      const baseItem = createItems(1)[0]

      const newItems1 = getNewItems()
      const newItems2 = getNewItems(null, null)
      const newItems3 = getNewItems(null, [{ itemsAdded: baseItem }])

      expect(newItems1).toBeNull()
      expect(newItems2).toBeNull()
      expect(newItems3).toBeNull()
    })

    it('should return same items if no real changes is passed', () => {
      const items = createItems(2)
      const noChanges = [
        {
          itemsAdded: [
            { ...items[0], quantity: 0 },
            { ...items[1], quantity: 0 },
          ],
        },
      ]

      const newItems1 = getNewItems(items, [])
      const newItems2 = getNewItems(items, [{}])
      const newItems3 = getNewItems(items, noChanges)

      expect(newItems1).toEqual(items)
      expect(newItems2).toEqual(items)
      expect(newItems3).toEqual(items)
    })

    it('should return same items if changes add and remove same quantity for items', () => {
      const items = createItems(2)
      const moreItems = createItems(4)
      const changes = [
        {
          itemsAdded: moreItems,
        },
        {
          itemsRemoved: items,
        },
      ]

      const newItems = getNewItems(items, changes)

      expect(newItems).toEqual(items)
    })

    it('should return add items if changes with add are passed', () => {
      const items = createItems(2)
      const changes = [
        {
          itemsAdded: items,
        },
      ]

      const expectedFinalItems = [
        { ...items[0], quantity: 2 },
        { ...items[1], quantity: 2 },
      ]

      const newItems = getNewItems(items, changes)

      expect(newItems).toEqual(expectedFinalItems)
    })

    it('should return less items if changes with remove are passed', () => {
      const items = createItems(4)
      const changes = [
        {
          itemsRemoved: [items[0]],
        },
        {
          itemsRemoved: [items[2], items[3]],
        },
      ]

      const expectedFinalItems = [{ ...items[1], quantity: 1 }]

      const newItems = getNewItems(items, changes)

      expect(newItems).toEqual(expectedFinalItems)
    })

    it('should return different items if changes with add and remove are passed', () => {
      const items = createItems(4)
      const changes = [
        {
          itemsRemoved: [items[0]],
        },
        {
          itemsRemoved: [items[2], items[3]],
        },
        {
          itemsAdded: [{ ...items[1], quantity: 2 }],
        },
      ]

      const expectedFinalItems = [{ ...items[1], quantity: 3 }]

      const newItems = getNewItems(items, changes)

      expect(newItems).toEqual(expectedFinalItems)
    })
  })
})
