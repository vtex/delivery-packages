import {
  isCheckedIn,
  isPickupCheckedIn,
  filterSlasPerCheckIn,
  getLogisticsInfoFilteredByCheckIn,
  getItemsFilteredByCheckIn,
  getCheckInFlagsOnOrder,
} from '../src/checkin'
import { slas, createLogisticsInfoItem, createItems } from './mockGenerator'

const checkedInPickupPointId = slas.pickupCheckInSla.pickupPointId

describe('CheckIn', () => {
  describe('isCheckedIn', () => {
    it('should return false for empty values as order', () => {
      expect(isCheckedIn()).toBeFalsy()
      expect(isCheckedIn(null)).toBeFalsy()
      expect(isCheckedIn({})).toBeFalsy()
      expect(isCheckedIn([])).toBeFalsy()
    })

    it('should return false for order not checked in', () => {
      expect(isCheckedIn({ isCheckedIn: false })).toBeFalsy()
    })

    it('should return true for order checked in', () => {
      expect(isCheckedIn({ isCheckedIn: true })).toBeTruthy()
    })
  })

  describe('isPickupCheckedIn', () => {
    it('should return false for empty values as order', () => {
      expect(isPickupCheckedIn()).toBeFalsy()
      expect(isPickupCheckedIn(null)).toBeFalsy()
      expect(isPickupCheckedIn({})).toBeFalsy()
      expect(isPickupCheckedIn([])).toBeFalsy()
    })

    it('should return false for order not checked in on pickup point', () => {
      expect(
        isPickupCheckedIn({ checkedInPickupPointId: null, isCheckedIn: false })
      ).toBeFalsy()
      expect(isPickupCheckedIn({ storeId: 7, isCheckedIn: true })).toBeFalsy()
    })

    it('should return true for order checked in on pickup point', () => {
      expect(
        isCheckedIn({ checkedInPickupPointId, isCheckedIn: true })
      ).toBeTruthy()
    })
  })

  describe('getCheckInFlagsOnOrder', () => {
    it('should return empty object with empty params', () => {
      expect(getCheckInFlagsOnOrder()).toEqual({})
      expect(getCheckInFlagsOnOrder(null)).toEqual({})
    })

    it('should return delivery flag if isCheckedIn is false', () => {
      const order = {
        isCheckedIn: false,
      }

      const expectedFlags = {
        isDeliveryOnly: true,
        isCheckInOnMasterDataStore: false,
        isCheckInOnPickupPoint: false,
      }

      const orderFlags = getCheckInFlagsOnOrder(order)

      expect(orderFlags).toEqual(expectedFlags)
    })

    it('should return master data flag if isCheckedIn is true and doesnt have checkedInPickupPointId', () => {
      const order = {
        isCheckedIn: true,
        storeId: 7,
      }

      const expectedFlags = {
        isDeliveryOnly: false,
        isCheckInOnMasterDataStore: true,
        isCheckInOnPickupPoint: false,
      }

      const orderFlags = getCheckInFlagsOnOrder(order)

      expect(orderFlags).toEqual(expectedFlags)
    })

    it('should return pickup flag if isCheckedIn is true and have checkedInPickupPointId', () => {
      const order = {
        shippingData: {
          logisticsInfo: [
            createLogisticsInfoItem({
              slas: ['pickupCheckInSla'],
              selectedSla: 'pickupCheckInSla',
              index: 0,
            }),
            createLogisticsInfoItem({
              slas: ['normalSla', 'pickupSla', 'pickupCheckInSla'],
              selectedSla: 'pickupCheckInSla',
              index: 1,
            }),
          ],
        },
        isCheckedIn: true,
        checkedInPickupPointId,
      }

      const expectedFlags = {
        isDeliveryOnly: false,
        isCheckInOnMasterDataStore: false,
        isCheckInOnPickupPoint: true,
      }

      const orderFlags = getCheckInFlagsOnOrder(order)

      expect(orderFlags).toEqual(expectedFlags)
    })

    it('should return delivery flag if isCheckedIn is true, have checkedInPickupPointId and only have delivery items on logisticsInfo', () => {
      const order = {
        shippingData: {
          logisticsInfo: [
            createLogisticsInfoItem({
              slas: ['normalSla'],
              selectedSla: 'normalSla',
              index: 0,
            }),
            createLogisticsInfoItem({
              slas: ['normalSla', 'pickupSla', 'pickupCheckInSla'],
              selectedSla: 'normalSla',
              index: 1,
            }),
          ],
        },
        isCheckedIn: true,
        checkedInPickupPointId,
      }

      const expectedFlags = {
        isDeliveryOnly: true,
        isCheckInOnMasterDataStore: false,
        isCheckInOnPickupPoint: true,
      }

      const orderFlags = getCheckInFlagsOnOrder(order)

      expect(orderFlags).toEqual(expectedFlags)
    })
  })

  describe('filterSlasPerCheckIn', () => {
    it('should return empty array with empty params', () => {
      expect(filterSlasPerCheckIn()).toEqual([])
      expect(filterSlasPerCheckIn(null)).toEqual([])
    })

    it('should return filtered array with slas passed', () => {
      const order = {
        isCheckedIn: true,
        checkedInPickupPointId,
      }

      const slasParam = [
        slas.normalSla,
        slas.pickupCheckInSla,
        slas.normalSla,
        slas.pickupCheckInSla,
      ]

      const expectedSlas = [slas.pickupCheckInSla, slas.pickupCheckInSla]

      expect(filterSlasPerCheckIn(slasParam, order)).toEqual(expectedSlas)
    })
  })

  describe('getLogisticsInfoFilteredByCheckIn', () => {
    it('should return empty array with empty params', () => {
      expect(getLogisticsInfoFilteredByCheckIn()).toEqual([])
      expect(getLogisticsInfoFilteredByCheckIn(null)).toEqual([])
    })

    it('should return empty array with empty logisticsInfo', () => {
      expect(
        getLogisticsInfoFilteredByCheckIn({
          shippingData: {
            logisticsInfo: [],
          },
        })
      ).toEqual([])
    })

    it('should return filtered logisticsInfo by checkIn', () => {
      const logisticsInfo = [
        createLogisticsInfoItem({
          slas: ['pickupCheckInSla', 'expressSla'],
          selectedSla: 'pickupCheckInSla',
          index: 0,
        }),
        createLogisticsInfoItem({
          slas: ['pickupCheckInSla', 'normalSla'],
          selectedSla: 'normalSla',
          index: 1,
        }),
        createLogisticsInfoItem({
          slas: ['pickupCheckInSla', 'expressSla'],
          selectedSla: 'pickupCheckInSla',
          index: 2,
        }),
      ]
      const order = {
        isCheckedIn: true,
        checkedInPickupPointId,
        shippingData: {
          logisticsInfo,
        },
      }

      const expectedLogisticsInfo = [logisticsInfo[0], logisticsInfo[2]]

      expect(getLogisticsInfoFilteredByCheckIn(order)).toEqual(
        expectedLogisticsInfo
      )
    })

    it('should return same logisticsInfo if all are checked in', () => {
      const logisticsInfo = [
        createLogisticsInfoItem({
          slas: ['pickupCheckInSla', 'expressSla'],
          selectedSla: 'pickupCheckInSla',
          index: 0,
        }),
        createLogisticsInfoItem({
          slas: ['pickupCheckInSla', 'normalSla'],
          selectedSla: 'pickupCheckInSla',
          index: 1,
        }),
        createLogisticsInfoItem({
          slas: ['pickupCheckInSla', 'expressSla'],
          selectedSla: 'pickupCheckInSla',
          index: 2,
        }),
      ]
      const order = {
        isCheckedIn: true,
        checkedInPickupPointId,
        shippingData: {
          logisticsInfo,
        },
      }

      expect(getLogisticsInfoFilteredByCheckIn(order)).toEqual(logisticsInfo)
    })
  })

  describe('getItemsFilteredByCheckIn', () => {
    it('should return empty array with empty params', () => {
      expect(getItemsFilteredByCheckIn()).toEqual([])
      expect(getItemsFilteredByCheckIn(null)).toEqual([])
    })

    it('should return empty array with empty items', () => {
      expect(
        getItemsFilteredByCheckIn({
          items: [],
        })
      ).toEqual([])
    })

    it('should return filtered items according to filtered logisticsInfo that are checkedIn', () => {
      const items = createItems(3)
      const logisticsInfo = [
        createLogisticsInfoItem({
          slas: ['pickupCheckInSla', 'expressSla'],
          selectedSla: 'pickupCheckInSla',
          index: 0,
        }),
        createLogisticsInfoItem({
          slas: ['pickupCheckInSla', 'normalSla'],
          selectedSla: 'normalSla',
          index: 1,
        }),
        createLogisticsInfoItem({
          slas: ['pickupCheckInSla', 'expressSla'],
          selectedSla: 'pickupCheckInSla',
          index: 2,
        }),
      ]
      const order = {
        items,
        checkedInPickupPointId,
        isCheckedIn: true,
        shippingData: {
          logisticsInfo,
        },
      }

      const expectedItems = [items[0], items[2]]

      expect(getItemsFilteredByCheckIn(order)).toEqual(expectedItems)
    })
  })
})
