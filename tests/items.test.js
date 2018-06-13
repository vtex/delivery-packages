import { getNewItems, getDeliveredItems } from '../src/items'

import { createItems, createPackage } from './mockGenerator'

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
  describe('getDeliveredItems', () => {
    it('should return null if invalid items and packages are passed', () => {
      const deliveredItems1 = getDeliveredItems()
      const deliveredItems2 = getDeliveredItems({ items: null, packages: null })

      expect(deliveredItems1).toBeNull()
      expect(deliveredItems2).toBeNull()
    })

    it('should return default empty object if empty items are passed', () => {
      const expectedEmptyObj = { delivered: [], toBeDelivered: [] }

      const deliveredItems = getDeliveredItems({ items: [], packages: null })

      expect(deliveredItems).toEqual(expectedEmptyObj)
    })

    it('should return correct delivered packages if valid params are passed', () => {
      const items = createItems(2)
      const packages = [
        createPackage([
          { itemIndex: 0, quantity: 1 },
          { itemIndex: 1, quantity: 1 },
        ]),
      ]

      const itemsWithIndex = items.map((item, index) => ({ ...item, index }))
      const packagesWithIndex = packages.map((pack, index) => ({
        ...pack,
        index,
      }))

      const expectedObj = {
        delivered: [
          {
            item: { id: '0', index: 0, quantity: 1, seller: '1' },
            package: {
              courierStatus: { finished: false },
              index: 0,
              invoiceNumber: '456',
              items: [
                { itemIndex: 0, quantity: 1 },
                { itemIndex: 1, quantity: 1 },
              ],
              trackingNumber: '123',
              trackingUrl: '',
            },
          },
          {
            item: { id: '1', index: 1, quantity: 1, seller: '1' },
            package: {
              courierStatus: { finished: false },
              index: 0,
              invoiceNumber: '456',
              items: [
                { itemIndex: 0, quantity: 1 },
                { itemIndex: 1, quantity: 1 },
              ],
              trackingNumber: '123',
              trackingUrl: '',
            },
          },
        ],
        toBeDelivered: [],
      }

      const deliveredItems = getDeliveredItems({
        items: itemsWithIndex,
        packages: packagesWithIndex,
      })

      expect(deliveredItems).toEqual(expectedObj)
    })

    it('should return correct to be delivered packages if valid params are passed', () => {
      const items = createItems(2)
      const packages = [
        createPackage([
          { itemIndex: 2, quantity: 1 },
          { itemIndex: 3, quantity: 1 },
        ]),
      ]

      const itemsWithIndex = items.map((item, index) => ({ ...item, index }))
      const packagesWithIndex = packages.map((pack, index) => ({
        ...pack,
        index,
      }))

      const expectedObj = {
        delivered: [],
        toBeDelivered: [
          { item: { id: '0', index: 0, quantity: 1, seller: '1' } },
          { item: { id: '1', index: 1, quantity: 1, seller: '1' } },
        ],
      }

      const deliveredItems = getDeliveredItems({
        items: itemsWithIndex,
        packages: packagesWithIndex,
      })

      expect(deliveredItems).toEqual(expectedObj)
    })
  })
})
